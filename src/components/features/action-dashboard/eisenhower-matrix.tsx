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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  onAddTask: (title: string, quadrant: EisenhowerQuadrant, description?: string) => Promise<void>;
  onMoveToBatching?: (task: Task) => void;
}

export const EisenhowerMatrix: React.FC<EisenhowerMatrixProps> = ({
  data,
  onToggleTaskStatus,
  onAddTask,
  onMoveToBatching,
}) => {
  const [addingQuadrant, setAddingQuadrant] = useState<EisenhowerQuadrant | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [loadingTaskId, setLoadingTaskId] = useState<string | null>(null);

  const handleCreateTask = async (quadrant: EisenhowerQuadrant) => {
    if (!newTitle.trim()) return;
    try {
      await onAddTask(newTitle.trim(), quadrant, newDesc.trim() || undefined);
      setNewTitle("");
      setNewDesc("");
      setAddingQuadrant(null);
    } catch (err) {
      console.error(err);
    }
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-2xl font-serif-display font-bold text-text-primary flex items-center gap-2.5 tracking-tight">
            <LayoutGrid className="w-5 h-5 text-primary stroke-[2]" />
            <span>Ma Trận 4 Ô Eisenhower</span>
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Ưu tiên làm trước <span className="font-bold text-amber-600 dark:text-amber-400">Gold Zone</span> để gặt hái thành tựu đột phá và nhận thêm điểm thưởng XP
          </p>
        </div>
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
              className="flex flex-col justify-between space-y-4 min-h-[290px] transition-all"
            >
              {/* Header Quadrant */}
              <div className="space-y-1 pb-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-text-primary flex items-center gap-1.5">
                    <span>{config.title}</span>
                  </h3>
                  <Badge variant={isGold ? "gold" : "primary"} className="font-bold text-xs">
                    {config.xpBonusText}
                  </Badge>
                </div>
                <p className="text-xs text-text-tertiary">{config.subtitle}</p>
              </div>

              {/* Task List */}
              <div className="space-y-2 flex-1 my-2 overflow-y-auto max-h-[240px] pr-1">
                {tasks.map((task) => {
                  const isDone = task.status === "COMPLETED";
                  const isLoading = loadingTaskId === task.id;

                  return (
                    <div
                      key={task.id}
                      className={`p-3 rounded-xl transition-all flex items-start gap-3 group ${
                        isDone
                          ? "bg-surface-secondary/40 opacity-60 line-through text-text-tertiary"
                          : isGold
                          ? "bg-amber-500/10 text-text-primary shadow-warm-xs hover:shadow-warm"
                          : "bg-surface-secondary/80 text-text-primary hover:bg-surface-secondary shadow-warm-xs"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isDone}
                        disabled={isLoading}
                        onChange={() => handleToggle(task.id, task.status)}
                        className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer transition-transform active:scale-95"
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
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-tertiary border border-border-subtle">
                              <Calendar className="w-3 h-3 text-text-tertiary" />
                              <span>{task.scheduledDate}</span>
                              {task.startTime && task.endTime ? ` (${task.startTime} - ${task.endTime})` : ""}
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
                      <div className="flex items-center gap-1.5 self-center">
                        {isGold && !isDone ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded-full bg-accent-gold-soft border border-accent-gold/40">
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

              {/* Quick Add Task to Quadrant */}
              <div className="pt-1">
                {addingQuadrant === config.key ? (
                  <div className="space-y-2 p-2.5 rounded-xl bg-surface-secondary border border-border">
                    <Input
                      placeholder="Tên công việc cần làm..."
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) handleCreateTask(config.key);
                      }}
                      autoFocus
                    />
                    <Input
                      placeholder="Mô tả bổ sung hoặc ghi chú (tùy chọn)..."
                      value={newDesc}
                      onChange={(e) => setNewDesc(e.target.value)}
                      className="text-xs"
                    />
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setAddingQuadrant(null);
                          setNewTitle("");
                          setNewDesc("");
                        }}
                      >
                        Hủy
                      </Button>
                      <Button size="sm" onClick={() => handleCreateTask(config.key)}>
                        Lưu công việc
                      </Button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setAddingQuadrant(config.key);
                      setNewTitle("");
                      setNewDesc("");
                    }}
                    className="w-full py-2 text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-tertiary border border-dashed border-border rounded-xl transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm công việc vào {config.title.split(" ")[1]}</span>
                  </button>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
