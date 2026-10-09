"use client";

import "temporal-polyfill/global";
import React, { useState, useEffect, useMemo, useRef, useCallback, useSyncExternalStore } from "react";
import { ScheduleXCalendar, useNextCalendarApp } from "@schedule-x/react";
import {
  createViewDay,
  createViewWeek,
  createViewMonthGrid,
  createViewMonthAgenda,
  CalendarEventExternal,
} from "@schedule-x/calendar";
import "@schedule-x/theme-default/dist/index.css";
import "@/styling/schedule-x.css";

import {
  CalendarTaskItem,
  EisenhowerQuadrant,
  CreateTaskDto,
  OverrideOccurrenceDto,
} from "@/types/dashboard.types";
import {
  EisenhowerQuadrantEnum,
  TaskStatusEnum,
} from "@/constants/dashboard.enums";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  Sparkles,
  Clock,
  CheckCircle2,
  Repeat,
  Edit2,
  Trash2,
  X,
  RotateCcw,
} from "lucide-react";
import { rruleToFriendlyVi } from "@/utils/recurrence";
import { addMinutesToTime, isAllDayTimeRange, snapTime } from "@/utils/quickCreateTask";
import { QuickCreateTaskPopover } from "./quick-create-task-popover";
import { CALENDAR_EVENT_COMPONENTS, CalendarEventActionsContext } from "./calendar-event-card";
import { CALENDAR_HEADER_COMPONENTS, CalendarHeaderSlotsContext } from "./calendar-header-slots";
import { createCalendarPlugins } from "@/lib/schedule-x-plugins";
import { useTaskStatusToggle } from "@/hooks/useTaskStatusToggle";
import { CALENDAR_DND_INTERVAL_MINUTES, CALENDAR_QUADRANT_THEME } from "@/constants/calendar.constants";
import { compareCalendarEvents, getRescheduleChange, getTaskEventId, TaskRescheduleChange } from "@/utils/calendarEvent";
import { DialogShell } from "@/components/ui/dialog-shell";
import { usePresence, useRetainedValue } from "@/hooks/usePresence";
import { TRANSITION_MS, TRANSITION_CLASSES } from "@/constants/transition.constants";
import { QuickCreateDraft, QuickCreateHandlers } from "@/types/calendar-quick-create.types";
import { useQuickCreateDrafts } from "@/hooks/useQuickCreateDrafts";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { cn } from "@/lib/utils";
import { FIELD_TRIGGER_CLASS } from "@/constants/picker.constants";
import {
  QUICK_CREATE_DEFAULT_END,
  QUICK_CREATE_DEFAULT_START,
  QUICK_CREATE_DRAFT_EVENT_ID,
  QUICK_CREATE_LABELS,
  QUICK_CREATE_SNAP_MINUTES,
  QUICK_CREATE_QUADRANT_OPTIONS,
} from "@/constants/calendar-quick-create.constants";

export interface CalendarGridViewProps {
  tasks: CalendarTaskItem[];
  onOpenCreateModal?: (initialData?: {
    date?: string;
    startTime?: string;
    endTime?: string;
    quadrant?: EisenhowerQuadrant;
  }) => void;
  onSelectTask?: (task: CalendarTaskItem) => void;
  onRangeChange?: (startDate: string, endDate: string) => void;
  onToggleOccurrenceStatus?: (id: string, date: string, newStatus: TaskStatusEnum) => Promise<void>;
  onOverrideOccurrence?: (id: string, date: string, dto: OverrideOccurrenceDto) => Promise<void>;
  onCancelOccurrence?: (id: string, date: string) => Promise<void>;
  onUpdateSeries?: (id: string, dto: Partial<CreateTaskDto>) => Promise<void>;
  onDeleteSeries?: (id: string) => Promise<void>;
  /** Tạo nhanh qua popover (lưu khi bấm Lưu). Thiếu thì fallback về onOpenCreateModal */
  onQuickCreateTask?: QuickCreateHandlers["onCreate"];
  /** Nội dung đặt ở đầu hàng header của lịch (vd. nút chuyển chế độ xem) */
  headerLeading?: React.ReactNode;
  /** Đổi ngày/giờ sau khi kéo thả hoặc kéo giãn sự kiện. Thiếu thì tắt kéo thả */
  onRescheduleTask?: (task: CalendarTaskItem, change: TaskRescheduleChange) => Promise<void>;
}

