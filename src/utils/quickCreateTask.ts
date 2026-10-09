import { CreateTaskDto, EisenhowerQuadrant } from "@/types/dashboard.types";
import { QuickCreateDraft, QuickCreateSlot } from "@/types/calendar-quick-create.types";
import { EisenhowerQuadrantEnum, TaskTypeEnum } from "@/constants/dashboard.enums";
import { recurrenceConfigToRRule } from "@/utils/recurrence";
import {
  QUICK_CREATE_ALL_DAY_END,
  QUICK_CREATE_ALL_DAY_START,
} from "@/constants/calendar-quick-create.constants";

const MINUTES_PER_DAY = 24 * 60;

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
}

/** Số phút trong ngày → HH:mm (giới hạn trong ngày) */
export function fromMinutes(total: number): string {
  const clamped = Math.max(0, Math.min(MINUTES_PER_DAY - 1, total));
  const h = Math.floor(clamped / 60);
  const m = clamped % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/**
 * Backend không có cờ "cả ngày": task cả ngày được lưu với giờ 00:00–23:59.
 * Nhận diện quy ước này để hiển thị đúng (hàng all-day trên cùng của lịch).
 */
export function isAllDayTimeRange(startTime?: string | null, endTime?: string | null): boolean {
  return (
    !!startTime &&
    !!endTime &&
    startTime.slice(0, 5) === QUICK_CREATE_ALL_DAY_START &&
    endTime.slice(0, 5) === QUICK_CREATE_ALL_DAY_END
  );
}

/** Số phút giữa 2 mốc HH:mm (luôn >= 0) */
export function diffMinutes(start: string, end: string): number {
  return Math.max(0, toMinutes(end) - toMinutes(start));
}

/** Cộng thêm số phút vào HH:mm (giới hạn trong ngày) */
export function addMinutesToTime(time: string, minutes: number): string {
  return fromMinutes(toMinutes(time) + minutes);
}

/** Làm tròn xuống HH:mm theo bước (vd 30 phút) */
export function snapTime(time: string, stepMinutes: number): string {
  const total = toMinutes(time);
  return fromMinutes(Math.floor(total / stepMinutes) * stepMinutes);
}

/** Draft ban đầu khi click vào một ô lịch */
export function createInitialDraft(
  slot: QuickCreateSlot,
  quadrant: EisenhowerQuadrant = EisenhowerQuadrantEnum.GOLD_ZONE
): QuickCreateDraft {
  return {
    title: "",
    description: "",
    type: TaskTypeEnum.EISENHOWER,
    quadrant,
    scheduledDate: slot.date,
    startTime: slot.startTime,
    endTime: slot.endTime,
    isAllDay: false,
    recurrence: null,
  };
}

/**
 * Chuyển draft của popover tạo nhanh thành DTO gửi lên api-core.
 * `forUpdate` = true sẽ gửi chuỗi rỗng cho các trường bị xóa để backend reset giá trị.
 */
export function draftToTaskDto(draft: QuickCreateDraft, forUpdate = false): CreateTaskDto {
  const startTime = draft.isAllDay ? QUICK_CREATE_ALL_DAY_START : draft.startTime;
  const endTime = draft.isAllDay ? QUICK_CREATE_ALL_DAY_END : draft.endTime;
  const rrule = draft.recurrence ? recurrenceConfigToRRule(draft.recurrence) : undefined;
  const description = draft.description.trim();

  return {
    title: draft.title.trim(),
    description: forUpdate ? description : description || undefined,
    type: draft.type,
    quadrant: draft.quadrant,
    scheduledDate: draft.scheduledDate,
    startTime: `${startTime}:00`,
    endTime: `${endTime}:00`,
    estimatedMinutes: diffMinutes(startTime, endTime) || 60,
    rrule: forUpdate ? rrule ?? "" : rrule,
  };
}
