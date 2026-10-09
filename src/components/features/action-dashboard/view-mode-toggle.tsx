"use client";

import React from "react";
import { Calendar, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardViewModeEnum } from "@/constants/dashboard.enums";
import { TRANSITION_CLASSES } from "@/constants/transition.constants";

const VIEW_MODE_OPTIONS = [
  { value: DashboardViewModeEnum.EISENHOWER, label: "Ma Trận Eisenhower", icon: LayoutGrid },
  { value: DashboardViewModeEnum.CALENDAR, label: "Lịch Biểu Timeboxing", icon: Calendar },
] as const;

export interface ViewModeToggleProps {
  value: DashboardViewModeEnum;
  onChange: (value: DashboardViewModeEnum) => void;
}

/** Chuyển giữa Ma trận Eisenhower và Lịch — đặt ở đầu hàng header của từng chế độ */
export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({ value, onChange }) => (
  <div className="flex items-center gap-0.5 p-0.5 bg-surface-secondary rounded-lg shrink-0">
    {VIEW_MODE_OPTIONS.map(({ value: mode, label, icon: Icon }) => (
      <button
        key={mode}
        type="button"
        onClick={() => onChange(mode)}
        title={label}
        aria-pressed={value === mode}
        className={cn(
          "flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md cursor-pointer",
          TRANSITION_CLASSES.INTERACTIVE,
          value === mode
            ? "bg-primary text-on-primary shadow-warm-xs"
            : "text-text-secondary hover:text-text-primary"
        )}
      >
        <Icon className="w-3.5 h-3.5" />
        <span className="hidden lg:inline">{label}</span>
      </button>
    ))}
  </div>
);