function formatHHMMSS(t: string): string {
  const parts = t.split(":");
  const h = parts[0].padStart(2, "0");
  const m = (parts[1] || "00").padStart(2, "0");
  const s = (parts[2] || "00").padStart(2, "0");
  return `${h}:${m}:${s}`;
}

function taskToCalendarEvent(
  task: CalendarTaskItem,
  tz: string,
  todayStr: string
): CalendarEventExternal {
  const dateStr = task.occurrenceDate || todayStr;
  const quadrantKey = task.quadrant || EisenhowerQuadrantEnum.GOLD_ZONE;

  // Unique event ID: combine id & occurrenceDate for recurring occurrences
  const eventId = getTaskEventId({ ...task, occurrenceDate: dateStr });

  let startTemporal: Temporal.ZonedDateTime | Temporal.PlainDate;
  let endTemporal: Temporal.ZonedDateTime | Temporal.PlainDate;

  // Schedule-X phân loại theo kiểu Temporal: start & end đều là PlainDate → hàng all-day trên cùng.
  // Task cả ngày (không có giờ, hoặc quy ước 00:00–23:59) phải đi nhánh PlainDate, không được rơi xuống nhánh có giờ.
  const isAllDay = !task.startTime || isAllDayTimeRange(task.startTime, task.endTime);

  if (isAllDay) {
    startTemporal = Temporal.PlainDate.from(dateStr);
    endTemporal = Temporal.PlainDate.from(dateStr);
  } else if (task.startTime && task.endTime) {
    try {
      startTemporal = Temporal.PlainDateTime.from(
        `${dateStr}T${formatHHMMSS(task.startTime)}`
      ).toZonedDateTime(tz);
      endTemporal = Temporal.PlainDateTime.from(
        `${dateStr}T${formatHHMMSS(task.endTime)}`
      ).toZonedDateTime(tz);
      // Giờ kết thúc <= giờ bắt đầu (qua nửa đêm) → kết thúc vào ngày hôm sau
      if (Temporal.ZonedDateTime.compare(endTemporal, startTemporal) <= 0) {
        endTemporal = endTemporal.add({ days: 1 });
      }
    } catch {
      startTemporal = Temporal.PlainDate.from(dateStr);
      endTemporal = Temporal.PlainDate.from(dateStr);
    }
  } else if (task.startTime) {
    try {
      const s = Temporal.PlainDateTime.from(
        `${dateStr}T${formatHHMMSS(task.startTime)}`
      ).toZonedDateTime(tz);
      startTemporal = s;
      endTemporal = s.add({ minutes: task.estimatedMinutes || 60 });
    } catch {
      startTemporal = Temporal.PlainDate.from(dateStr);
      endTemporal = Temporal.PlainDate.from(dateStr);
    }
  } else {
    startTemporal = Temporal.PlainDate.from(dateStr);
    endTemporal = Temporal.PlainDate.from(dateStr);
  }

  return {
    id: eventId,
    title: task.isRecurring ? `🔁 ${task.title}` : task.title,
    description: task.description || undefined,
    calendarId: quadrantKey,
    start: startTemporal,
    end: endTemporal,
    _originalTask: task,
  };
}

