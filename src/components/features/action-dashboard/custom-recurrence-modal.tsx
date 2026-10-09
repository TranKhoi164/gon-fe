"use client";

import React, { useState } from "react";
import { Temporal } from "temporal-polyfill";
import { RecurrenceConfig, RecurrenceUnit, RecurrenceEndType } from "@/types/recurrence.types";
import { getDefaultRecurrenceConfig } from "@/utils/recurrence";
import { ChevronDown, ChevronUp } from "lucide-react";
import { DialogShell } from "@/components/ui/dialog-shell";
import { DatePicker } from "@/components/ui/date-picker";
import { Presence, PresenceMount } from "@/components/ui/presence";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";
import { cn } from "@/lib/utils";
import { FIELD_TRIGGER_CLASS } from "@/constants/picker.constants";
import { TRANSITION_CLASSES } from "@/constants/transition.constants";

interface CustomRecurrenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (config: RecurrenceConfig) => void;
  initialConfig?: RecurrenceConfig | null;
  baseDate?: string;
}

const DAYS_OF_WEEK = [
  { label: "S", full: "Chủ Nhật", value: 0 },
  { label: "M", full: "Thứ Hai", value: 1 },
  { label: "T", full: "Thứ Ba", value: 2 },
  { label: "W", full: "Thứ Tư", value: 3 },
  { label: "T", full: "Thứ Năm", value: 4 },
  { label: "F", full: "Thứ Sáu", value: 5 },
  { label: "S", full: "Thứ Bảy", value: 6 },
];

export const CustomRecurrenceModal: React.FC<CustomRecurrenceModalProps> = (props) => {
  return (
    <PresenceMount open={props.isOpen}>
      <CustomRecurrenceModalContent {...props} />
    </PresenceMount>
  );
};

