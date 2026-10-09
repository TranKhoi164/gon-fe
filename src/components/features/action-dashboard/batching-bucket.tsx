"use client";

import React, { useState, useEffect } from "react";
import { Task } from "@/types/dashboard.types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { TRANSITION_CLASSES } from "@/constants/transition.constants";
import { cn } from "@/lib/utils";
import { Package, Zap, Pin, CheckCircle2, Clock } from "lucide-react";

export interface BatchingBucketProps {
  tasks: Task[];
  onAddBatchTask: (title: string) => Promise<void>;
  onCompleteBatchingSession: (taskIds: string[]) => Promise<void>;
}

export const BatchingBucket: React.FC<BatchingBucketProps> = ({
  tasks,
  onAddBatchTask,
  onCompleteBatchingSession,
}) => {
  const [isSprintModalOpen, setIsSprintModalOpen] = useState(false);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(15 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [newBatchTitle, setNewBatchTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  // Initialize selected task IDs when opening modal
  const handleOpenSprintModal = () => {
    setSelectedTaskIds(tasks.map((t) => t.id));
    setTimeLeftSeconds(15 * 60);
    setIsTimerRunning(true);
    setIsSprintModalOpen(true);
  };

  // Timer countdown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeLeftSeconds > 0) {
      interval = setInterval(() => {
        setTimeLeftSeconds((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeLeftSeconds]);

  const minutes = Math.floor(timeLeftSeconds / 60);
  const seconds = timeLeftSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const handleToggleSelect = (id: string) => {
    setSelectedTaskIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBatchTitle.trim()) return;
    setIsAdding(true);
    try {
      await onAddBatchTask(newBatchTitle.trim());
      setNewBatchTitle("");
    } finally {
      setIsAdding(false);
    }
  };

  const handleFinishSprint = async () => {
    if (selectedTaskIds.length === 0) return;
    setIsCompleting(true);
    try {
      await onCompleteBatchingSession(selectedTaskIds);
      setIsSprintModalOpen(false);
      setIsTimerRunning(false);
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <>
      <Card className="w-full space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
          <div>
            <h3 className="text-2xl font-serif-display font-bold text-text-primary flex items-center gap-2.5 tracking-tight">
              <Package className="w-5 h-5 text-primary stroke-[2]" />
              <span>Thùng Gom Việc Vặt</span>
            </h3>
            <p className="text-xs text-text-secondary mt-0.5">
              Gom các công việc vặt (&lt; 5 phút) để giải quyết dứt điểm trong 1 phiên 15 phút
            </p>
          </div>
          <Button
            size="sm"
            variant="gold"
            onClick={handleOpenSprintModal}
            disabled={tasks.length === 0}
            className="flex items-center gap-1.5 font-bold"
          >
            <Zap className="w-3.5 h-3.5 stroke-[2]" />
            <span>Xử lý nhanh Batching (15p)</span>
          </Button>
        </div>

        {/* Task Items */}
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="p-3 rounded-xl bg-surface-secondary/80 shadow-warm-xs border-0 flex items-center justify-between gap-2 text-xs"
            >
              <div className="flex items-center gap-2">
                <Pin className="w-3.5 h-3.5 text-text-tertiary" />
                <span className="font-medium text-text-primary">{task.title}</span>
              </div>
              <Badge variant="slate">{task.estimatedMinutes || 5} phút</Badge>
            </div>
          ))}

          {tasks.length === 0 ? (
            <div className="py-6 text-center text-xs text-text-tertiary border border-dashed border-border rounded-lg">
              Thùng gom việc vặt trống! Rất tốt, không có việc ngẫu nhiên nào bị đọng.
            </div>
          ) : null}
        </div>

        {/* Add Batch Task Inline */}
        <form onSubmit={handleCreateTask} className="flex items-center gap-2 pt-1">
          <Input
            placeholder="+ Thêm việc vặt mới vào thùng gom..."
            value={newBatchTitle}
            onChange={(e) => setNewBatchTitle(e.target.value)}
          />
          <Button type="submit" size="sm" variant="secondary" isLoading={isAdding} disabled={!newBatchTitle.trim()}>
            Gom
          </Button>
        </form>
      </Card>

      {/* 15-Minute Sprint Countdown Modal */}
      <Modal
        isOpen={isSprintModalOpen}
        onClose={() => setIsSprintModalOpen(false)}
        title="Phiên Xử Lý Nhanh Batching (15 Phút Sprint)"
        description="Giải quyết toàn bộ việc vặt mà không dừng lại!"
      >
        <div className="space-y-5">
          {/* Countdown Clock */}
          <div className="p-4 rounded-xl bg-accent-gold-soft border border-accent-gold/40 text-center space-y-1">
            <p className="text-xs font-bold text-amber-900 dark:text-amber-300 uppercase tracking-wider">
              Thời Gian Còn Lại
            </p>
            <p className="text-4xl font-black font-mono text-amber-800 dark:text-amber-300 tracking-tight">
              {formattedTime}
            </p>
          </div>

          {/* Task Select Checklist */}
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            <p className="text-xs font-semibold text-text-primary">
              Đánh dấu việc đã dọn xong ({selectedTaskIds.length}/{tasks.length}):
            </p>
            {tasks.map((task) => (
              <label
                key={task.id}
                className="p-3 rounded-lg border border-border bg-surface-secondary flex items-center gap-3 cursor-pointer hover:border-primary/40 transition-all text-xs"
              >
                <input
                  type="checkbox"
                  checked={selectedTaskIds.includes(task.id)}
                  onChange={() => handleToggleSelect(task.id)}
                  className={cn("h-4 w-4 rounded border-border text-primary focus:ring-primary", TRANSITION_CLASSES.INTERACTIVE)}
                />
                <span className="font-medium text-text-primary flex-1">{task.title}</span>
                <Badge variant="emerald">+10 XP</Badge>
              </label>
            ))}
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-border pt-3">
            <Button variant="ghost" size="sm" onClick={() => setIsSprintModalOpen(false)}>
              Bỏ qua
            </Button>
            <Button
              variant="gold"
              size="md"
              isLoading={isCompleting}
              onClick={handleFinishSprint}
              disabled={selectedTaskIds.length === 0}
              className="flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Hoàn Thành Phiên Sprint ({selectedTaskIds.length * 10} XP)</span>
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