/** Dựng CalendarTaskItem giả từ draft tạo nhanh để vẽ sự kiện nháp */
function draftToPreviewTask(draft: QuickCreateDraft): CalendarTaskItem {
  return {
    id: QUICK_CREATE_DRAFT_EVENT_ID,
    occurrenceDate: draft.scheduledDate,
    isRecurring: false,
    isOverridden: false,
    title: draft.title.trim() || QUICK_CREATE_LABELS.UNTITLED,
    quadrant: draft.quadrant,
    isGoldZone: draft.quadrant === EisenhowerQuadrantEnum.GOLD_ZONE,
    status: TaskStatusEnum.TODO,
    startTime: draft.isAllDay ? null : draft.startTime,
    endTime: draft.isAllDay ? null : draft.endTime,
    estimatedMinutes: 60,
  };
}

const emptySubscribe = () => () => {};

/** Custom components cho ScheduleXCalendar — tham chiếu ổn định ở module scope (đổi tham chiếu = calendar render lại từ đầu) */
const CALENDAR_CUSTOM_COMPONENTS = { ...CALENDAR_EVENT_COMPONENTS, ...CALENDAR_HEADER_COMPONENTS };

export const CalendarGridView: React.FC<CalendarGridViewProps> = ({
  tasks,
  onOpenCreateModal,
  onSelectTask,
  onRangeChange,
  onToggleOccurrenceStatus,
  onOverrideOccurrence,
  onCancelOccurrence,
  onUpdateSeries,
  onDeleteSeries,
  onQuickCreateTask,
  onRescheduleTask,
  headerLeading,
}) => {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [selectedEventTask, setSelectedEventTask] = useState<CalendarTaskItem | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete">("view");
  // Giữ dữ liệu task trong lúc modal chạy exit transition
  const displayedTask = useRetainedValue(selectedEventTask);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editQuadrant, setEditQuadrant] = useState<EisenhowerQuadrant>(EisenhowerQuadrantEnum.GOLD_ZONE);
  const [editScope, setEditScope] = useState<"instance" | "series">("instance");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick-create popover (giống Google Calendar) khi click vào ô lịch
  const calendarWrapperRef = useRef<HTMLDivElement>(null);
  const quickCreate = useQuickCreateDrafts();
  const { open: openQuickCreate, close: closeQuickCreate, updateDraft, drafts: quickDrafts } = quickCreate;
  const hasQuickCreate = !!onQuickCreateTask;

  // Popover đang mở lúc bắt đầu click → click đó chỉ dùng để đóng popover, không tạo draft mới (giống Google Calendar)
  const isQuickCreateOpenRef = useRef(false);
  const clickStartedWhileOpenRef = useRef(false);
  useEffect(() => {
    isQuickCreateOpenRef.current = !!quickCreate.activeSlot;
  }, [quickCreate.activeSlot]);

  const openSlotRef = useRef<(slot: { date: string; startTime: string; endTime: string }, e?: UIEvent) => void>(
    () => {}
  );
  useEffect(() => {
    openSlotRef.current = (slot, e) => {
      if (clickStartedWhileOpenRef.current || isQuickCreateOpenRef.current) {
        clickStartedWhileOpenRef.current = false;
        closeQuickCreate();
        return;
      }
      if (!hasQuickCreate) {
        onOpenCreateModal?.(slot);
        return;
      }
      const rect = calendarWrapperRef.current?.getBoundingClientRect();
      const pointer = e && "clientX" in e ? (e as MouseEvent) : null;
      const anchor =
        rect && pointer
          ? { x: pointer.clientX - rect.left, y: pointer.clientY - rect.top }
          : { x: (rect?.width ?? 0) / 2, y: 80 };
      // Thêm draft vào state ngay lập tức → sự kiện hiện trên lịch trước khi lưu DB
      openQuickCreate({ ...slot, anchor });
    };
  }, [hasQuickCreate, onOpenCreateModal, openQuickCreate, closeQuickCreate]);

  const activeQuickKey = quickCreate.activeSlot?.key;
  // Giữ popover (với slot/draft cuối) trong DOM để Radix chạy xong exit animation
  const quickCreatePresence = usePresence(!!quickCreate.activeSlot, TRANSITION_MS.POPOVER);
  const displayedQuickSlot = useRetainedValue(quickCreate.activeSlot);
  const displayedQuickDraft = useRetainedValue(quickCreate.activeDraft);
  const handleQuickPreviewChange = useCallback(
    (draft: QuickCreateDraft) => {
      if (activeQuickKey !== undefined) updateDraft(activeQuickKey, draft);
    },
    [activeQuickKey, updateDraft]
  );

  // Keep refs for stable callback references
  const onSelectTaskRef = useRef(onSelectTask);
  useEffect(() => {
    onSelectTaskRef.current = onSelectTask;
  }, [onSelectTask]);

  const tasksRef = useRef(tasks);
  useEffect(() => {
    tasksRef.current = tasks;
  }, [tasks]);

  const findTaskByEventId = (eventId: string | number) =>
    tasksRef.current.find((t) => getTaskEventId(t) === String(eventId));

  // Tick hoàn thành (optimistic) — dùng chung cho ô sự kiện và modal chi tiết
  const { getStatus, toggleStatus } = useTaskStatusToggle(onToggleOccurrenceStatus);
  const eventActions = useMemo(() => ({ getStatus, toggleStatus }), [getStatus, toggleStatus]);
  const headerSlots = useMemo(
    () => ({ leading: headerLeading, onCreate: onOpenCreateModal ? () => onOpenCreateModal() : undefined }),
    [headerLeading, onOpenCreateModal]
  );

  // Plugin kéo thả / kéo giãn: tạo 1 lần cho calendar app
  const [calendarPlugins] = useState(() => createCalendarPlugins(CALENDAR_DND_INTERVAL_MINUTES));

  const onRangeChangeRef = useRef(onRangeChange);
  useEffect(() => {
    onRangeChangeRef.current = onRangeChange;
  }, [onRangeChange]);

  // Convert tasks (+ quick-create draft) to Schedule-X events
  const mappedEvents = useMemo<CalendarEventExternal[]>(() => {
    const tz = Temporal.Now.timeZoneId();
    const todayStr = Temporal.Now.plainDateISO().toString();

    const events = tasks.map((task) => taskToCalendarEvent(task, tz, todayStr));

    quickDrafts.forEach(({ key, draft }) => {
      events.push({
        ...taskToCalendarEvent(draftToPreviewTask(draft), tz, todayStr),
        id: `${QUICK_CREATE_DRAFT_EVENT_ID}_${key}`,
      });
    });
    return events.sort(compareCalendarEvents);
  }, [tasks, quickDrafts]);

  const mappedEventsRef = useRef(mappedEvents);
  useEffect(() => {
    mappedEventsRef.current = mappedEvents;
  }, [mappedEvents]);

  // Initialize Calendar App
  const calendar = useNextCalendarApp(
    {
    views: [
      createViewWeek(),
      createViewDay(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    defaultView: "week",
    // Schedule-X mặc định hiển thị theo UTC → phải dùng múi giờ local, nếu không sự kiện bị lệch giờ
    timezone: Temporal.Now.timeZoneId(),
    selectedDate: Temporal.Now.plainDateISO(),
    calendars: CALENDAR_QUADRANT_THEME,
    dayBoundaries: {
      start: "06:00",
      end: "23:00",
    },
    weekOptions: {
      gridHeight: 850,
      gridStep: 60,
    },
    callbacks: {
      // Chặn trước các vị trí không lưu được (nhiều ngày, đổi cả ngày ↔ có giờ, task lặp sang ngày khác, nháp)
      onBeforeEventUpdate(_oldEvent, newEvent) {
        const task = findTaskByEventId(newEvent.id);
        return !!task && !!onRescheduleRef.current && !!getRescheduleChange(task, newEvent.start, newEvent.end);
      },
      onEventUpdate(updatedEvent) {
        void handleEventUpdateRef.current(updatedEvent);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onRangeUpdate(range: any) {
        try {
          if (range?.start && range?.end) {
            const startStr = range.start.toPlainDate().toString();
            const endStr = range.end.toPlainDate().toString();
            onRangeChangeRef.current?.(startStr, endStr);
          }
        } catch (e) {
          console.error("onRangeUpdate parse error:", e);
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClickDateTime(dateTime: any, e?: UIEvent) {
        try {
          let dateStr = "";
          let startStr = QUICK_CREATE_DEFAULT_START;

          if (dateTime && typeof dateTime.toPlainDate === "function") {
            dateStr = dateTime.toPlainDate().toString();
            startStr = dateTime.toPlainTime().toString().slice(0, 5);
          } else if (typeof dateTime === "string") {
            const [d, t] = dateTime.replace("T", " ").trim().split(" ");
            dateStr = d;
            if (t) startStr = t.slice(0, 5);
          }

          if (dateStr) {
            const snappedStart = snapTime(startStr, QUICK_CREATE_SNAP_MINUTES);
            openSlotRef.current(
              {
                date: dateStr,
                startTime: snappedStart,
                endTime: addMinutesToTime(snappedStart, 60),
              },
              e
            );
          }
        } catch (err) {
          console.error("onClickDateTime parse error:", err);
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClickDate(date: any, e?: UIEvent) {
        try {
          const raw = typeof date?.toString === "function" ? date.toString() : String(date);
          const dateStr = raw.replace("T", " ").split(" ")[0];
          if (dateStr) {
            openSlotRef.current(
              {
                date: dateStr,
                startTime: QUICK_CREATE_DEFAULT_START,
                endTime: QUICK_CREATE_DEFAULT_END,
              },
              e
            );
          }
        } catch (err) {
          console.error("onClickDate parse error:", err);
        }
      },
      onEventClick(calendarEvent) {
        const found = findTaskByEventId(calendarEvent.id);

        if (found) {
          setSelectedEventTask(found);
          setModalMode("view");
          setEditTitle(found.title);
          const allDay = isAllDayTimeRange(found.startTime, found.endTime);
          setEditStartTime(found.startTime && !allDay ? found.startTime.slice(0, 5) : "");
          setEditEndTime(found.endTime && !allDay ? found.endTime.slice(0, 5) : "");
          setEditQuadrant(found.quadrant);
          setEditScope(found.isRecurring ? "instance" : "series");
          onSelectTaskRef.current?.(found);
        }
      },
    },
    },
    calendarPlugins
  );

  // Lưu vị trí mới sau kéo thả / kéo giãn; lỗi thì trả sự kiện về chỗ cũ
  const onRescheduleRef = useRef(onRescheduleTask);
  const handleEventUpdateRef = useRef<(event: CalendarEventExternal) => Promise<void>>(async () => {});
  useEffect(() => {
    onRescheduleRef.current = onRescheduleTask;
    handleEventUpdateRef.current = async (event) => {
      const task = findTaskByEventId(event.id);
      const change = task && getRescheduleChange(task, event.start, event.end);
      if (!task || !change || !onRescheduleTask) return;
      try {
        await onRescheduleTask(task, change);
      } catch (err) {
        console.error("Error rescheduling task:", err);
        calendar?.events.set(mappedEventsRef.current);
      }
    };
  });

  // Keep calendar events in sync with incoming tasks
  useEffect(() => {
    if (calendar && calendar.events) {
      calendar.events.set(mappedEvents);
    }
  }, [calendar, mappedEvents]);

  // Handle Save Edit
  const handleSaveEdit = async () => {
    if (!selectedEventTask || !editTitle.trim()) return;
    setIsSubmitting(true);
    try {
      if (selectedEventTask.isRecurring && editScope === "instance") {
        if (onOverrideOccurrence) {
          await onOverrideOccurrence(
            selectedEventTask.id,
            selectedEventTask.occurrenceDate,
            {
              title: editTitle.trim(),
              startTime: editStartTime ? `${editStartTime}:00` : undefined,
              endTime: editEndTime ? `${editEndTime}:00` : undefined,
              quadrant: editQuadrant,
            }
          );
        }
      } else {
        if (onUpdateSeries) {
          await onUpdateSeries(selectedEventTask.id, {
            title: editTitle.trim(),
            startTime: editStartTime ? `${editStartTime}:00` : undefined,
            endTime: editEndTime ? `${editEndTime}:00` : undefined,
            quadrant: editQuadrant,
          });
        }
      }
      setSelectedEventTask(null);
    } catch (err) {
      console.error("Error saving task edit:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Cancel Occurrence (Delete single instance)
  const handleCancelInstance = async () => {
    if (!selectedEventTask) return;
    setIsSubmitting(true);
    try {
      if (onCancelOccurrence) {
        await onCancelOccurrence(selectedEventTask.id, selectedEventTask.occurrenceDate);
      }
      setSelectedEventTask(null);
    } catch (err) {
      console.error("Error cancelling occurrence:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Delete Entire Series
  const handleDeleteAll = async () => {
    if (!selectedEventTask) return;
    setIsSubmitting(true);
    try {
      if (onDeleteSeries) {
        await onDeleteSeries(selectedEventTask.id);
      }
      setSelectedEventTask(null);
    } catch (err) {
      console.error("Error deleting series:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) {
    return (
      <Card className="w-full h-[640px] flex items-center justify-center bg-surface rounded-xl border border-border">
        <div className="flex flex-col items-center gap-2 text-text-tertiary">
          <CalendarIcon className="w-7 h-7 animate-pulse text-primary" />
          <span className="text-xs font-medium">Đang tải lịch biểu...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full p-0 overflow-hidden bg-surface shadow-warm rounded-xl border border-border">
      {/* Schedule-X Calendar Wrapper */}
      <div
        ref={calendarWrapperRef}
        onPointerDownCapture={() => {
          clickStartedWhileOpenRef.current = isQuickCreateOpenRef.current;
        }}
        className="relative w-full overflow-hidden bg-surface min-h-[640px]"
      >
        {calendar && (
          <CalendarHeaderSlotsContext.Provider value={headerSlots}>
            <CalendarEventActionsContext.Provider value={eventActions}>
              <ScheduleXCalendar calendarApp={calendar} customComponents={CALENDAR_CUSTOM_COMPONENTS} />
            </CalendarEventActionsContext.Provider>
          </CalendarHeaderSlotsContext.Provider>
        )}

        {quickCreatePresence.isMounted && displayedQuickSlot && displayedQuickDraft && onQuickCreateTask && (
          <QuickCreateTaskPopover
            key={displayedQuickSlot.key}
            open={!!quickCreate.activeSlot}
            anchor={displayedQuickSlot.anchor}
            anchorEventId={`${QUICK_CREATE_DRAFT_EVENT_ID}_${displayedQuickSlot.key}`}
            initialDraft={displayedQuickDraft.draft}
            onClose={quickCreate.close}
            onPreviewChange={handleQuickPreviewChange}
            onCreate={onQuickCreateTask}
          />
        )}
      </div>

      {/* Interactive Task Details & Action Modal */}
      {displayedTask && (
        <DialogShell
          open={!!selectedEventTask}
          onClose={() => setSelectedEventTask(null)}
          overlayClassName="bg-black/40"
          className="max-w-md p-5 space-y-4"
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-2 border-b border-border/50 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge
                    variant={displayedTask.isGoldZone ? "gold" : "primary"}
                    className="text-[10px] font-medium rounded-md inline-flex items-center gap-1"
                  >
                    {displayedTask.isGoldZone ? (
                      <>
                        <Sparkles className="w-3 h-3 text-accent-gold stroke-[1.8]" />
                        <span>Gold Zone (+30 XP)</span>
                      </>
                    ) : (
                      <span>{displayedTask.quadrant}</span>
                    )}
                  </Badge>

                  {displayedTask.isRecurring && (
                    <Badge variant="primary" className="text-[10px] inline-flex items-center gap-1">
                      <Repeat className="w-3 h-3" />
                      <span>{rruleToFriendlyVi(displayedTask.rrule)}</span>
                    </Badge>
                  )}

                  {displayedTask.isOverridden && (
                    <Badge variant="amber" className="text-[10px] inline-flex items-center gap-1">
                      ✏️ Đã đổi lịch riêng ngày này
                    </Badge>
                  )}
                </div>

                <h4 className="text-base font-serif-display font-bold text-text-primary leading-snug">
                  {displayedTask.title}
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEventTask(null)}
                className="text-text-tertiary hover:text-text-primary p-1 rounded-lg hover:bg-surface-secondary transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body: VIEW MODE */}
            {modalMode === "view" && (
              <div className={cn("space-y-4", TRANSITION_CLASSES.FADE_IN)}>
                {displayedTask.description && (
                  <p className="text-xs text-text-secondary whitespace-pre-wrap bg-surface-secondary p-3 rounded-lg border border-border">
                    {displayedTask.description}
                  </p>
                )}

                <div className="space-y-2 text-xs text-text-tertiary">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-3.5 h-3.5 stroke-[1.8]" />
                    <span className="text-text-secondary font-medium">
                      {displayedTask.occurrenceDate}
                    </span>
                    {isAllDayTimeRange(displayedTask.startTime, displayedTask.endTime) ? (
                      <span>({QUICK_CREATE_LABELS.ALL_DAY})</span>
                    ) : (
                      displayedTask.startTime &&
                      displayedTask.endTime && (
                        <span>({displayedTask.startTime.slice(0, 5)} – {displayedTask.endTime.slice(0, 5)})</span>
                      )
                    )}
                  </div>

                  {displayedTask.estimatedMinutes && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 stroke-[1.8]" />
                      <span>
                        Dự kiến: <strong className="text-text-secondary">{displayedTask.estimatedMinutes} phút</strong>
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[1.8]" />
                    <span>
                      Trạng thái:{" "}
                      <strong className={getStatus(displayedTask) === TaskStatusEnum.COMPLETED ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-text-secondary"}>
                        {getStatus(displayedTask) === TaskStatusEnum.COMPLETED ? "Đã hoàn thành" : "Cần làm (TODO)"}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Primary Actions: Toggle Status & Edit / Delete */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                  <button
                    type="button"
                    onClick={() => toggleStatus(displayedTask)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      getStatus(displayedTask) === TaskStatusEnum.COMPLETED
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-primary text-on-primary hover:bg-primary-hover shadow-warm-xs"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" />
                    <span>
                      {getStatus(displayedTask) === TaskStatusEnum.COMPLETED
                        ? "Hoàn thành (Bấm để hủy)"
                        : "Đánh dấu hoàn thành"}
                    </span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setModalMode("edit")}
                      className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary border border-border/70 transition-colors cursor-pointer"
                      title="Chỉnh sửa công việc"
                    >
                      <Edit2 className="w-3.5 h-3.5 stroke-[1.8]" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalMode("delete")}
                      className="p-2 rounded-lg text-rose-500 hover:bg-rose-500/10 border border-rose-500/20 transition-colors cursor-pointer"
                      title="Xóa công việc"
                    >
                      <Trash2 className="w-3.5 h-3.5 stroke-[1.8]" />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Body: EDIT MODE */}
            {modalMode === "edit" && (
              <div className={cn("space-y-3", TRANSITION_CLASSES.FADE_IN)}>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-text-secondary">Tiêu đề công việc:</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className={cn("w-full text-xs bg-surface-secondary border border-border rounded-lg px-2.5 py-1.5 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary", TRANSITION_CLASSES.INTERACTIVE)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-text-secondary">Giờ bắt đầu:</label>
                    <TimePicker value={editStartTime} onChange={setEditStartTime} showIcon className="w-full rounded-lg" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-text-secondary">Giờ kết thúc:</label>
                    <TimePicker
                      value={editEndTime}
                      onChange={setEditEndTime}
                      durationFrom={editStartTime || undefined}
                      showIcon
                      className="w-full rounded-lg"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-text-secondary">Mức độ ưu tiên (Eisenhower):</label>
                  <Select value={editQuadrant} onValueChange={(v) => setEditQuadrant(v as EisenhowerQuadrant)}>
                    <SelectTrigger size="sm" className={cn(FIELD_TRIGGER_CLASS, "w-full")}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      {QUICK_CREATE_QUADRANT_OPTIONS.map((opt) => (
                        <SelectItem key={opt.key} value={opt.key} className="text-xs">
                          {opt.name} — {opt.hint}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {displayedTask.isRecurring && (
                  <div className="space-y-1.5 p-2.5 bg-surface-secondary rounded-lg border border-border text-xs">
                    <label className="font-semibold text-text-primary block">Phạm vi áp dụng chỉnh sửa:</label>
                    <div className="space-y-1">
                      <label className="flex items-center gap-2 cursor-pointer text-text-secondary">
                        <input
                          type="radio"
                          name="editScope"
                          checked={editScope === "instance"}
                          onChange={() => setEditScope("instance")}
                          className={cn("accent-primary", TRANSITION_CLASSES.INTERACTIVE)}
                        />
                        <span>Chỉ ngày này ({displayedTask.occurrenceDate})</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-text-secondary">
                        <input
                          type="radio"
                          name="editScope"
                          checked={editScope === "series"}
                          onChange={() => setEditScope("series")}
                          className={cn("accent-primary", TRANSITION_CLASSES.INTERACTIVE)}
                        />
                        <span>Toàn bộ chuỗi lặp lại</span>
                      </label>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/50">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setModalMode("view")}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-secondary text-text-secondary hover:text-text-primary border border-border cursor-pointer transition-colors duration-150"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting || !editTitle.trim()}
                    onClick={handleSaveEdit}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary text-on-primary hover:bg-primary-hover shadow-warm-xs cursor-pointer disabled:opacity-50 transition-colors duration-150"
                  >
                    {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              </div>
            )}

            {/* Modal Body: DELETE CONFIRMATION */}
            {modalMode === "delete" && (
              <div className={cn("space-y-3", TRANSITION_CLASSES.FADE_IN)}>
                <p className="text-xs text-text-secondary leading-relaxed">
                  {displayedTask.isRecurring
                    ? "Đây là một công việc lặp lại định kỳ. Bạn muốn xóa theo cách nào?"
                    : "Bạn có chắc chắn muốn xóa công việc này không?"}
                </p>

                {displayedTask.isRecurring ? (
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleCancelInstance}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg bg-surface-secondary hover:bg-surface-tertiary border border-border text-text-primary transition-colors cursor-pointer text-left"
                    >
                      <div>
                        <div className="font-semibold">Chỉ xóa ngày này</div>
                        <div className="text-[10px] text-text-tertiary">
                          Bỏ qua ngày {displayedTask.occurrenceDate}, giữ nguyên các ngày khác
                        </div>
                      </div>
                      <RotateCcw className="w-3.5 h-3.5 text-text-tertiary" />
                    </button>

                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleDeleteAll}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer text-left"
                    >
                      <div>
                        <div>Xóa toàn bộ chuỗi lặp lại</div>
                        <div className="text-[10px] text-rose-500/80 font-normal">
                          Xóa hoàn toàn chuỗi công việc này khỏi toàn bộ lịch
                        </div>
                      </div>
                      <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                    </button>
                  </div>
                ) : (
                  <div className="pt-1">
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={handleDeleteAll}
                      className="w-full px-3 py-2 text-xs font-semibold rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer"
                    >
                      {isSubmitting ? "Đang xóa..." : "Xác nhận xóa"}
                    </button>
                  </div>
                )}

                <div className="flex justify-end pt-2 border-t border-border/50">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => setModalMode("view")}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-secondary text-text-secondary hover:text-text-primary border border-border cursor-pointer transition-colors duration-150"
                  >
                    Quay lại
                  </button>
                </div>
              </div>
            )}
        </DialogShell>
      )}
    </Card>
  );
};
