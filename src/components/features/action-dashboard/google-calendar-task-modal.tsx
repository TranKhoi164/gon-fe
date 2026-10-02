"use client";

import React, { useState } from "react";
import { Temporal } from "temporal-polyfill";
import {
  TaskType,
  EisenhowerQuadrant,
} from "@/types/dashboard.types";
import {
  TaskTypeEnum,
  EisenhowerQuadrantEnum,
} from "@/constants/dashboard.enums";
import { RecurrenceConfig } from "@/types/recurrence.types";
import {
  formatRecurrenceSummary,
  generateRecurrenceDates,
} from "@/utils/recurrence";
import { CustomRecurrenceModal } from "./custom-recurrence-modal";
import {
  X,
  Menu,
  Clock,
  AlignLeft,
  Sparkles,
  Repeat,
  ChevronDown,
  Calendar,
  Flame,
  UserCheck,
  Trash2,
} from "lucide-react";

export interface GoogleCalendarTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (taskData: {
    title: string;
    description?: string;
    type: TaskType;
    quadrant: EisenhowerQuadrant;
    scheduledDate: string;
    startTime: string;
    endTime: string;
    estimatedMinutes: number;
    recurrence?: RecurrenceConfig | null;
    recurrenceSummary?: string;
    recurringDates?: string[];
  }) => Promise<void>;
  initialDate?: string;
  initialStartTime?: string;
  initialEndTime?: string;
  initialQuadrant?: EisenhowerQuadrant;
}

const QUADRANT_OPTIONS = [
  {
    key: EisenhowerQuadrantEnum.GOLD_ZONE,
    name: "Gold Zone (Q2)",
    label: "Quan trọng • Lên lịch",
    badge: "+30 XP",
    icon: Sparkles,
    colorClass:
      "border-accent-gold/40 bg-accent-gold-soft text-accent-gold dark:border-amber-500/40 ring-accent-gold/40",
  },
  {
    key: EisenhowerQuadrantEnum.DO_FIRST,
    name: "Do First (Q1)",
    label: "Khẩn cấp & Quan trọng",
    badge: "+20 XP",
    icon: Flame,
    colorClass:
      "border-[#b84e46]/40 bg-[#fae8e6] text-[#b84e46] dark:bg-[#381a17] dark:text-[#df7068] ring-[#b84e46]/40",
  },
  {
    key: EisenhowerQuadrantEnum.DELEGATE,
    name: "Delegate (Q3)",
    label: "Khẩn cấp • Ủy quyền",
    badge: "+10 XP",
    icon: UserCheck,
    colorClass:
      "border-[#527a5d]/40 bg-[#eaf2ec] text-[#527a5d] dark:bg-[#1a2b1f] dark:text-[#6ea07c] ring-[#527a5d]/40",
  },
  {
    key: EisenhowerQuadrantEnum.ELIMINATE,
    name: "Eliminate (Q4)",
    label: "Không gấp • Gom việc",
    badge: "+5 XP",
    icon: Trash2,
    colorClass:
      "border-[#7c7267]/40 bg-[#f2ede4] text-[#7c7267] dark:bg-[#28231f] dark:text-[#9e9488] ring-[#7c7267]/40",
  },
];

export const GoogleCalendarTaskModal: React.FC<GoogleCalendarTaskModalProps> = (props) => {
  if (!props.isOpen) return null;
  return <GoogleCalendarTaskModalContent {...props} />;
};

