"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EisenhowerQuadrant, TaskType } from "@/types/dashboard.types";
import { EisenhowerQuadrantEnum, TaskTypeEnum } from "@/constants/dashboard.enums";
import { UI_MESSAGES } from "@/constants/messages.constants";

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
          placeholder="Bạn cần làm gì tiếp theo? (VD: Viết BA Wireframe, Check mail)..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />

        {/* Category Tabs: Eisenhower vs Batching */}
        <div className="flex items-center gap-1.5 p-1 bg-surface-tertiary rounded-xl border border-border-subtle">
          <button
            type="button"
            onClick={() => setTaskType(TaskTypeEnum.EISENHOWER)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              taskType === TaskTypeEnum.EISENHOWER
                ? "bg-primary text-on-primary shadow-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            📊 Ma Trận Eisenhower
          </button>
          <button
            type="button"
            onClick={() => setTaskType(TaskTypeEnum.BATCHING)}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              taskType === TaskTypeEnum.BATCHING
                ? "bg-primary text-on-primary shadow-xs"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            📦 Thùng Gom Việc Vặt (15p)
          </button>
        </div>

        {taskType === TaskTypeEnum.EISENHOWER ? (
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-text-secondary">
              Phân loại ô ưu tiên:
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setQuadrant(EisenhowerQuadrantEnum.GOLD_ZONE)}
                className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                  quadrant === EisenhowerQuadrantEnum.GOLD_ZONE
                    ? "bg-accent-gold-soft border-accent-gold text-amber-900 dark:text-amber-300 ring-1 ring-accent-gold"
                    : "bg-surface-secondary border-border text-text-secondary hover:border-accent-gold/40"
                }`}
              >
                ⭐ GOLD ZONE (+30 XP)
              </button>
              <button
                type="button"
                onClick={() => setQuadrant(EisenhowerQuadrantEnum.DO_FIRST)}
                className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                  quadrant === EisenhowerQuadrantEnum.DO_FIRST
                    ? "bg-red-500/10 border-red-500 text-red-700 dark:text-red-400 ring-1 ring-red-500"
                    : "bg-surface-secondary border-border text-text-secondary hover:border-red-500/40"
                }`}
              >
                🔴 Khẩn Cấp & Quan Trọng
              </button>
              <button
                type="button"
                onClick={() => setQuadrant(EisenhowerQuadrantEnum.DELEGATE)}
                className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                  quadrant === EisenhowerQuadrantEnum.DELEGATE
                    ? "bg-amber-500/10 border-amber-500 text-amber-800 dark:text-amber-400 ring-1 ring-amber-500"
                    : "bg-surface-secondary border-border text-text-secondary hover:border-amber-500/40"
                }`}
              >
                🟠 Khẩn Cấp & Không Quan Trọng
              </button>
              <button
                type="button"
                onClick={() => setQuadrant(EisenhowerQuadrantEnum.ELIMINATE)}
                className={`p-2.5 rounded-xl border font-bold text-left transition-all ${
                  quadrant === EisenhowerQuadrantEnum.ELIMINATE
                    ? "bg-surface-tertiary border-border text-text-primary ring-1 ring-border"
                    : "bg-surface-secondary border-border text-text-secondary hover:border-border"
                }`}
              >
                ⚪ Không Khẩn & Không Quan Trọng
              </button>
            </div>
          </div>
        ) : (
          <div className="p-3 rounded-xl bg-accent-gold/10 border border-accent-gold/30 text-xs text-text-secondary">
            💡 Công việc này sẽ được chuyển vào <strong className="text-text-primary">Thùng Gom Việc Vặt</strong> để xử lý tập trung trong phiên 15 phút.
          </div>
        )}

        <div className="flex items-center justify-end gap-2 border-t border-border pt-3">
          <Button variant="ghost" size="sm" type="button" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" size="md" isLoading={isLoading} disabled={!title.trim()}>
            ➕ Thêm Nhanh
          </Button>
        </div>
      </form>
    </Modal>
  );
};
