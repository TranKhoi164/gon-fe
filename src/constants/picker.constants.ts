/** Kiểu chung cho ô chọn trong form (TimePicker, DatePicker, SelectTrigger) */
export const FIELD_TRIGGER_CLASS =
  "h-8 rounded-lg border border-border bg-surface-secondary text-xs text-text-primary shadow-none hover:border-primary/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary data-[state=open]:border-primary disabled:opacity-50 disabled:cursor-not-allowed";

/** Bước thời gian trong danh sách chọn giờ (phút) */
export const TIME_PICKER_STEP_MINUTES = 15;

/** Chiều cao tối đa danh sách giờ (px) */
export const TIME_PICKER_LIST_MAX_HEIGHT = 240;

/** Thứ trong tuần, bắt đầu từ Thứ Hai (Temporal: dayOfWeek 1 = Thứ Hai … 7 = Chủ Nhật) */
export const DATE_PICKER_WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"] as const;

export const PICKER_LABELS = {
  TODAY: "Hôm nay",
  PREV_MONTH: "Tháng trước",
  NEXT_MONTH: "Tháng sau",
  MONTH_TITLE: (month: number, year: number) => `Tháng ${month}, ${year}`,
  DURATION_MINUTES: (m: number) => `${m} phút`,
  DURATION_HOURS: (h: number) => `${h} giờ`,
  SELECT_TIME: "Chọn giờ",
  SELECT_DATE: "Chọn ngày",
} as const;
