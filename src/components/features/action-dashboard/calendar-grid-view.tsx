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

import { Task, EisenhowerQuadrant } from "@/types/dashboard.types";
import { EisenhowerQuadrantEnum } from "@/constants/dashboard.enums";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar as CalendarIcon,
  Plus,
  Sparkles,
  Clock,
  CheckCircle2,
} from "lucide-react";

export interface CalendarGridViewProps {
  tasks: Task[];
  onOpenCreateModal?: (initialData?: {
    date?: string;
    startTime?: string;
    endTime?: string;
    quadrant?: EisenhowerQuadrant;
  }) => void;
  onSelectTask?: (task: Task) => void;
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
}) => {
  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const [selectedEventTask, setSelectedEventTask] = useState<Task | null>(null);

  // Keep a ref to onOpenCreateModal so callbacks have stable reference
  const onOpenCreateModalRef = useRef(onOpenCreateModal);
  useEffect(() => {
    onOpenCreateModalRef.current = onOpenCreateModal;
  }, [onOpenCreateModal]);

  const onSelectTaskRef = useRef(onSelectTask);
  useEffect(() => {
    onSelectTaskRef.current = onSelectTask;
  }, [onSelectTask]);

  // Convert tasks to Schedule-X events
  const mappedEvents = useMemo<CalendarEventExternal[]>(() => {
    const tz = Temporal.Now.timeZoneId();
    const todayStr = Temporal.Now.plainDateISO().toString();

    return tasks.map((task) => {
      const dateStr = task.scheduledDate || todayStr;
      const quadrantKey = task.quadrant || EisenhowerQuadrantEnum.GOLD_ZONE;

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
        id: task.id,
        title: task.title,
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
        const found = tasks.find((t) => t.id === calendarEvent.id);
        if (found) {
          setSelectedEventTask(found);
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
              Bấm trực tiếp vào các ô giờ để lên lịch nhiệm vụ tức thì
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-on-primary font-medium text-xs rounded-md shadow-warm-xs hover:shadow-warm transition-all active:scale-95 shrink-0"
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

      {/* Event Details Quick Modal */}
      {selectedEventTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-sm rounded-xl bg-surface border border-border p-5 shadow-warm-lg space-y-4 animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Badge
                  variant={selectedEventTask.isGoldZone ? "gold" : "primary"}
                  className="text-[10px] font-medium mb-1.5 rounded-md inline-flex items-center gap-1"
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
                <h4 className="text-base font-serif-display font-bold text-text-primary leading-snug">
                  {selectedEventTask.title}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedEventTask(null)}
                className="text-text-tertiary hover:text-text-primary p-1 rounded-lg hover:bg-surface-secondary transition-colors"
              >
                ✕
              </button>
            </div>

            {selectedEventTask.description && (
              <p className="text-xs text-text-secondary whitespace-pre-wrap bg-surface-secondary p-3 rounded-lg border border-border">
                {selectedEventTask.description}
              </p>
            )}

            <div className="space-y-2 text-xs text-text-tertiary">
              {selectedEventTask.scheduledDate && (
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-3.5 h-3.5 stroke-[1.8]" />
                  <span className="text-text-secondary">{selectedEventTask.scheduledDate}</span>
                  {selectedEventTask.startTime && selectedEventTask.endTime && (
                    <span>({selectedEventTask.startTime} – {selectedEventTask.endTime})</span>
                  )}
                </div>
              )}
              {selectedEventTask.estimatedMinutes && (
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 stroke-[1.8]" />
                  <span>Dự kiến: <strong className="text-text-secondary">{selectedEventTask.estimatedMinutes} phút</strong></span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 stroke-[1.8]" />
                <span>
                  Trạng thái:{" "}
                  <strong className={selectedEventTask.status === "COMPLETED" ? "text-emerald-600 dark:text-emerald-400 font-semibold" : "text-text-secondary"}>
                    {selectedEventTask.status === "COMPLETED" ? "Đã hoàn thành" : "Cần làm (TODO)"}
                  </strong>
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedEventTask(null)}
                className="px-4 py-2 text-xs font-medium rounded-lg bg-surface-secondary text-text-primary hover:bg-surface-tertiary border border-border transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
