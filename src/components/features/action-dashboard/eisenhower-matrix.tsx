"use client";

import React, { useState } from "react";
import {
  EisenhowerMatrixData,
  EisenhowerQuadrant,
  Task,
} from "@/types/dashboard.types";
import { EISENHOWER_QUADRANTS_CONFIG } from "@/constants/dashboard.constants";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LayoutGrid,
  Calendar,
  Clock,
  Sparkles,
  Package,
  Plus,
} from "lucide-react";

export interface EisenhowerMatrixProps {
  data: EisenhowerMatrixData;
  onToggleTaskStatus: (taskId: string, currentStatus: string) => Promise<void>;
  onAddTask?: (title: string, quadrant: EisenhowerQuadrant, description?: string) => Promise<void>;
  onMoveToBatching?: (task: Task) => void;
  onOpenCreateModal?: (quadrant?: EisenhowerQuadrant) => void;
}

export const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({
  data,
  onToggleTaskStatus,
  onMoveToBatching,
  onOpenCreateModal,
}) => {
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);

  const handleToggle = async (taskId: string, currentStatus: string) => {
    setLoadingTaskId(taskId);
    try {
      await onToggleTaskStatus(taskId, currentStatus);
    } finally {
      setLoadingTaskId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with Title and Dedicated Separate Create Task Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-4 sm:p-5 rounded-xl shadow-warm border border-border">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif-display font-bold text-text-primary flex items-center gap-2.5 tracking-tight">
            <LayoutGrid className="w-5 h-5 text-primary stroke-[1.8]" />
            <span>Ma Trận 4 Ô Eisenhower</span>
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Ưu tiên làm trước <span className="font-semibold text-accent-gold">Gold Zone</span> để gặt hái thành tựu đột phá và nhận thêm điểm thưởng XP
          </p>
        </div>

        {/* Dedicated Separate Create Task Button */}
        <button
          type="button"
          onClick={() => onOpenCreateModal?.()}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary-hover text-on-primary font-medium text-xs rounded-md shadow-warm-xs hover:shadow-warm transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2]" />
          <span>Tạo công việc mới</span>
        </button>
      </div>

      {/* 4 Quadrants Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {EISENHOWER_QUADRANTS_CONFIG.map((config) => {
          const tasks: Task[] = data[config.key] || [];
          const isGold = config.isGoldZone;

          return (
            <Card
              key={config.key}
              variant={isGold ? "goldZone" : "default"}
              className="flex flex-col justify-between space-y-4 min-h-[300px] transition-all rounded-xl p-4 sm:p-5 border border-border"
            >
              {/* Header Quadrant with Add Button */}
              <div className="space-y-1.5 pb-2 border-b border-border/50">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5 truncate font-serif-display">
                    <span>{config.title}</span>
                  </h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge variant={isGold ? "gold" : "primary"} className="font-medium text-[11px] rounded-md">
                      {config.xpBonusText}
                    </Badge>
                    {/* Clean Add Button for this Quadrant */}
                    <button
                      type="button"
                      onClick={() => onOpenCreateModal?.(config.key)}
                      title={`Tạo công việc vào ${config.title}`}
                      className="p-1 rounded-lg text-text-tertiary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
                    >
                      <Plus className="w-4 h-4 stroke-[1.8]" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-text-tertiary line-clamp-1">{config.subtitle}</p>
              </div>

              {/* Task List */}
              <div className="space-y-2 flex-1 my-2 overflow-y-auto max-h-[280px] pr-1">
                {tasks.map((task) => {
                  const isDone = task.status === "COMPLETED";
                  const isLoading = loadingTaskId === task.id;

                  return (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg transition-all flex items-start gap-3 group ${
                        isDone
                          ? "bg-surface-secondary/40 opacity-60 line-through text-text-tertiary"
                          : isGold
                          ? "bg-accent-gold-soft/60 text-text-primary shadow-warm-xs hover:shadow-warm border border-accent-gold/20"
                          : "bg-surface-secondary/70 text-text-primary hover:bg-surface-secondary shadow-warm-xs border border-border"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isDone}
                        disabled={isLoading}
                        onChange={() => handleToggle(task.id, task.status)}
                        className="mt-0.5 w-4 h-4 rounded border-border accent-primary text-primary focus:ring-primary cursor-pointer disabled:opacity-50"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-snug break-words">
                          {task.title}
                        </p>
                        {task.description ? (
                          <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">
                            {task.description}
                          </p>
                        ) : null}

                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-[11px] text-text-tertiary">
                          {task.scheduledDate ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-tertiary border border-border-subtle font-medium">
                              <Calendar className="w-3 h-3 text-text-tertiary" />
                              <span>{task.scheduledDate}</span>
                              {task.startTime && task.endTime ? ` (${task.startTime} – ${task.endTime})` : ""}
                            </span>
                          ) : null}
                          {task.estimatedMinutes ? (
                            <span className="inline-flex items-center gap-1">
                              <Clock className="w-3 h-3 text-text-tertiary" />
                              <span>{task.estimatedMinutes}p</span>
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* Right Tag / Actions */}
                      <div className="flex items-center gap-1.5 self-center shrink-0">
                        {isGold && !isDone ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-md bg-accent-gold-soft border border-accent-gold/40">
                            <Sparkles className="w-3 h-3" />
                            <span>+30 XP</span>
                          </span>
                        ) : null}

                        {config.key === "ELIMINATE" && !isDone && onMoveToBatching ? (
                          <button
                            onClick={() => onMoveToBatching(task)}
                            className="inline-flex items-center gap-1 text-[11px] text-text-tertiary hover:text-text-primary px-1.5 py-0.5 rounded bg-surface-tertiary border border-border"
                            title="Chuyển vào thùng gom việc vặt 15p"
                          >
                            <Package className="w-3 h-3" />
                            <span>Gom</span>
                          </button>
                        ) : null}
                      </div>
                    </div>
                  );
                })}

                {tasks.length === 0 ? (
                  <div className="py-8 text-center text-xs text-text-tertiary border border-dashed border-border rounded-xl">
                    Chưa có công việc nào trong ô này.
                  </div>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
