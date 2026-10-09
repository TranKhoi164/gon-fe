import { EisenhowerQuadrantEnum } from "@/constants/dashboard.enums";
import { RecurrencePreset } from "@/utils/recurrence";

/** Kích thước popover tạo nhanh (px) */
export const QUICK_CREATE_POPOVER_WIDTH = 400;

/** ID sự kiện nháp hiển thị trên lịch khi đang tạo nhanh */
export const QUICK_CREATE_DRAFT_EVENT_ID = "__quick_create_draft__";

/** Bước làm tròn giờ khi click vào ô lịch (phút) */
export const QUICK_CREATE_SNAP_MINUTES = 30;

export const QUICK_CREATE_DEFAULT_START = "09:00";
export const QUICK_CREATE_DEFAULT_END = "10:00";
export const QUICK_CREATE_ALL_DAY_START = "00:00";
export const QUICK_CREATE_ALL_DAY_END = "23:59";

export const QUICK_CREATE_LABELS = {
  TITLE_PLACEHOLDER: "Thêm tiêu đề",
  UNTITLED: "(Không có tiêu đề)",
  TYPE_EISENHOWER: "Công việc",
  TYPE_BATCHING: "Việc vặt (Batching)",
  ALL_DAY: "Cả ngày",
  DESCRIPTION_PLACEHOLDER: "Thêm mô tả",
  RECURRENCE_PLACEHOLDER: "Lặp lại",
  EDIT_RULE: "Sửa quy tắc",
  QUADRANT: "Mức ưu tiên",
  CLOSE: "Đóng",
  CANCEL: "Hủy",
  SAVE: "Lưu",
  STATUS_SAVING: "Đang lưu...",
  STATUS_ERROR: "Lưu thất bại",
} as const;

export const QUICK_CREATE_RECURRENCE_OPTIONS: { value: RecurrencePreset; label: string }[] = [
  { value: "none", label: "Không lặp lại" },
  { value: "daily", label: "Hàng ngày" },
  { value: "weekly", label: "Hàng tuần vào ngày này" },
  { value: "monthly", label: "Hàng tháng" },
  { value: "custom", label: "Tùy chỉnh..." },
];

export const QUICK_CREATE_QUADRANT_OPTIONS = [
  { key: EisenhowerQuadrantEnum.GOLD_ZONE, name: "Gold Zone", hint: "Quan trọng • Lên lịch (+30 XP)", color: "#c8832a" },
  { key: EisenhowerQuadrantEnum.DO_FIRST, name: "Do First", hint: "Khẩn cấp & Quan trọng (+20 XP)", color: "#b84e46" },
  { key: EisenhowerQuadrantEnum.DELEGATE, name: "Delegate", hint: "Khẩn cấp • Ủy quyền (+10 XP)", color: "#527a5d" },
  { key: EisenhowerQuadrantEnum.ELIMINATE, name: "Eliminate", hint: "Không gấp • Gom việc (+5 XP)", color: "#7c7267" },
] as const;
