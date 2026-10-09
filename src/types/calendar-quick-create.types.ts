import { CreateTaskDto, EisenhowerQuadrant, TaskType } from "@/types/dashboard.types";
import { RecurrenceConfig } from "@/types/recurrence.types";

/** Vị trí (toạ độ viewport) nơi người dùng click trên lịch để neo popover */
export interface QuickCreateAnchor {
  x: number;
  y: number;
}

/** Ô lịch được chọn để mở popover tạo nhanh */
export interface QuickCreateSlot {
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  anchor: QuickCreateAnchor;
}

export interface QuickCreateDraft {
  title: string;
  description: string;
  type: TaskType;
  quadrant: EisenhowerQuadrant;
  scheduledDate: string;
  startTime: string;
  endTime: string;
  isAllDay: boolean;
  recurrence: RecurrenceConfig | null;
}

export interface QuickCreateHandlers {
  /** Tạo mới công việc, trả về id thật từ backend */
  onCreate: (dto: CreateTaskDto) => Promise<{ id: string }>;
}
