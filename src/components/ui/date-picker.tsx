"use client";

import React, { useMemo, useState } from "react";
import { Temporal } from "temporal-polyfill";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover";
import { TRANSITION_CLASSES } from "@/constants/transition.constants";
import {
  DATE_PICKER_WEEKDAYS,
  PICKER_LABELS,
  FIELD_TRIGGER_CLASS,
} from "@/constants/picker.constants";

export interface DatePickerProps {
  /** "YYYY-MM-DD" */
  value: string;
  onChange: (value: string) => void;
  showIcon?: boolean;
  className?: string;
  disabled?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const parseDate = (value: string): Temporal.PlainDate | null => {
  try {
    return value ? Temporal.PlainDate.from(value) : null;
  } catch {
    return null;
  }
};

const formatTrigger = (d: Temporal.PlainDate) =>
  `${DATE_PICKER_WEEKDAYS[d.dayOfWeek - 1]}, ${String(d.day).padStart(2, "0")}/${String(d.month).padStart(2, "0")}/${d.year}`;

/** Lưới 6 tuần (bắt đầu Thứ Hai) chứa tháng đang xem */
function buildMonthGrid(month: Temporal.PlainYearMonth): Temporal.PlainDate[] {
  const first = month.toPlainDate({ day: 1 });
  const start = first.subtract({ days: first.dayOfWeek - 1 });
  return Array.from({ length: 42 }, (_, i) => start.add({ days: i }));
}

/** Chọn ngày dạng lịch tháng, có animation mở/đóng của Radix Popover */
export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChange,
  showIcon = true,
  className,
  disabled,
  onOpenChange,
}) => {
  const selected = parseDate(value);
  const [open, setOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState<Temporal.PlainYearMonth>(() =>
    (selected ?? Temporal.Now.plainDateISO()).toPlainYearMonth()
  );
  const today = Temporal.Now.plainDateISO();
  const days = useMemo(() => buildMonthGrid(viewMonth), [viewMonth]);

  const handleOpenChange = (next: boolean) => {
    // Mở lại → nhảy về tháng của ngày đang chọn
    if (next) setViewMonth((selected ?? Temporal.Now.plainDateISO()).toPlainYearMonth());
    setOpen(next);
    onOpenChange?.(next);
  };

  const pick = (d: Temporal.PlainDate) => {
    onChange(d.toString());
    handleOpenChange(false);
  };

  const navBtn =
    "size-7 flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-secondary cursor-pointer transition-colors duration-150";

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          aria-label={PICKER_LABELS.SELECT_DATE}
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 tabular-nums cursor-pointer",
            FIELD_TRIGGER_CLASS,
            TRANSITION_CLASSES.INTERACTIVE,
            className
          )}
        >
          {showIcon && <Calendar className="size-3.5 text-text-tertiary" />}
          {selected ? formatTrigger(selected) : PICKER_LABELS.SELECT_DATE}
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" sideOffset={4} className="w-auto p-3 bg-surface border-border">
        {/* Header: điều hướng tháng */}
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            className={navBtn}
            aria-label={PICKER_LABELS.PREV_MONTH}
            onClick={() => setViewMonth((m) => m.subtract({ months: 1 }))}
          >
            <ChevronLeft className="size-4" />
          </button>
          <span
            key={viewMonth.toString()}
            className={cn("text-xs font-semibold text-text-primary", TRANSITION_CLASSES.FADE_IN)}
          >
            {PICKER_LABELS.MONTH_TITLE(viewMonth.month, viewMonth.year)}
          </span>
          <button
            type="button"
            className={navBtn}
            aria-label={PICKER_LABELS.NEXT_MONTH}
            onClick={() => setViewMonth((m) => m.add({ months: 1 }))}
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-0.5 mb-1">
          {DATE_PICKER_WEEKDAYS.map((w) => (
            <span key={w} className="size-8 flex items-center justify-center text-[10px] font-semibold text-text-tertiary">
              {w}
            </span>
          ))}
        </div>

        {/* Lưới ngày — đổi tháng thì fade-in lưới mới */}
        <div
          key={viewMonth.toString()}
          className={cn("grid grid-cols-7 gap-0.5", TRANSITION_CLASSES.FADE_IN)}
        >
          {days.map((d) => {
            const inMonth = d.month === viewMonth.month;
            const isSelected = !!selected && d.equals(selected);
            const isToday = d.equals(today);
            return (
              <button
                key={d.toString()}
                type="button"
                onClick={() => pick(d)}
                className={cn(
                  "size-8 flex items-center justify-center rounded-md text-xs tabular-nums cursor-pointer transition-colors duration-150",
                  isSelected
                    ? "bg-primary text-on-primary font-semibold"
                    : cn(
                        "hover:bg-surface-secondary",
                        inMonth ? "text-text-primary" : "text-text-tertiary/60",
                        isToday && "text-primary font-semibold ring-1 ring-primary/40"
                      )
                )}
              >
                {d.day}
              </button>
            );
          })}
        </div>

        <div className="flex justify-end pt-2 mt-2 border-t border-border">
          <button
            type="button"
            onClick={() => pick(today)}
            className="px-2 py-1 rounded-md text-[11px] font-semibold text-primary hover:bg-primary-soft cursor-pointer transition-colors duration-150"
          >
            {PICKER_LABELS.TODAY}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
