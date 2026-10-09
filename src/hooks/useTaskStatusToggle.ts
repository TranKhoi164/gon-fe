"use client";

import { useCallback, useState } from "react";
import { CalendarTaskItem, TaskStatus } from "@/types/dashboard.types";
import { TaskStatusEnum } from "@/constants/dashboard.enums";
import { getTaskEventId } from "@/utils/calendarEvent";

interface StatusOverride {
  /** Trạng thái trên server lúc bấm — server đổi khác đi (refetch xong) thì bỏ override */
  from: TaskStatus;
  to: TaskStatus;
}

/**
 * Tick / bỏ tick hoàn thành theo kiểu optimistic, dùng chung cho ô sự kiện trên lịch và modal chi tiết.
 */
export function useTaskStatusToggle(
  onToggle?: (id: string, date: string, newStatus: TaskStatusEnum) => Promise<void>
) {
  const [overrides, setOverrides] = useState<Record<string, StatusOverride>>({});

  const getStatus = useCallback(
    (task: CalendarTaskItem): TaskStatus => {
      const override = overrides[getTaskEventId(task)];
      return override && override.from === task.status ? override.to : task.status;
    },
    [overrides]
  );

  const toggleStatus = useCallback(
    async (task: CalendarTaskItem) => {
      const key = getTaskEventId(task);
      const current = getStatus(task);
      const next = current === TaskStatusEnum.COMPLETED ? TaskStatusEnum.TODO : TaskStatusEnum.COMPLETED;
      setOverrides((prev) => ({ ...prev, [key]: { from: task.status, to: next } }));
      try {
        await onToggle?.(task.id, task.occurrenceDate, next);
      } catch (err) {
        console.error("Error toggling task status:", err);
        setOverrides((prev) => {
          const rest = { ...prev };
          delete rest[key];
          return rest;
        });
      }
    },
    [getStatus, onToggle]
  );

  return { getStatus, toggleStatus };
}
