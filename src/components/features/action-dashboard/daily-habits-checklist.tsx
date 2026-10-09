"use client";

import React, { useState } from "react";
import { DailyHabit } from "@/types/dashboard.types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TRANSITION_CLASSES } from "@/constants/transition.constants";
import { cn } from "@/lib/utils";
import { Sun, Sparkles, Clock, CheckCircle2 } from "lucide-react";

export interface DailyHabitsChecklistProps {
  habits: DailyHabit[];
  onToggleHabit: (id: string) => Promise<void>;
  onAddHabit?: (title: string) => Promise<void>;
}

export const DailyHabitsChecklist: React.FC<DailyHabitsChecklistProps> = ({
  habits,
  onToggleHabit,
  onAddHabit,
}) => {
  const [newTitle, setNewTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const completedCount = habits.filter((h) => h.isCompletedToday).length;

  const handleToggle = async (id: string) => {
    setLoadingId(id);
    try {
      await onToggleHabit(id);
    } finally {
      setLoadingId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !onAddHabit) return;
    setIsAdding(true);
    try {
      await onAddHabit(newTitle.trim());
      setNewTitle("");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="w-full space-y-3.5">
      <div className="flex items-center justify-between pb-2">
        <div>
          <h3 className="text-2xl font-serif-display font-bold text-text-primary flex items-center gap-2.5 tracking-tight">
            <Sun className="w-5 h-5 text-amber-600 dark:text-amber-400 stroke-[2]" />
            <span>Thói Quen Kỷ Luật</span>
          </h3>
          <p className="text-xs text-text-secondary mt-0.5">
            Duy trì nhịp điệu hàng ngày để tích lũy XP và duy trì chuỗi Perfect Day
          </p>
        </div>
        <Badge
          variant={completedCount === habits.length && habits.length > 0 ? "emerald" : "gold"}
          className="font-bold text-xs"
        >
          {completedCount} / {habits.length} Hoàn Thành
        </Badge>
      </div>

      {/* Habit items */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {habits.map((habit) => {
          const isDone = habit.isCompletedToday;
          const isLoading = loadingId === habit.id;

          return (
            <div
              key={habit.id}
              onClick={() => !isLoading && handleToggle(habit.id)}
              className={`p-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-3 select-none ${
                isDone
                  ? "bg-emerald-500/10 text-text-primary shadow-warm-xs"
                  : "bg-surface-secondary/80 text-text-primary hover:bg-surface-secondary shadow-warm-xs hover:shadow-warm"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <input
                  type="checkbox"
                  checked={isDone}
                  disabled={isLoading}
                  onChange={() => {}} // handled by parent div onClick
                  className={cn("h-4 w-4 rounded border-border text-emerald-600 focus:ring-emerald-500 cursor-pointer", TRANSITION_CLASSES.INTERACTIVE)}
                />
                <div className="p-1 rounded-lg bg-surface-tertiary flex-shrink-0 text-text-secondary">
                  <Sparkles className="w-4 h-4 stroke-[1.8]" />
                </div>
                <div className="min-w-0">
                  <p
                    className={`text-sm font-semibold truncate ${
                      isDone ? "line-through text-text-secondary" : ""
                    }`}
                  >
                    {habit.title}
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] text-text-tertiary">
                    {habit.targetMinutes ? (
                      <>
                        <Clock className="w-3 h-3" />
                        <span>{habit.targetMinutes} phút</span>
                      </>
                    ) : (
                      "Hàng ngày"
                    )}
                  </span>
                </div>
              </div>

              <Badge variant={isDone ? "emerald" : "gold"} className="text-[11px] flex-shrink-0 font-bold">
                +{habit.xpReward || 15} XP
              </Badge>
            </div>
          );
        })}

        {habits.length === 0 ? (
          <div className="col-span-2 py-6 text-center text-xs text-text-tertiary border border-dashed border-border rounded-xl">
            Chưa có thói quen nào hôm nay. Hãy tạo thói quen kỷ luật đầu tiên bên dưới!
          </div>
        ) : null}
      </div>

      {/* Add Habit Form */}
      {onAddHabit ? (
        <form onSubmit={handleCreate} className="flex items-center gap-2 pt-1 border-t border-border-subtle">
          <Input
            placeholder="+ Thêm thói quen kỷ luật mới (VD: Đọc 10 trang sách)..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="text-xs"
          />
          <Button
            type="submit"
            size="sm"
            variant="secondary"
            isLoading={isAdding}
            disabled={!newTitle.trim()}
          >
            Thêm
          </Button>
        </form>
      ) : null}
    </Card>
  );
};
