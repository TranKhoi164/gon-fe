"use client";

import React, { useMemo, useState } from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn/popover";
import {
  PICKER_LABELS,
  TIME_PICKER_LIST_MAX_HEIGHT,
  TIME_PICKER_STEP_MINUTES,
  FIELD_TRIGGER_CLASS,
} from "@/constants/picker.constants";
import { TRANSITION_CLASSES } from "@/constants/transition.constants";
import { diffMinutes, fromMinutes } from "@/utils/quickCreateTask";

export interface TimePickerProps {
  /** "HH:mm" */
  value: string;
  onChange: (value: string) => void;
  /** Giờ bắt đầu — khi có, chỉ hiện các mốc sau giờ này kèm thời lượng (dùng cho giờ kết thúc) */
  durationFrom?: string;
  stepMinutes?: number;
  showIcon?: boolean;
  className?: string;
  disabled?: boolean;
}

const formatDuration = (minutes: number) =>
  minutes < 60
    ? PICKER_LABELS.DURATION_MINUTES(minutes)
    : PICKER_LABELS.DURATION_HOURS(Math.round((minutes / 60) * 100) / 100);

/** Chọn giờ dạng danh sách (giống Google Calendar), có animation mở/đóng của Radix Popover */
export const TimePicker: React.FC<TimePickerProps> = ({
  value,
  onChange,
  durationFrom,
  stepMinutes = TIME_PICKER_STEP_MINUTES,
  showIcon = false,
  className,
  disabled,
}) => {
  const [open, setOpen] = useState(false);
  const current = value ? value.slice(0, 5) : "";

  const options = useMemo(() => {
    const times: string[] = [];
    for (let m = 0; m < 24 * 60; m += stepMinutes) times.push(fromMinutes(m));
    if (current && !times.includes(current)) times.push(current);
    times.sort();
    return durationFrom ? times.filter((t) => t > durationFrom.slice(0, 5)) : times;
  }, [stepMinutes, current, durationFrom]);

  // Cuộn tới mốc đang chọn ngay khi danh sách được mount
  const scrollToSelected = (list: HTMLDivElement | null) => {
    const selected = list?.querySelector<HTMLElement>("[data-selected=true]");
    if (list && selected) list.scrollTop = selected.offsetTop - list.clientHeight / 2 + selected.clientHeight / 2;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          aria-label={PICKER_LABELS.SELECT_TIME}
          className={cn(
            "inline-flex items-center gap-1.5 px-2.5 tabular-nums cursor-pointer",
            FIELD_TRIGGER_CLASS,
            TRANSITION_CLASSES.INTERACTIVE,
            className
          )}
        >
          {showIcon && <Clock className="size-3.5 text-text-tertiary" />}
          {current || "--:--"}
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        className="w-auto min-w-28 p-1 bg-surface border-border"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div
          ref={scrollToSelected}
          className="overflow-y-auto overscroll-contain"
          style={{ maxHeight: TIME_PICKER_LIST_MAX_HEIGHT }}
        >
          {options.map((t) => {
            const selected = t === current;
            return (
              <button
                key={t}
                type="button"
                data-selected={selected}
                onClick={() => {
                  onChange(t);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-3 px-2.5 py-1.5 rounded-sm text-xs tabular-nums text-left cursor-pointer transition-colors duration-150",
                  selected
                    ? "bg-primary-soft text-primary font-semibold"
                    : "text-text-primary hover:bg-surface-secondary"
                )}
              >
                <span>{t}</span>
                {durationFrom && (
                  <span className="text-[10px] text-text-tertiary">
                    {formatDuration(diffMinutes(durationFrom.slice(0, 5), t))}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
};
