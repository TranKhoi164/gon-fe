export const TOAST_MESSAGES = {
  GOAL_CREATED: "🎯 Đã tạo mục tiêu mới!",
  GOAL_DELETED: "🗑️ Đã xóa mục tiêu thành công!",
  TASK_CREATED: "✨ Đã tạo công việc mới!",
  TASK_COMPLETED: (xpEarned: number) => `🎉 +${xpEarned} XP! Đã hoàn thành công việc!`,
  HABIT_TOGGLED: (xpEarned: number) => `⭐ +${xpEarned} XP! Thói quen duy trì kỷ luật!`,
  BATCHING_SESSION_COMPLETED: (xpEarned: number, count: number) =>
    `⚡ +${xpEarned} XP! Hoàn thành ${count} việc vặt!`,
} as const;

export const UI_MESSAGES = {
  SEARCH_SHORTCUT_PLACEHOLDER: "🔍 Tim kiếm & Thêm nhanh",
  SYNC_STATUS_ACTIVE: "Synced",
  FAST_CAPTURE_TITLE: "🚀 Fast Capture (Ctrl+K)",
  FAST_CAPTURE_SUBTITLE: "Ghi nhận ý tưởng hoặc công việc mới trong 3 giây",
  BATCHING_MODAL_TITLE: "⚡ Phiên Xử Lý Nhanh Batching (15 Phút Sprint)",
  BATCHING_MODAL_SUBTITLE: "Giải quyết toàn bộ việc vặt mà không dừng lại!",
} as const;