const CustomRecurrenceModalContent: React.FC<CustomRecurrenceModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialConfig,
  baseDate,
}) => {
  const defaults = getDefaultRecurrenceConfig(baseDate);

  const [interval, setInterval] = useState<number>(() => {
    return initialConfig?.interval || defaults.interval;
  });
  const [unit, setUnit] = useState<RecurrenceUnit>(() => {
    return initialConfig?.unit || defaults.unit;
  });
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(() => {
    return initialConfig?.daysOfWeek || defaults.daysOfWeek;
  });
  const [endType, setEndType] = useState<RecurrenceEndType>(() => {
    return initialConfig?.endType || defaults.endType;
  });
  const [endDate, setEndDate] = useState<string>(() => {
    if (initialConfig?.endDate) return initialConfig.endDate;
    try {
      return Temporal.Now.plainDateISO().add({ months: 3 }).toString();
    } catch {
      const future = new Date();
      future.setMonth(future.getMonth() + 3);
      const y = future.getFullYear();
      const m = String(future.getMonth() + 1).padStart(2, "0");
      const d = String(future.getDate()).padStart(2, "0");
      return `${y}-${m}-${d}`;
    }
  });
  const [occurrences, setOccurrences] = useState<number>(() => {
    return initialConfig?.occurrences || defaults.occurrences || 10;
  });

  const handleToggleDay = (dayValue: number) => {
    setDaysOfWeek((prev) => {
      if (prev.includes(dayValue)) {
        if (prev.length === 1) return prev; // Keep at least one day
        return prev.filter((d) => d !== dayValue);
      } else {
        return [...prev, dayValue].sort((a, b) => a - b);
      }
    });
  };

  const handleDone = () => {
    onApply({
      interval: Math.max(1, interval),
      unit,
      daysOfWeek,
      endType,
      endDate: endType === "on_date" ? endDate : undefined,
      occurrences: endType === "after_occurrences" ? occurrences : undefined,
    });
    onClose();
  };

  return (
    <DialogShell open={isOpen} onClose={onClose} className="max-w-sm p-6 space-y-6">
        {/* Title */}
        <h3 className="text-xl font-serif-display font-bold tracking-tight text-text-primary">
          Lặp lại tùy chỉnh
        </h3>

        {/* 1. Repeat every */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-text-secondary whitespace-nowrap">
            Lặp lại mỗi
          </span>

          <div className="relative flex items-center bg-surface-secondary rounded-lg px-2.5 py-1.5 border border-border w-24">
            <input
              type="number"
              min={1}
              max={99}
              value={interval}
              onChange={(e) => setInterval(Math.max(1, parseInt(e.target.value) || 1))}
              className={cn("w-full bg-transparent text-sm font-semibold text-text-primary focus:outline-none", TRANSITION_CLASSES.INTERACTIVE)}
            />
            <div className="flex flex-col ml-1">
              <button
                type="button"
                onClick={() => setInterval((prev) => prev + 1)}
                className="text-text-tertiary hover:text-text-primary p-0.5 transition-colors duration-150"
              >
                <ChevronUp className="w-3 h-3 stroke-[1.8]" />
              </button>
              <button
                type="button"
                onClick={() => setInterval((prev) => Math.max(1, prev - 1))}
                className="text-text-tertiary hover:text-text-primary p-0.5 transition-colors duration-150"
              >
                <ChevronDown className="w-3 h-3 stroke-[1.8]" />
              </button>
            </div>
          </div>

          <div className="flex-1">
            <Select value={unit} onValueChange={(v) => setUnit(v as RecurrenceUnit)}>
              <SelectTrigger className={cn(FIELD_TRIGGER_CLASS, "w-full h-9 text-sm font-medium")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="day">ngày</SelectItem>
                <SelectItem value="week">tuần</SelectItem>
                <SelectItem value="month">tháng</SelectItem>
                <SelectItem value="year">năm</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* 2. Repeat on (if week) */}
        <Presence show={unit === "week"} variant="collapse" className="space-y-2">
            <span className="text-xs font-semibold text-text-secondary block">
              Lặp lại vào
            </span>
            <div className="flex items-center justify-between gap-1">
              {DAYS_OF_WEEK.map((day) => {
                const isSelected = daysOfWeek.includes(day.value);
                return (
                  <button
                    key={day.value}
                    type="button"
                    title={day.full}
                    onClick={() => handleToggleDay(day.value)}
                    className={`w-8 h-8 rounded-md text-xs font-medium flex items-center justify-center transition-all ${
                      isSelected
                        ? "bg-primary text-on-primary shadow-warm-xs"
                        : "bg-surface-secondary text-text-secondary hover:bg-surface-tertiary border border-border/50"
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
        </Presence>

        {/* 3. Ends */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-text-secondary block">
            Kết thúc
          </span>

          {/* Option: Never */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="endType"
              checked={endType === "never"}
              onChange={() => setEndType("never")}
              className={cn("w-4 h-4 accent-primary text-primary border-border focus:ring-primary cursor-pointer", TRANSITION_CLASSES.INTERACTIVE)}
            />
            <span className="text-sm text-text-primary">Không bao giờ</span>
          </label>

          {/* Option: On Date */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="endType"
              checked={endType === "on_date"}
              onChange={() => setEndType("on_date")}
              className={cn("w-4 h-4 accent-primary text-primary border-border focus:ring-primary cursor-pointer", TRANSITION_CLASSES.INTERACTIVE)}
            />
            <span className="text-sm text-text-primary whitespace-nowrap min-w-[65px]">
              Vào ngày
            </span>
            <DatePicker
              value={endDate}
              onOpenChange={(open) => open && setEndType("on_date")}
              onChange={(v) => {
                setEndType("on_date");
                setEndDate(v);
              }}
              className={`transition-[opacity,border-color] ${endType !== "on_date" ? "opacity-60" : "opacity-100"}`}
            />
          </label>

          {/* Option: After occurrences */}
          <label className="flex items-center gap-3 cursor-pointer group">
            <input
              type="radio"
              name="endType"
              checked={endType === "after_occurrences"}
              onChange={() => setEndType("after_occurrences")}
              className={cn("w-4 h-4 accent-primary text-primary border-border focus:ring-primary cursor-pointer", TRANSITION_CLASSES.INTERACTIVE)}
            />
            <span className="text-sm text-text-primary whitespace-nowrap min-w-[65px]">
              Sau
            </span>
            <div className="flex items-center gap-1.5">
              <input
                type="number"
                min={1}
                max={99}
                value={occurrences}
                onFocus={() => setEndType("after_occurrences")}
                onClick={() => setEndType("after_occurrences")}
                onChange={(e) => {
                  setEndType("after_occurrences");
                  setOccurrences(Math.max(1, parseInt(e.target.value) || 1));
                }}
                className={`w-16 px-2.5 py-1.5 text-xs text-center font-medium rounded-md border border-border bg-surface-secondary text-text-primary focus:outline-none focus:ring-1 focus:ring-primary transition-opacity ${
                  endType !== "after_occurrences" ? "opacity-60" : "opacity-100"
                }`}
              />
              <span className="text-sm text-text-secondary">lần lặp</span>
            </div>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-border">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary transition-colors rounded-md"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleDone}
            className="px-4 py-1.5 text-xs font-semibold rounded-md bg-primary hover:bg-primary-hover text-on-primary shadow-warm-xs hover:shadow-warm transition-all active:scale-95"
          >
            Xong
          </button>
        </div>
    </DialogShell>
  );
};
