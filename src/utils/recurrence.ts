import { Temporal } from "temporal-polyfill";
import { RecurrenceConfig } from "@/types/recurrence.types";

const DAY_NAMES_VI = [
  "Chủ Nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];

const UNIT_NAMES_VI: Record<string, string> = {
  day: "ngày",
  week: "tuần",
  month: "tháng",
  year: "năm",
};

/**
 * Returns a default recurrence config for a given reference date
 */
export function getDefaultRecurrenceConfig(baseDateStr?: string): RecurrenceConfig {
  let dayOfWeek = 1;

  if (baseDateStr) {
    try {
      const plainDate = Temporal.PlainDate.from(baseDateStr);
      dayOfWeek = plainDate.dayOfWeek % 7;
    } catch {
      dayOfWeek = 1;
    }
  } else {
    try {
      const plainDate = Temporal.Now.plainDateISO();
      dayOfWeek = plainDate.dayOfWeek % 7;
    } catch {
      dayOfWeek = new Date().getDay();
    }
  }

  return {
    interval: 1,
    unit: "week",
    daysOfWeek: [dayOfWeek],
    endType: "never",
    occurrences: 10,
  };
}

/**
 * Formats recurrence configuration into friendly Vietnamese string (e.g. "Lặp lại mỗi tuần vào Thứ Tư")
 */
export function formatRecurrenceSummary(config?: RecurrenceConfig | null): string {
  if (!config) return "Không lặp lại";

  const { interval, unit, daysOfWeek, endType, endDate, occurrences } = config;
  const unitVi = UNIT_NAMES_VI[unit] || unit;

  let summary = "";
  if (interval === 1) {
    summary = `Lặp lại mỗi ${unitVi}`;
  } else {
    summary = `Lặp lại ${interval} ${unitVi} một lần`;
  }

  if (unit === "week" && daysOfWeek && daysOfWeek.length > 0) {
    const daysStr = daysOfWeek
      .slice()
      .sort((a, b) => a - b)
      .map((d) => DAY_NAMES_VI[d])
      .join(", ");
    summary += ` vào ${daysStr}`;
  }

  if (endType === "on_date" && endDate) {
    summary += ` đến ${endDate}`;
  } else if (endType === "after_occurrences" && occurrences) {
    summary += ` (${occurrences} lần)`;
  }

  return summary;
}

/**
 * Generates an array of scheduled date strings (YYYY-MM-DD) based on recurrence config.
 * Uses Temporal.PlainDate for timezone-safe date math and respects custom intervals & limits.
 */
export function generateRecurrenceDates(
  startDateStr: string,
  config?: RecurrenceConfig | null,
  maxLimit: number = 30
): string[] {
  if (!config) return [startDateStr];

  try {
    const {
      interval = 1,
      unit = "week",
      daysOfWeek = [],
      endType = "never",
      endDate,
      occurrences,
    } = config;

    let limit = maxLimit;
    if (endType === "after_occurrences" && occurrences) {
      limit = Math.min(occurrences, Math.max(maxLimit, 60));
    } else if (endType === "never") {
      limit = Math.min(occurrences || 12, maxLimit);
    }

    const start = Temporal.PlainDate.from(startDateStr);
    const endLimit = endType === "on_date" && endDate ? Temporal.PlainDate.from(endDate) : null;
    const dates: string[] = [];

    const safeInterval = Math.max(1, interval);

    if (unit === "day") {
      let current = start;
      while (dates.length < limit) {
        if (endLimit && Temporal.PlainDate.compare(current, endLimit) > 0) break;
        dates.push(current.toString());
        current = current.add({ days: safeInterval });
      }
    } else if (unit === "month") {
      let current = start;
      while (dates.length < limit) {
        if (endLimit && Temporal.PlainDate.compare(current, endLimit) > 0) break;
        dates.push(current.toString());
        current = current.add({ months: safeInterval });
      }
    } else if (unit === "year") {
      let current = start;
      while (dates.length < limit) {
        if (endLimit && Temporal.PlainDate.compare(current, endLimit) > 0) break;
        dates.push(current.toString());
        current = current.add({ years: safeInterval });
      }
    } else if (unit === "week") {
      const targetDays = daysOfWeek.length > 0 ? daysOfWeek : [start.dayOfWeek % 7];
      // Monday of the week containing start: subtract (dayOfWeek - 1) days
      const startWeekMonday = start.subtract({ days: start.dayOfWeek - 1 });
      let weekOffset = 0;
      // Calendar day order: Monday (1) through Saturday (6) then Sunday (0)
      const orderedDays = [1, 2, 3, 4, 5, 6, 0];

      while (dates.length < limit && weekOffset < 500) {
        const currentWeekMonday = startWeekMonday.add({ weeks: weekOffset });

        for (const d of orderedDays) {
          if (!targetDays.includes(d)) continue;
          const dayOffset = d === 0 ? 6 : d - 1;
          const targetDate = currentWeekMonday.add({ days: dayOffset });

          if (Temporal.PlainDate.compare(targetDate, start) < 0) continue;
          if (endLimit && Temporal.PlainDate.compare(targetDate, endLimit) > 0) {
            return dates.length > 0 ? dates : [startDateStr];
          }

          dates.push(targetDate.toString());
          if (dates.length >= limit) {
            return dates;
          }
        }

        weekOffset += safeInterval;
      }
    }

    return dates.length > 0 ? dates : [startDateStr];
  } catch (err) {
    console.error("generateRecurrenceDates error:", err);
    return [startDateStr];
  }
}

const RFC_DAY_NAMES: Record<number, string> = {
  0: "SU",
  1: "MO",
  2: "TU",
  3: "WE",
  4: "TH",
  5: "FR",
  6: "SA",
};

/**
 * Converts RecurrenceConfig to standard RFC 5545 RRULE string
 */
export function recurrenceConfigToRRule(config?: RecurrenceConfig | null): string | undefined {
  if (!config) return undefined;

  const { interval = 1, unit = "day", daysOfWeek = [], endType, endDate, occurrences } = config;
  const safeInterval = Math.max(1, interval);

  let freq = "DAILY";
  if (unit === "week") freq = "WEEKLY";
  else if (unit === "month") freq = "MONTHLY";
  else if (unit === "year") freq = "YEARLY";

  let rrule = `RRULE:FREQ=${freq};INTERVAL=${safeInterval}`;

  if (unit === "week" && daysOfWeek.length > 0) {
    const byDays = daysOfWeek
      .slice()
      .sort((a, b) => a - b)
      .map((d) => RFC_DAY_NAMES[d])
      .filter(Boolean);
    if (byDays.length > 0) {
      rrule += `;BYDAY=${byDays.join(",")}`;
    }
  }

  if (endType === "after_occurrences" && occurrences && occurrences > 0) {
    rrule += `;COUNT=${occurrences}`;
  } else if (endType === "on_date" && endDate) {
    const cleanDate = endDate.replace(/[-:]/g, "");
    rrule += `;UNTIL=${cleanDate}T235959Z`;
  }

  return rrule;
}

/**
 * Returns friendly Vietnamese summary for a given RRULE string
 */
export function rruleToFriendlyVi(rrule?: string | null): string {
  if (!rrule) return "Không lặp lại";
  if (rrule.includes("FREQ=DAILY")) {
    if (rrule.includes("INTERVAL=2")) return "Cách 2 ngày một lần";
    return "Lặp lại hàng ngày";
  }
  if (rrule.includes("FREQ=WEEKLY")) {
    if (rrule.includes("BYDAY=SA,SU")) return "Lặp lại cuối tuần";
    if (rrule.includes("BYDAY=MO,WE,FR")) return "Thứ 2, 4, 6";
    if (rrule.includes("BYDAY=TU,TH,SA")) return "Thứ 3, 5, 7";
    return "Lặp lại hàng tuần";
  }
  if (rrule.includes("FREQ=MONTHLY")) return "Lặp lại hàng tháng";
  if (rrule.includes("FREQ=YEARLY")) return "Lặp lại hàng năm";
  return "Lặp lại định kỳ";
}


