"use client";

import React, { createContext, useContext } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { QUICK_CREATE_QUADRANT_OPTIONS } from "@/constants/calendar-quick-create.constants";
import { TRANSITION_CLASSES } from "@/constants/transition.constants";

/**
 * Nội dung chèn vào header của Schedule-X (Today / ‹ › / tháng … View / Date) để gộp thành 1 hàng duy nhất.
 * Truyền qua context vì custom component của ScheduleXCalendar phải là tham chiếu ổn định ở module scope.
 */
export const CalendarHeaderSlotsContext = createContext<{
  leading?: React.ReactNode;
  onCreate?: () => void;
}>({});

const HeaderLeading: React.FC = () => {
  const { leading } = useContext(CalendarHeaderSlotsContext);
  return leading ? <div className="flex items-center mr-1">{leading}</div> : null;
};

const HeaderActions: React.FC = () => {
  const { onCreate } = useContext(CalendarHeaderSlotsContext);
  return (
    <div className="flex items-center gap-3">
      <div className="hidden xl:flex items-center gap-2.5 text-[11px] font-medium text-text-secondary">
        {QUICK_CREATE_QUADRANT_OPTIONS.map((opt) => (
          <span key={opt.key} className="flex items-center gap-1.5 shrink-0" title={opt.hint}>
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: opt.color }} />
            <span>{opt.name}</span>
          </span>
        ))}
      </div>
      {onCreate && (
        <button
          type="button"
          onClick={onCreate}
          className={cn(
            "flex items-center gap-1.5 h-8 px-3 bg-primary hover:bg-primary-hover text-on-primary font-medium text-xs rounded-md shadow-warm-xs hover:shadow-warm active:scale-95 shrink-0 cursor-pointer",
            TRANSITION_CLASSES.INTERACTIVE
          )}
        >
          <Plus className="w-3.5 h-3.5 stroke-[2]" />
          <span className="hidden sm:inline">Tạo công việc</span>
        </button>
      )}
    </div>
  );
};

export const CALENDAR_HEADER_COMPONENTS = {
  headerContentLeftPrepend: HeaderLeading,
  headerContentRightAppend: HeaderActions,
};
