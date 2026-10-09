import "temporal-polyfill/global";
import { CalendarTaskItem } from "@/types/dashboard.types";
import { QUICK_CREATE_DRAFT_EVENT_ID } from "@/constants/calendar-quick-create.constants";

type EventTime = Temporal.ZonedDateTime | Temporal.PlainDate;

/** Thay đổi lịch sau khi kéo thả / kéo giãn một sự kiện */
export interface TaskRescheduleChange {
  date: string; // YYYY-MM-DD
  isAllDay: boolean;
  startTime?: string; // HH:mm
  endTime?: string; // HH:mm
}

/** ID sự kiện trên lịch: mỗi lần lặp của task định kỳ là một sự kiện riêng */
export function getTaskEventId(task: Pick<CalendarTaskItem, "id" | "isRecurring" | "occurrenceDate">): string {
  return task.isRecurring ? `${task.id}_${task.occurrenceDate}` : task.id;
}

export function isDraftEventId(eventId: string | number): boolean {
  return String(eventId).startsWith(QUICK_CREATE_DRAFT_EVENT_ID);
}

/**
 * Thứ tự cố định cho sự kiện trên lịch: bắt đầu sớm trước, kéo dài hơn trước, rồi theo id.
 * Schedule-X giữ nguyên thứ tự đầu vào khi 2 sự kiện trùng start & end, còn API không đảm bảo thứ tự
 * giữa các task trùng giờ (Postgres trả bản ghi vừa UPDATE xuống cuối) → không sort thì các ô đổi chỗ sau mỗi lần refetch.
 */
export function compareCalendarEvents(
  a: { id: string | number; start: EventTime; end: EventTime },
  b: { id: string | number; start: EventTime; end: EventTime }
): number {
  const byStart = a.start.toString().localeCompare(b.start.toString());
  if (byStart !== 0) return byStart;
  const byEnd = b.end.toString().localeCompare(a.end.toString());
  if (byEnd !== 0) return byEnd;
  return String(a.id).localeCompare(String(b.id));
}

/** "HH:mm" của mốc thời gian có giờ; null với sự kiện cả ngày */
export function formatEventTime(time: EventTime): string | null {
  return time instanceof Temporal.ZonedDateTime ? time.toPlainTime().toString().slice(0, 5) : null;
}

/**
 * Chuyển vị trí mới (sau khi kéo thả / kéo giãn) thành thay đổi lịch của task.
 * Trả về null nếu không hợp lệ với mô hình dữ liệu hiện tại:
 * - Đổi qua lại giữa cả ngày ↔ có giờ, hoặc kéo dài nhiều ngày (task chỉ thuộc 1 ngày).
 * - Task lặp lại bị kéo sang ngày khác (API override chỉ cho đổi giờ của 1 lần lặp).
 */
export function getRescheduleChange(
  task: CalendarTaskItem,
  start: EventTime,
  end: EventTime
): TaskRescheduleChange | null {
  if (start instanceof Temporal.PlainDate && end instanceof Temporal.PlainDate) {
    if (!start.equals(end)) return null;
    const date = start.toString();
    if (task.isRecurring && date !== task.occurrenceDate) return null;
    return { date, isAllDay: true };
  }

  if (start instanceof Temporal.ZonedDateTime && end instanceof Temporal.ZonedDateTime) {
    const startDate = start.toPlainDate();
    const endDate = end.toPlainDate();
    // Cho phép kết thúc đúng 00:00 hôm sau (= hết ngày); qua ngày khác thì không hợp lệ
    const endsAtNextMidnight =
      endDate.equals(startDate.add({ days: 1 })) && end.hour === 0 && end.minute === 0;
    if (!endDate.equals(startDate) && !endsAtNextMidnight) return null;

    const date = startDate.toString();
    if (task.isRecurring && date !== task.occurrenceDate) return null;
    return {
      date,
      isAllDay: false,
      startTime: formatEventTime(start) ?? undefined,
      endTime: formatEventTime(end) ?? undefined,
    };
  }

  return null;
}
