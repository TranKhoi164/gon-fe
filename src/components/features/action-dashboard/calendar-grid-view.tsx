"use client";

import React, { useState } from "react";
import { Task } from "@/types/dashboard.types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Sparkles } from "lucide-react";

export interface CalendarGridViewProps {
  tasks: Task[];
}

export const CalendarGridView: React.FC<CalendarGridViewProps> = ({ tasks }) => {
  const [viewMode, setViewMode] = useState<"WEEK" | "MONTH">("WEEK");

  const daysOfWeek = [
    { name: "T2", date: "21/09" },
    { name: "T3", date: "22/09" },
    { name: "T4", date: "23/09" },
    { name: "T5", date: "24/09" },
    { name: "T6 (Hôm nay)", date: "25/09", isToday: true },
    { name: "T7", date: "26/09" },
    { name: "CN", date: "27/09" },
  ];

  return (
    <Card className="w-full space-y-4">
      {/* Calendar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h2 className="text-2xl font-serif-display font-bold text-text-primary flex items-center gap-2.5 tracking-tight">
            <Calendar className="w-5 h-5 text-primary stroke-[2]" />
            <span>Lịch Biểu Timeboxing Grid</span>
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Trực quan hóa công việc theo dòng thời gian ngày và tuần
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 p-1 bg-surface-secondary rounded-xl">
            <button
              onClick={() => setViewMode("WEEK")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === "WEEK"
                  ? "bg-primary text-on-primary shadow-warm-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Tuần (Week)
            </button>
            <button
              onClick={() => setViewMode("MONTH")}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                viewMode === "MONTH"
                  ? "bg-primary text-on-primary shadow-warm-xs"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Tháng (Month)
            </button>
          </div>
          <Badge variant="gold">Tháng 09 / 2026</Badge>
        </div>
      </div>

      {/* Week Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px] grid grid-cols-7 gap-2 rounded-xl p-3 bg-surface-secondary/70 shadow-warm-xs border-0">
          {daysOfWeek.map((day) => (
            <div
              key={day.name}
              className={`p-3 rounded-lg flex flex-col space-y-2 min-h-[180px] shadow-warm-xs border-0 ${
                day.isToday
                  ? "bg-primary-soft/50 ring-1 ring-primary/30"
                  : "bg-surface"
              }`}
            >
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-border-subtle">
                <span className={`font-bold ${day.isToday ? "text-primary" : "text-text-primary"}`}>
                  {day.name}
                </span>
                <span className="text-[11px] text-text-tertiary">{day.date}</span>
              </div>

              {/* Task Items in Day Grid */}
              <div className="space-y-1.5 flex-1">
                {day.isToday ? (
                  <>
                    {tasks.map((task) => (
                      <div
                        key={task.id}
                        className={`p-2 rounded text-xs font-medium border flex items-center justify-between gap-1 ${
                          task.isGoldZone
                            ? "bg-accent-gold-soft border-accent-gold/40 text-amber-950 dark:text-amber-300"
                            : "bg-surface-secondary border-border text-text-primary"
                        }`}
                      >
                        <span className="truncate">{task.title}</span>
                        {task.isGoldZone ? (
                          <Sparkles className="w-3 h-3 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                        ) : null}
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-[11px] text-text-tertiary italic">
                    Chưa xếp lịch
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
