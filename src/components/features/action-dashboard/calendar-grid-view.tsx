"use client";

import "temporal-polyfill/global";
import React, { useState, useEffect, useMemo, useRef, useSyncExternalStore } from "react";
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
  Plus,
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
}

const QUADRANTS_THEME = {
  [EisenhowerQuadrantEnum.GOLD_ZONE]: {
    colorName: "goldZone",
    lightColors: {
      main: "#c8832a",
      container: "#faebd7",
      onContainer: "#6b4312",
    },
    darkColors: {
      main: "#e2a84e",
      container: "#382613",
      onContainer: "#faebd7",
    },
  },
  [EisenhowerQuadrantEnum.DO_FIRST]: {
    colorName: "doFirst",
    lightColors: {
      main: "#b84e46",
      container: "#fae8e6",
      onContainer: "#632520",
    },
    darkColors: {
      main: "#df7068",
      container: "#381a17",
      onContainer: "#fae8e6",
    },
  },
  [EisenhowerQuadrantEnum.DELEGATE]: {
    colorName: "delegate",
    lightColors: {
      main: "#527a5d",
      container: "#eaf2ec",
      onContainer: "#233b2a",
    },
    darkColors: {
      main: "#6ea07c",
      container: "#1a2b1f",
      onContainer: "#eaf2ec",
    },
  },
  [EisenhowerQuadrantEnum.ELIMINATE]: {
    colorName: "eliminate",
    lightColors: {
      main: "#7c7267",
      container: "#f2ede4",
      onContainer: "#3b352f",
    },
    darkColors: {
      main: "#9e9488",
      container: "#28231f",
      onContainer: "#f2ede4",
    },
  },
};

function formatHHMMSS(t: string): string {
  const parts = t.split(":");
  const h = parts[0].padStart(2, "0");
  const m = (parts[1] || "00").padStart(2, "0");
  const s = (parts[2] || "00").padStart(2, "0");
  return `${h}:${m}:${s}`;
}

