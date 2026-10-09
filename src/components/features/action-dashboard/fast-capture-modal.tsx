"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EisenhowerQuadrant, TaskType } from "@/types/dashboard.types";
import { EisenhowerQuadrantEnum, TaskTypeEnum } from "@/constants/dashboard.enums";
import { UI_MESSAGES } from "@/constants/messages.constants";
import { TRANSITION_CLASSES } from "@/constants/transition.constants";
import { cn } from "@/lib/utils";
import { Plus, Sparkles, Flame, UserCheck, Trash2, LayoutGrid, Package } from "lucide-react";

export interface FastCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (title: string, type: TaskType, quadrant?: EisenhowerQuadrant) => Promise<void>;
}

export const FastCaptureModal: React.FC<FastCaptureModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
}) => {
  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState<TaskType>(TaskTypeEnum.EISENHOWER);
  const [quadrant, setQuadrant] = useState<EisenhowerQuadrant>(
    EisenhowerQuadrantEnum.GOLD_ZONE
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsLoading(true);
    try {
      await onAddTask(
        title.trim(),
        taskType,
        taskType === TaskTypeEnum.EISENHOWER ? quadrant : undefined
      );
      setTitle("");
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={UI_MESSAGES.FAST_CAPTURE_TITLE}
      description={UI_MESSAGES.FAST_CAPTURE_SUBTITLE}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Bạn cần làm gì tiếp theo? (VD: Viết Wireframe, Kiểm tra mail)..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />

        {/* Category Tabs: Eisenhower vs Batching */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-secondary rounded-lg border border-border">
          <button
            type="button"
            onClick={() => setTaskType(TaskTypeEnum.EISENHOWER)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all ${
              taskType === TaskTypeEnum.EISENHOWER
                ? "bg-primary text-on-primary shadow-warm-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 stroke-[1.8]" />
            <span>Ma Trận Eisenhower</span>
          </button>
          <button
            type="button"
            onClick={() => setTaskType(TaskTypeEnum.BATCHING)}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 transition-all ${
              taskType === TaskTypeEnum.BATCHING
                ? "bg-primary text-on-primary shadow-warm-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            <Package className="w-3.5 h-3.5 stroke-[1.8]" />
            <span>Thùng Gom Việc Vặt (15p)</span>
          </button>
        </div>

        {taskType === TaskTypeEnum.EISENHOWER ? (
          <div className={cn("space-y-1.5", TRANSITION_CLASSES.FADE_IN)}>
            <label className="text-xs font-semibold text-text-secondary">
              Phân loại ô ưu tiên:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setQuadrant(EisenhowerQuadrantEnum.GOLD_ZONE)}
                className={`p-2.5 rounded-md border font-medium text-left transition-all flex items-start gap-1.5 ${
                  quadrant === EisenhowerQuadrantEnum.GOLD_ZONE
                    ? "bg-accent-gold-soft border-accent-gold/40 text-accent-gold ring-1 ring-accent-gold/30"
                    : "bg-surface-secondary border-border text-text-secondary hover:border-accent-gold/40"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0 stroke-[1.8]" />
                <div>
                  <p className="font-semibold text-text-primary">Gold Zone</p>
                  <p className="text-[10px] text-text-tertiary">+30 XP</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setQuadrant(EisenhowerQuadrantEnum.DO_FIRST)}
                className={`p-2.5 rounded-md border font-medium text-left transition-all flex items-start gap-1.5 ${
                  quadrant === EisenhowerQuadrantEnum.DO_FIRST
                    ? "bg-[#fae8e6] border-[#b84e46]/40 text-[#b84e46] ring-1 ring-[#b84e46]/30 dark:bg-[#381a17] dark:text-[#df7068]"
                    : "bg-surface-secondary border-border text-text-secondary hover:border-[#b84e46]/40"
                }`}
              >
                <Flame className="w-3.5 h-3.5 mt-0.5 shrink-0 stroke-[1.8]" />
                <div>
                  <p className="font-semibold text-text-primary">Do First</p>
                  <p className="text-[10px] text-text-tertiary">+20 XP</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setQuadrant(EisenhowerQuadrantEnum.DELEGATE)}
                className={`p-2.5 rounded-md border font-medium text-left transition-all flex items-start gap-1.5 ${
                  quadrant === EisenhowerQuadrantEnum.DELEGATE
                    ? "bg-[#eaf2ec] border-[#527a5d]/40 text-[#527a5d] ring-1 ring-[#527a5d]/30 dark:bg-[#1a2b1f] dark:text-[#6ea07c]"
                    : "bg-surface-secondary border-border text-text-secondary hover:border-[#527a5d]/40"
                }`}
              >
                <UserCheck className="w-3.5 h-3.5 mt-0.5 shrink-0 stroke-[1.8]" />
                <div>
                  <p className="font-semibold text-text-primary">Delegate</p>
                  <p className="text-[10px] text-text-tertiary">+10 XP</p>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setQuadrant(EisenhowerQuadrantEnum.ELIMINATE)}
                className={`p-2.5 rounded-md border font-medium text-left transition-all flex items-start gap-1.5 ${
                  quadrant === EisenhowerQuadrantEnum.ELIMINATE
                    ? "bg-[#f2ede4] border-[#7c7267]/40 text-[#7c7267] ring-1 ring-[#7c7267]/30 dark:bg-[#28231f] dark:text-[#9e9488]"
                    : "bg-surface-secondary border-border text-text-secondary hover:border-border"
                }`}
              >
                <Trash2 className="w-3.5 h-3.5 mt-0.5 shrink-0 stroke-[1.8]" />
                <div>
                  <p className="font-semibold text-text-primary">Eliminate</p>
                  <p className="text-[10px] text-text-tertiary">+5 XP</p>
                </div>
              </button>
            </div>
          </div>
        ) : (
          <div className={cn("p-3 rounded-lg bg-accent-gold-soft/50 border border-accent-gold/20 text-xs text-text-secondary", TRANSITION_CLASSES.FADE_IN)}>
            Công việc này sẽ được chuyển vào <strong className="text-text-primary">Thùng Gom Việc Vặt</strong> để xử lý tập trung trong phiên 15 phút.
          </div>
        )}

        <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
          <Button variant="ghost" size="sm" type="button" onClick={onClose} className="rounded-md">
            Hủy
          </Button>
          <Button type="submit" size="md" isLoading={isLoading} disabled={!title.trim()} className="rounded-md flex items-center gap-1.5">
            <Plus className="w-3.5 h-3.5 stroke-[2]" />
            <span>Thêm công việc</span>
          </Button>
        </div>
      </form>
    </Modal>
  );
};
