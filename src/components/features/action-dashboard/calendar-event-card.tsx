"use client";

import React, { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { Circle, CircleCheck, Repeat } from "lucide-react";
import type { CalendarEventExternal } from "@schedule-x/calendar";
import { cn } from "@/lib/utils";
import { CalendarTaskItem, TaskStatus } from "@/types/dashboard.types";
import { TaskStatusEnum } from "@/constants/dashboard.enums";
import { CALENDAR_EVENT_LABELS, CALENDAR_QUADRANT_THEME } from "@/constants/calendar.constants";
import { TRANSITION_CLASSES } from "@/constants/transition.constants";
import { formatEventTime, isDraftEventId } from "@/utils/calendarEvent";

/** Hành động trên ô sự kiện — cung cấp từ CalendarGridView (context đi xuyên portal của ScheduleXCalendar) */
export const CalendarEventActionsContext = createContext<{
  getStatus: (task: CalendarTaskItem) => TaskStatus;
  toggleStatus: (task: CalendarTaskItem) => void;
} | null>(null);

type EventWithTask = CalendarEventExternal & { _originalTask?: CalendarTaskItem };
type Variant = "timeGrid" | "dateGrid";

/**
 * Schedule-X render bằng Preact và gắn listener mousedown/click trực tiếp lên ô sự kiện (bắt đầu kéo thả,
 * mở chi tiết). React chỉ nhận event khi nó bubble tới root → stopPropagation của React là quá muộn.
 * Vì vậy nút tick dùng listener native để chặn ngay tại chỗ.
 */
function useIsolatedClick<T extends HTMLElement>(onClick: () => void) {
  const onClickRef = useRef(onClick);
  useEffect(() => {
    onClickRef.current = onClick;
  }, [onClick]);
  const cleanupRef = useRef<(() => void) | null>(null);

  // Callback ref: gắn/gỡ listener đúng lúc element xuất hiện/biến mất
  return useCallback((el: T | null) => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    if (!el) return;
    const stop = (e: Event) => e.stopPropagation();
    const handleClick = (e: Event) => {
      e.stopPropagation();
      e.preventDefault();
      onClickRef.current();
    };
    const blocked = ["mousedown", "mouseup", "touchstart", "touchend", "pointerdown", "dblclick"] as const;
    blocked.forEach((type) => el.addEventListener(type, stop));
    el.addEventListener("click", handleClick);
    cleanupRef.current = () => {
      blocked.forEach((type) => el.removeEventListener(type, stop));
      el.removeEventListener("click", handleClick);
    };
  }, []);
}

const EventCard: React.FC<{ calendarEvent: EventWithTask; variant: Variant }> = ({ calendarEvent, variant }) => {
  const actions = useContext(CalendarEventActionsContext);
  const task = calendarEvent._originalTask;
  const isDraft = isDraftEventId(calendarEvent.id);
  const canToggle = !!task && !!actions && !isDraft;
  const isDone = canToggle && actions.getStatus(task) === TaskStatusEnum.COMPLETED;
  const checkRef = useIsolatedClick<HTMLButtonElement>(() => {
    if (canToggle) actions.toggleStatus(task);
  });

  const colorName =
    CALENDAR_QUADRANT_THEME[calendarEvent.calendarId as keyof typeof CALENDAR_QUADRANT_THEME]?.colorName ??
    CALENDAR_QUADRANT_THEME.GOLD_ZONE.colorName;
  const start = formatEventTime(calendarEvent.start);
  const end = formatEventTime(calendarEvent.end);
  const title = task?.title ?? calendarEvent.title;

  return (
    <div
      className={cn(
        // gon-event-card: móc CSS trong styling/schedule-x.css (bỏ padding khung ngoài của Schedule-X)
        "gon-event-card flex size-full min-w-0 overflow-hidden text-[11px] leading-tight",
        variant === "timeGrid" ? "flex-col gap-0.5 px-1.5 py-1" : "items-center gap-1 px-1.5",
        isDraft && "opacity-80",
        TRANSITION_CLASSES.INTERACTIVE
      )}
      style={{
        backgroundColor: `var(--sx-color-${colorName}-container)`,
        color: `var(--sx-color-on-${colorName}-container)`,
        borderInlineStart: `4px solid var(--sx-color-${colorName})`,
      }}
    >
      <div className="flex min-w-0 items-center gap-1">
        {canToggle && (
          <button
            ref={checkRef}
            type="button"
            aria-label={isDone ? CALENDAR_EVENT_LABELS.MARK_TODO : CALENDAR_EVENT_LABELS.MARK_DONE}
            aria-pressed={isDone}
            className={cn(
              "shrink-0 rounded-full cursor-pointer opacity-80 hover:opacity-100 hover:scale-110 active:scale-95 transition-[opacity,scale] duration-150"
            )}
          >
            {isDone ? <CircleCheck className="size-3.5" /> : <Circle className="size-3.5" />}
          </button>
        )}
        <span
          className={cn(
            "truncate font-semibold decoration-current/60",
            TRANSITION_CLASSES.INTERACTIVE,
            isDone && "line-through opacity-60"
          )}
        >
          {title}
          {variant === "dateGrid" && start && <span className="font-normal opacity-80">, {start}</span>}
        </span>
        {task?.isRecurring && <Repeat className="size-3 shrink-0 opacity-60" />}
      </div>
      {variant === "timeGrid" && start && end && (
        <span className={cn("truncate tabular-nums opacity-75", isDone && "opacity-50")}>
          {start} – {end}
        </span>
      )}
    </div>
  );
};

/** Custom components cho ScheduleXCalendar — khai báo ở module scope để tham chiếu ổn định (tránh calendar re-render) */
const TimeGridEventCard: React.FC<{ calendarEvent: EventWithTask }> = ({ calendarEvent }) => (
  <EventCard calendarEvent={calendarEvent} variant="timeGrid" />
);
const DateGridEventCard: React.FC<{ calendarEvent: EventWithTask }> = ({ calendarEvent }) => (
  <EventCard calendarEvent={calendarEvent} variant="dateGrid" />
);

export const CALENDAR_EVENT_COMPONENTS = {
  timeGridEvent: TimeGridEventCard,
  dateGridEvent: DateGridEventCard,
  monthGridEvent: DateGridEventCard,
};
