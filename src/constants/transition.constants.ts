/**
 * Chuẩn animation enter/exit dùng chung (CLAUDE.md §3.7).
 * Enter: dùng variant `starting:` (CSS @starting-style) → chạy ngay khi element được mount.
 * Exit: element được giữ trong DOM với `data-state="closed"` cho tới khi hết thời gian exit (xem usePresence).
 */

/** Thời lượng exit (ms) — phải khớp với class duration-* bên dưới */
export const TRANSITION_MS = {
  POPOVER: 200,
  MODAL: 250,
} as const;

export const TRANSITION_CLASSES = {
  /** Backdrop/overlay của modal: fade */
  OVERLAY:
    "transition-opacity duration-250 ease-out starting:opacity-0 data-[state=closed]:opacity-0 data-[state=closed]:ease-in data-[state=closed]:pointer-events-none",
  /** Nội dung modal: fade + zoom 95% → 100% */
  MODAL_PANEL:
    "transition-[opacity,scale] duration-250 ease-out starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[state=closed]:ease-in",
  /** Toast, banner, thông báo nhỏ: fade + trượt nhẹ */
  FADE_SLIDE:
    "transition-[opacity,translate] duration-200 ease-out starting:opacity-0 starting:-translate-y-1 data-[state=closed]:opacity-0 data-[state=closed]:-translate-y-1 data-[state=closed]:ease-in",
  /** Dropdown/picker tự viết: fade + zoom */
  POP:
    "transition-[opacity,scale] duration-200 ease-out starting:opacity-0 starting:scale-95 data-[state=closed]:opacity-0 data-[state=closed]:scale-95 data-[state=closed]:ease-in",
  /** Phần tử mới thay thế phần tử cũ (swap nội dung): fade-in khi mount */
  FADE_IN: "transition-opacity duration-200 ease-out starting:opacity-0",
  /** Phần tử tương tác (button, input, item): chuyển màu/viền/shadow khi hover/focus */
  INTERACTIVE: "transition-[color,background-color,border-color,box-shadow,opacity] duration-150",
  /** Nội dung Radix (Popover/Select/Tooltip): fade + zoom, ease-out khi mở, ease-in khi đóng */
  RADIX_CONTENT:
    "animate-in fade-in-0 zoom-in-95 duration-200 ease-out data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-150 data-[state=closed]:ease-in",
  /** Phần form/khối nội dung ẩn hiện: co giãn chiều cao + fade */
  COLLAPSE:
    "grid transition-[grid-template-rows,opacity] duration-200 ease-out grid-rows-[1fr] starting:grid-rows-[0fr] starting:opacity-0 data-[state=closed]:grid-rows-[0fr] data-[state=closed]:opacity-0 data-[state=closed]:ease-in",
} as const;