const emptySubscribe = () => () => {};

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
}) => {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [selectedEventTask, setSelectedEventTask] = useState<CalendarTaskItem | null>(null);
  const [modalMode, setModalMode] = useState<"view" | "edit" | "delete">("view");

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [editQuadrant, setEditQuadrant] = useState<EisenhowerQuadrant>(EisenhowerQuadrantEnum.GOLD_ZONE);
  const [editScope, setEditScope] = useState<"instance" | "series">("instance");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Keep refs for stable callback references
  const onOpenCreateModalRef = useRef(onOpenCreateModal);
  useEffect(() => {
    onOpenCreateModalRef.current = onOpenCreateModal;
  }, [onOpenCreateModal]);

  const onSelectTaskRef = useRef(onSelectTask);
  useEffect(() => {
    onSelectTaskRef.current = onSelectTask;
  }, [onSelectTask]);

  const onRangeChangeRef = useRef(onRangeChange);
  useEffect(() => {
    onRangeChangeRef.current = onRangeChange;
  }, [onRangeChange]);

  // Convert tasks to Schedule-X events
  const mappedEvents = useMemo<CalendarEventExternal[]>(() => {
    const tz = Temporal.Now.timeZoneId();
    const todayStr = Temporal.Now.plainDateISO().toString();

    return tasks.map((task) => {
      const dateStr = task.occurrenceDate || todayStr;
      const quadrantKey = task.quadrant || EisenhowerQuadrantEnum.GOLD_ZONE;

      // Unique event ID: combine id & occurrenceDate for recurring occurrences
      const eventId = task.isRecurring ? `${task.id}_${dateStr}` : task.id;

      let startTemporal: Temporal.ZonedDateTime | Temporal.PlainDate;
      let endTemporal: Temporal.ZonedDateTime | Temporal.PlainDate;

      if (task.startTime && task.endTime) {
        try {
          startTemporal = Temporal.PlainDateTime.from(
            `${dateStr}T${formatHHMMSS(task.startTime)}`
          ).toZonedDateTime(tz);
          endTemporal = Temporal.PlainDateTime.from(
            `${dateStr}T${formatHHMMSS(task.endTime)}`
          ).toZonedDateTime(tz);
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
    });
  }, [tasks]);

  // Initialize Calendar App
  const calendar = useNextCalendarApp({
    views: [
      createViewWeek(),
      createViewDay(),
      createViewMonthGrid(),
      createViewMonthAgenda(),
    ],
    defaultView: "week",
    selectedDate: Temporal.Now.plainDateISO(),
    calendars: QUADRANTS_THEME,
    dayBoundaries: {
      start: "06:00",
      end: "23:00",
    },
    weekOptions: {
      gridHeight: 850,
      gridStep: 60,
    },
    callbacks: {
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
      onClickDateTime(dateTime: any) {
        try {
          let dateStr = "";
          let startStr = "09:00";
          let endStr = "10:00";

          if (dateTime && typeof dateTime.toPlainDate === "function") {
            dateStr = dateTime.toPlainDate().toString();
            startStr = dateTime.toPlainTime().toString().slice(0, 5);
            endStr = dateTime
              .add({ hours: 1 })
              .toPlainTime()
              .toString()
              .slice(0, 5);
          } else if (typeof dateTime === "string") {
            const normalized = dateTime.replace("T", " ").trim();
            const [d, t] = normalized.split(" ");
            dateStr = d;
            if (t) {
              startStr = t.slice(0, 5);
              const [h, m] = startStr.split(":").map(Number);
              const nextH = Math.min(23, (h || 9) + 1);
              endStr = `${String(nextH).padStart(2, "0")}:${String(m || 0).padStart(2, "0")}`;
            }
          }

          if (dateStr) {
            onOpenCreateModalRef.current?.({
              date: dateStr,
              startTime: startStr,
              endTime: endStr,
            });
          }
        } catch (e) {
          console.error("onClickDateTime parse error:", e);
        }
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onClickDate(date: any) {
        try {
          const raw = typeof date?.toString === "function" ? date.toString() : String(date);
          const dateStr = raw.replace("T", " ").split(" ")[0];
          if (dateStr) {
            onOpenCreateModalRef.current?.({
              date: dateStr,
              startTime: "09:00",
              endTime: "10:00",
            });
          }
        } catch (e) {
          console.error("onClickDate parse error:", e);
        }
      },
      onEventClick(calendarEvent) {
        const found = tasks.find((t) => {
          const expectedEventId = t.isRecurring ? `${t.id}_${t.occurrenceDate}` : t.id;
          return expectedEventId === calendarEvent.id || t.id === calendarEvent.id;
        });

        if (found) {
          setSelectedEventTask(found);
          setModalMode("view");
          setEditTitle(found.title);
          setEditStartTime(found.startTime ? found.startTime.slice(0, 5) : "09:00");
          setEditEndTime(found.endTime ? found.endTime.slice(0, 5) : "10:00");
          setEditQuadrant(found.quadrant);
          setEditScope(found.isRecurring ? "instance" : "series");
          onSelectTaskRef.current?.(found);
        }
      },
    },
  });

  // Keep calendar events in sync with incoming tasks
  useEffect(() => {
    if (calendar && calendar.events) {
      calendar.events.set(mappedEvents);
    }
  }, [calendar, mappedEvents]);

  // Handle Tick/Untick status
  const handleToggleStatus = async () => {
    if (!selectedEventTask) return;
    const nextStatus =
      selectedEventTask.status === TaskStatusEnum.COMPLETED
        ? TaskStatusEnum.TODO
        : TaskStatusEnum.COMPLETED;

    // Optimistic local update
    setSelectedEventTask((prev) => (prev ? { ...prev, status: nextStatus } : null));

    try {
      if (onToggleOccurrenceStatus) {
        await onToggleOccurrenceStatus(
          selectedEventTask.id,
          selectedEventTask.occurrenceDate,
          nextStatus
        );
      }
    } catch (err) {
      console.error("Error toggling occurrence status:", err);
      // Revert if error
      setSelectedEventTask((prev) =>
        prev ? { ...prev, status: selectedEventTask.status } : null
      );
    }
  };

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
      <Card className="w-full h-[520px] flex items-center justify-center bg-surface rounded-xl border border-border">
        <div className="flex flex-col items-center gap-2 text-text-tertiary">
          <CalendarIcon className="w-7 h-7 animate-pulse text-primary" />
          <span className="text-xs font-medium">Đang tải lịch biểu...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full space-y-3 bg-surface p-3 sm:p-4 shadow-warm rounded-xl border border-border">
      {/* Compact Unified Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
            <CalendarIcon className="w-4 h-4 text-primary stroke-[2]" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-serif-display font-bold text-text-primary leading-tight">
              Lịch Biểu Timeboxing
            </h3>
            <p className="text-[11px] text-text-tertiary hidden sm:block">
              Hỗ trợ công việc định kỳ ảo RFC 5545 và quản lý trạng thái riêng từng ngày
            </p>
          </div>
        </div>

        {/* Inline Matrix Legend & Action Button */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap justify-between sm:justify-end">
          <div className="flex items-center gap-2.5 text-[11px] font-medium text-text-secondary overflow-x-auto py-0.5">
            <span className="flex items-center gap-1.5 shrink-0" title="Quan trọng & Lên lịch (+30 XP)">
              <span className="w-2 h-2 rounded-full bg-[#c8832a]" />
              <span>Gold Zone</span>
            </span>
            <span className="flex items-center gap-1.5 shrink-0" title="Khẩn cấp & Quan trọng (+20 XP)">
              <span className="w-2 h-2 rounded-full bg-[#b84e46]" />
              <span>Do First</span>
            </span>
            <span className="flex items-center gap-1.5 shrink-0" title="Khẩn cấp & Ủy quyền (+10 XP)">
              <span className="w-2 h-2 rounded-full bg-[#527a5d]" />
              <span>Delegate</span>
            </span>
            <span className="flex items-center gap-1.5 shrink-0" title="Loại bỏ / Việc vặt (+5 XP)">
              <span className="w-2 h-2 rounded-full bg-[#7c7267]" />
              <span>Eliminate</span>
            </span>
          </div>

          <button
            type="button"
            onClick={() => onOpenCreateModal?.()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-on-primary font-medium text-xs rounded-md shadow-warm-xs hover:shadow-warm transition-all active:scale-95 shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2]" />
            <span>Tạo công việc</span>
          </button>
        </div>
      </div>

      {/* Schedule-X Calendar Wrapper */}
      <div className="w-full overflow-hidden rounded-lg border border-border/80 shadow-warm-xs bg-surface min-h-[520px]">
        {calendar && <ScheduleXCalendar calendarApp={calendar} />}
      </div>

      {/* Interactive Task Details & Action Modal */}
      {selectedEventTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-xl bg-surface border border-border p-5 shadow-warm-lg space-y-4 animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between gap-2 border-b border-border/50 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Badge
                    variant={selectedEventTask.isGoldZone ? "gold" : "primary"}
                    className="text-[10px] font-medium rounded-md inline-flex items-center gap-1"
                  >
                    {selectedEventTask.isGoldZone ? (
                      <>
                        <Sparkles className="w-3 h-3 text-accent-gold stroke-[1.8]" />
                        <span>Gold Zone (+30 XP)</span>
                      </>
                    ) : (
                      <span>{selectedEventTask.quadrant}</span>
                    )}
                  </Badge>

                  {selectedEventTask.isRecurring && (
                    <Badge variant="primary" className="text-[10px] inline-flex items-center gap-1">
                      <Repeat className="w-3 h-3" />
                      <span>{rruleToFriendlyVi(selectedEventTask.rrule)}</span>
                    </Badge>
                  )}

                  {selectedEventTask.isOverridden && (
                    <Badge variant="amber" className="text-[10px] inline-flex items-center gap-1">
                      ✏️ Đã đổi lịch riêng ngày này
                    </Badge>
                  )}
                </div>

                <h4 className="text-base font-serif-display font-bold text-text-primary leading-snug">
                  {selectedEventTask.title}
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
              <div className="space-y-4">
                {selectedEventTask.description && (
                  <p className="text-xs text-text-secondary whitespace-pre-wrap bg-surface-secondary p-3 rounded-lg border border-border">
                    {selectedEventTask.description}
                  </p>
                )}

                <div className="space-y-2 text-xs text-text-tertiary">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-3.5 h-3.5 stroke-[1.8]" />
                    <span className="text-text-secondary font-medium">
                      {selectedEventTask.occurrenceDate}
                    </span>
                    {selectedEventTask.startTime && selectedEventTask.endTime && (
                      <span>({selectedEventTask.startTime} – {selectedEventTask.endTime})</span>
                    )}
                  </div>

                  {selectedEventTask.estimatedMinutes && (
                    <div className="flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5 stroke-[1.8]" />
                      <span>
                        Dự kiến: <strong className="text-text-secondary">{selectedEventTask.estimatedMinutes} phút</strong>
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[1.8]" />
                    <span>
                      Trạng thái:{" "}
                      <strong className={selectedEventTask.status === TaskStatusEnum.COMPLETED ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-text-secondary"}>
                        {selectedEventTask.status === TaskStatusEnum.COMPLETED ? "Đã hoàn thành" : "Cần làm (TODO)"}
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Primary Actions: Toggle Status & Edit / Delete */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/50">
                  <button
                    type="button"
                    onClick={handleToggleStatus}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      selectedEventTask.status === TaskStatusEnum.COMPLETED
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20"
                        : "bg-primary text-on-primary hover:bg-primary-hover shadow-warm-xs"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" />
                    <span>
                      {selectedEventTask.status === TaskStatusEnum.COMPLETED
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
              <div className="space-y-3 animate-in fade-in duration-150">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-text-secondary">Tiêu đề công việc:</label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full text-xs bg-surface-secondary border border-border rounded-lg px-2.5 py-1.5 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-text-secondary">Giờ bắt đầu:</label>
                    <input
                      type="time"
                      value={editStartTime}
                      onChange={(e) => setEditStartTime(e.target.value)}
                      className="w-full text-xs bg-surface-secondary border border-border rounded-lg px-2.5 py-1.5 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-text-secondary">Giờ kết thúc:</label>
                    <input
                      type="time"
                      value={editEndTime}
                      onChange={(e) => setEditEndTime(e.target.value)}
                      className="w-full text-xs bg-surface-secondary border border-border rounded-lg px-2.5 py-1.5 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-text-secondary">Mức độ ưu tiên (Eisenhower):</label>
                  <select
                    value={editQuadrant}
                    onChange={(e) => setEditQuadrant(e.target.value as EisenhowerQuadrant)}
                    className="w-full text-xs bg-surface-secondary border border-border rounded-lg px-2.5 py-1.5 text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value={EisenhowerQuadrantEnum.GOLD_ZONE}>Gold Zone (Q2 - Quan trọng • Lên lịch)</option>
                    <option value={EisenhowerQuadrantEnum.DO_FIRST}>Do First (Q1 - Khẩn cấp & Quan trọng)</option>
                    <option value={EisenhowerQuadrantEnum.DELEGATE}>Delegate (Q3 - Khẩn cấp • Ủy quyền)</option>
                    <option value={EisenhowerQuadrantEnum.ELIMINATE}>Eliminate (Q4 - Loại bỏ • Gom việc)</option>
                  </select>
                </div>

                {selectedEventTask.isRecurring && (
                  <div className="space-y-1.5 p-2.5 bg-surface-secondary rounded-lg border border-border text-xs">
                    <label className="font-semibold text-text-primary block">Phạm vi áp dụng chỉnh sửa:</label>
                    <div className="space-y-1">
                      <label className="flex items-center gap-2 cursor-pointer text-text-secondary">
                        <input
                          type="radio"
                          name="editScope"
                          checked={editScope === "instance"}
                          onChange={() => setEditScope("instance")}
                          className="accent-primary"
                        />
                        <span>Chỉ ngày này ({selectedEventTask.occurrenceDate})</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-text-secondary">
                        <input
                          type="radio"
                          name="editScope"
                          checked={editScope === "series"}
                          onChange={() => setEditScope("series")}
                          className="accent-primary"
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
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-secondary text-text-secondary hover:text-text-primary border border-border cursor-pointer"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    disabled={isSubmitting || !editTitle.trim()}
                    onClick={handleSaveEdit}
                    className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-primary text-on-primary hover:bg-primary-hover shadow-warm-xs cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              </div>
            )}

            {/* Modal Body: DELETE CONFIRMATION */}
            {modalMode === "delete" && (
              <div className="space-y-3 animate-in fade-in duration-150">
                <p className="text-xs text-text-secondary leading-relaxed">
                  {selectedEventTask.isRecurring
                    ? "Đây là một công việc lặp lại định kỳ. Bạn muốn xóa theo cách nào?"
                    : "Bạn có chắc chắn muốn xóa công việc này không?"}
                </p>

                {selectedEventTask.isRecurring ? (
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
                          Bỏ qua ngày {selectedEventTask.occurrenceDate}, giữ nguyên các ngày khác
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
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-surface-secondary text-text-secondary hover:text-text-primary border border-border cursor-pointer"
                  >
                    Quay lại
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};