const GoogleCalendarTaskModalContent: React.FC<GoogleCalendarTaskModalProps> = ({
  onClose,
  onSaveTask,
  initialDate,
  initialStartTime,
  initialEndTime,
  initialQuadrant,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [taskType, setTaskType] = useState<TaskType>(TaskTypeEnum.EISENHOWER);
  const [quadrant, setQuadrant] = useState<EisenhowerQuadrant>(
    initialQuadrant || EisenhowerQuadrantEnum.GOLD_ZONE
  );

  const [scheduledDate, setScheduledDate] = useState(() => {
    return initialDate || new Date().toISOString().split("T")[0];
  });

  const [startTime, setStartTime] = useState(() => {
    return initialStartTime || "09:00";
  });

  const [endTime, setEndTime] = useState(() => {
    if (initialEndTime) return initialEndTime;
    if (initialStartTime) {
      const [h, m] = initialStartTime.split(":").map(Number);
      const nextH = Math.min(23, (h || 9) + 1);
      return `${String(nextH).padStart(2, "0")}:${String(m || 0).padStart(2, "0")}`;
    }
    return "10:00";
  });

  const [isAllDay, setIsAllDay] = useState(false);
  const [estimatedMinutes, setEstimatedMinutes] = useState(60);

  // Recurrence state
  const [recurrence, setRecurrence] = useState<RecurrenceConfig | null>(null);
  const [isCustomRecurrenceOpen, setIsCustomRecurrenceOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format date display for header e.g. "Thứ Năm, 1 tháng 10"
  const formattedDateTitle = (() => {
    try {
      const d = scheduledDate ? new Date(scheduledDate) : new Date();
      return d.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "numeric",
        month: "long",
      });
    } catch {
      return scheduledDate;
    }
  })();

  const recurrenceSummary = formatRecurrenceSummary(recurrence);

  const handleQuickRecurrenceChange = (value: string) => {
    if (value === "none") {
      setRecurrence(null);
    } else if (value === "daily") {
      setRecurrence({
        interval: 1,
        unit: "day",
        daysOfWeek: [],
        endType: "never",
      });
    } else if (value === "weekly") {
      let day = 1;
      try {
        day = Temporal.PlainDate.from(scheduledDate).dayOfWeek % 7;
      } catch {
        day = scheduledDate ? new Date(scheduledDate).getDay() : 1;
      }
      setRecurrence({
        interval: 1,
        unit: "week",
        daysOfWeek: [day],
        endType: "never",
      });
    } else if (value === "monthly") {
      setRecurrence({
        interval: 1,
        unit: "month",
        daysOfWeek: [],
        endType: "never",
      });
    } else if (value === "custom") {
      setIsCustomRecurrenceOpen(true);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      const recurringDates = recurrence
        ? generateRecurrenceDates(scheduledDate, recurrence, recurrence.occurrences || 30)
        : [scheduledDate];

      await onSaveTask({
        title: title.trim(),
        description: description.trim() || undefined,
        type: taskType,
        quadrant,
        scheduledDate,
        startTime: isAllDay ? "00:00" : startTime,
        endTime: isAllDay ? "23:59" : endTime,
        estimatedMinutes,
        recurrence,
        recurrenceSummary: recurrence ? recurrenceSummary : undefined,
        recurringDates,
      });

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/45 backdrop-blur-xs animate-in fade-in duration-150">
        <div
          className="w-full max-w-lg rounded-xl bg-surface border border-border shadow-warm-lg overflow-hidden flex flex-col text-text-primary animate-in zoom-in-95 duration-200"
          role="dialog"
          aria-modal="true"
        >
          {/* Top Bar with Drag Handle & Close */}
          <div className="flex items-center justify-between px-5 pt-3.5 pb-2 text-text-tertiary">
            <div className="flex items-center gap-1.5 opacity-70">
              <Menu className="w-4 h-4 cursor-grab stroke-[1.8]" />
            </div>
            <button
              onClick={onClose}
              type="button"
              className="p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors"
            >
              <X className="w-5 h-5 stroke-[1.8]" />
            </button>
          </div>

          <div className="px-6 py-2 space-y-5 max-h-[85vh] overflow-y-auto">
            {/* Title Input (Big Google Calendar style) */}
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSave();
                  }
                }}
                placeholder="Thêm tiêu đề"
                autoFocus
                className="w-full text-2xl font-serif-display font-semibold tracking-tight placeholder:text-text-tertiary/70 bg-transparent border-b-2 border-primary/30 focus:border-primary focus:outline-none pb-1.5 transition-colors"
              />
            </div>

            {/* Type Switcher Pills */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setTaskType(TaskTypeEnum.EISENHOWER)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  taskType === TaskTypeEnum.EISENHOWER
                    ? "bg-primary text-on-primary font-semibold shadow-warm-xs"
                    : "text-text-secondary bg-surface-secondary hover:bg-surface-tertiary"
                }`}
              >
                Công việc (Eisenhower)
              </button>
              <button
                type="button"
                onClick={() => setTaskType(TaskTypeEnum.BATCHING)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  taskType === TaskTypeEnum.BATCHING
                    ? "bg-accent-gold text-white font-semibold shadow-warm-xs"
                    : "text-text-secondary bg-surface-secondary hover:bg-surface-tertiary"
                }`}
              >
                Việc vặt gom 15p (Batching)
              </button>
            </div>

            {/* Eisenhower Quadrant Selector */}
            {taskType === TaskTypeEnum.EISENHOWER && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs font-semibold text-text-secondary">
                  <span>Mức độ ưu tiên (Eisenhower Matrix):</span>
                  <span className="text-[11px] text-accent-gold font-bold">
                    {QUADRANT_OPTIONS.find((q) => q.key === quadrant)?.badge}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {QUADRANT_OPTIONS.map((opt) => {
                    const isSelected = quadrant === opt.key;
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.key}
                        type="button"
                        onClick={() => setQuadrant(opt.key)}
                        className={`p-2.5 rounded-lg border text-left flex items-start gap-2.5 transition-all ${
                          isSelected
                            ? `${opt.colorClass} ring-1.5 shadow-warm-xs font-semibold`
                            : "border-border bg-surface-secondary/70 hover:bg-surface-secondary text-text-secondary"
                        }`}
                      >
                        <Icon className="w-4 h-4 mt-0.5 shrink-0 stroke-[1.8]" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold leading-tight truncate">
                            {opt.name}
                          </p>
                          <p className="text-[10px] text-text-tertiary mt-0.5 truncate">
                            {opt.label}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Date & Time Row */}
            <div className="flex items-start gap-3 pt-1">
              <Clock className="w-4 h-4 text-text-tertiary mt-2 shrink-0 stroke-[1.8]" />
              <div className="flex-1 space-y-2.5">
                {/* Formatted Date & Time Summary */}
                <div className="text-xs font-medium text-text-primary capitalize">
                  {formattedDateTitle}
                  {!isAllDay && ` • ${startTime} – ${endTime}`}
                </div>

                {/* Date and Time Inputs */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-surface-secondary px-2.5 py-1.5 rounded-lg border border-border">
                    <Calendar className="w-3.5 h-3.5 text-text-tertiary stroke-[1.8]" />
                    <input
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="bg-transparent text-xs text-text-primary focus:outline-none"
                    />
                  </div>

                  {!isAllDay && (
                    <div className="flex items-center gap-1 bg-surface-secondary px-2 py-1.5 rounded-lg border border-border">
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="bg-transparent text-xs text-text-primary focus:outline-none"
                      />
                      <span className="text-text-tertiary text-xs">–</span>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="bg-transparent text-xs text-text-primary focus:outline-none"
                      />
                    </div>
                  )}

                  <label className="flex items-center gap-1.5 text-xs text-text-secondary cursor-pointer ml-1 select-none">
                    <input
                      type="checkbox"
                      checked={isAllDay}
                      onChange={(e) => setIsAllDay(e.target.checked)}
                      className="w-3.5 h-3.5 rounded border-border accent-primary text-primary focus:ring-primary cursor-pointer"
                    />
                    <span>Cả ngày</span>
                  </label>
                </div>

                {/* Recurrence Dropdown / Trigger */}
                <div className="flex items-center gap-2 pt-1">
                  <Repeat className="w-3.5 h-3.5 text-text-tertiary stroke-[1.8]" />
                  <div className="relative flex-1">
                    <select
                      value={recurrence ? (recurrence.interval === 1 && recurrence.endType === "never" && recurrence.unit === "day" ? "daily" : recurrence.unit === "week" && recurrence.interval === 1 && recurrence.endType === "never" ? "weekly" : "custom") : "none"}
                      onChange={(e) => handleQuickRecurrenceChange(e.target.value)}
                      className="w-full appearance-none text-xs font-medium bg-surface-secondary text-text-primary border border-border rounded-lg px-2.5 py-1.5 pr-7 focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                    >
                      <option value="none">Không lặp lại</option>
                      <option value="daily">Hàng ngày</option>
                      <option value="weekly">Hàng tuần vào ngày này</option>
                      <option value="monthly">Hàng tháng</option>
                      <option value="custom">Tùy chỉnh lặp lại...</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-text-tertiary absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none stroke-[1.8]" />
                  </div>

                  {recurrence && (
                    <button
                      type="button"
                      onClick={() => setIsCustomRecurrenceOpen(true)}
                      className="text-[11px] text-primary hover:text-primary-hover hover:underline font-semibold whitespace-nowrap"
                    >
                      Sửa quy tắc
                    </button>
                  )}
                </div>

                {recurrence && (
                  <p className="text-[11px] text-primary bg-primary-soft px-2.5 py-1 rounded-md border border-primary/20 font-medium">
                    🔁 {recurrenceSummary}
                  </p>
                )}
              </div>
            </div>

            {/* Description Row */}
            <div className="flex items-start gap-3 pt-1">
              <AlignLeft className="w-4 h-4 text-text-tertiary mt-2 shrink-0 stroke-[1.8]" />
              <div className="flex-1">
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Thêm mô tả hoặc ghi chú cho công việc..."
                  className="w-full text-xs bg-surface-secondary border border-border rounded-lg p-2.5 placeholder:text-text-tertiary focus:outline-none focus:ring-1 focus:ring-primary transition-all text-text-primary"
                />
              </div>
            </div>

            {/* Estimated Duration Chips */}
            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="text-text-tertiary font-medium">Thời lượng:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {[15, 30, 45, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setEstimatedMinutes(mins)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all ${
                      estimatedMinutes === mins
                        ? "bg-primary text-on-primary font-semibold shadow-warm-xs"
                        : "bg-surface-secondary text-text-secondary hover:text-text-primary border border-border/50"
                    }`}
                  >
                    {mins}p
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Actions Footer */}
          <div className="flex items-center justify-between px-6 py-3.5 border-t border-border bg-surface-secondary/40 mt-3">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-medium text-text-secondary hover:text-text-primary px-3 py-1.5 rounded-md hover:bg-surface-secondary transition-colors"
            >
              Hủy
            </button>

            <button
              type="button"
              disabled={isSubmitting || !title.trim()}
              onClick={handleSave}
              className="px-4 py-2 rounded-md text-xs font-semibold bg-primary hover:bg-primary-hover text-on-primary shadow-warm-xs hover:shadow-warm disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 flex items-center gap-1.5"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu công việc"}
            </button>
          </div>
        </div>
      </div>

      {/* Nested Custom Recurrence Modal */}
      <CustomRecurrenceModal
        isOpen={isCustomRecurrenceOpen}
        onClose={() => setIsCustomRecurrenceOpen(false)}
        onApply={(config) => setRecurrence(config)}
        initialConfig={recurrence}
        baseDate={scheduledDate}
      />
    </>
  );
};
