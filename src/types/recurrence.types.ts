export type RecurrenceUnit = "day" | "week" | "month" | "year";

export type RecurrenceEndType = "never" | "on_date" | "after_occurrences";

export interface RecurrenceConfig {
  interval: number; // e.g. 1, 2
  unit: RecurrenceUnit; // "day" | "week" | "month" | "year"
  daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday (used when unit === "week")
  endType: RecurrenceEndType;
  endDate?: string; // YYYY-MM-DD
  occurrences?: number; // e.g. 13
}
