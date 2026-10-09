import {
  EisenhowerQuadrantEnum,
  GoalLevelEnum,
  TaskTypeEnum,
  TaskStatusEnum,
} from "./dashboard.enums";
import {
  EisenhowerQuadrant,
  EisenhowerMatrixData,
  GoalFunnel,
  UserDashboardStats,
  DailyHabit,
  Task,
  PendingReward,
} from "@/types/dashboard.types";

// Tạm ẩn Phễu Mục Tiêu (MAZE AIM) trên dashboard — đổi thành true để hiện lại
export const SHOW_GOAL_FUNNEL_BANNER = false;

export interface QuadrantMeta {
  key: EisenhowerQuadrant;
  title: string;
  subtitle: string;
  badge: string;
  xpBonusText: string;
  isGoldZone: boolean;
}

export const EISENHOWER_QUADRANTS_CONFIG: QuadrantMeta[] = [
  {
    key: EisenhowerQuadrantEnum.GOLD_ZONE,
    title: "🟡 1. GOLD ZONE (Vùng Vàng - Quan Trọng & Không Gấp)",
    subtitle: "Khu vực tạo sự thăng tiến vượt bậc, Deep Work & Tư duy dài hạn",
    badge: "⭐ GOLD ZONE",
    xpBonusText: "⭐ +30 XP (+50% Bonus)",
    isGoldZone: true,
  },
  {
    key: EisenhowerQuadrantEnum.DO_FIRST,
    title: "🔴 2. DO FIRST (Khẩn Cấp & Quan Trọng)",
    subtitle: "Dập lửa, khủng hoảng & nhiệm vụ có deadline cận kề",
    badge: "Khẩn cấp",
    xpBonusText: "+20 XP",
    isGoldZone: false,
  },
  {
    key: EisenhowerQuadrantEnum.DELEGATE,
    title: "🟠 3. DELEGATE (Khẩn Cấp & Không Quan Trọng)",
    subtitle: "Ủy quyền, tự động hóa hoặc gom lại xử lý dứt điểm",
    badge: "Ủy quyền/Gom",
    xpBonusText: "+10 XP",
    isGoldZone: false,
  },
  {
    key: EisenhowerQuadrantEnum.ELIMINATE,
    title: "⚪ 4. ELIMINATE (Không Khẩn & Không Quan Trọng)",
    subtitle: "Việc vặt gây xao nhãng — Đưa vào phiên gom việc 15 phút (Batching)",
    badge: "Việc vặt / Q4",
    xpBonusText: "+5 XP",
    isGoldZone: false,
  },
];

export const INITIAL_USER_STATS_MOCK: UserDashboardStats = {
  xp: 450,
  level: 3,
  tierTitle: "Tập sự kỷ luật",
  tierCode: "NOVICE",
  progressToNextLevel: 45.0,
  checkinStreak: 5,
  perfectDayStreak: 2,
  streakCount: 7,
  isStreakActiveToday: false,
  nextLevelXp: 1000,
  lastActiveDate: new Date().toISOString().split("T")[0],
};

export const INITIAL_GOAL_FUNNEL_MOCK: GoalFunnel = {
  yearly: [
    { id: "g-y1", title: "Đạt chứng chỉ IELTS 7.5 và nâng cấp kiến thức", level: GoalLevelEnum.YEARLY, isCompleted: false, createdAt: "2026-01-01" },
    { id: "g-y2", title: "Thăng tiến Senior Fullstack Engineer & System Architect", level: GoalLevelEnum.YEARLY, isCompleted: false, createdAt: "2026-01-01" },
    { id: "g-y3", title: "Xây dựng Second Brain vững chắc giải phóng tâm trí", level: GoalLevelEnum.YEARLY, isCompleted: false, createdAt: "2026-01-01" },
  ],
  weekly: [
    { id: "g-w1", title: "Hoàn thiện hệ thống Action Dashboard và XP Gamification", level: GoalLevelEnum.WEEKLY, isCompleted: false, createdAt: "2026-09-20" },
    { id: "g-w2", title: "Luyện 5 bài Reading IELTS & tổng hợp từ vựng Feynman", level: GoalLevelEnum.WEEKLY, isCompleted: false, createdAt: "2026-09-20" },
    { id: "g-w3", title: "Duy trì chuỗi Perfect Day ít nhất 4 ngày trong tuần", level: GoalLevelEnum.WEEKLY, isCompleted: false, createdAt: "2026-09-20" },
  ],
  daily: [
    { id: "g-d1", title: "Làm 1 bài Reading Test 1 theo phương pháp Active Recall", level: GoalLevelEnum.DAILY, isCompleted: false, createdAt: "2026-09-28" },
    { id: "g-d2", title: "Ôn tập 20 Flashcards Spaced Repetition", level: GoalLevelEnum.DAILY, isCompleted: false, createdAt: "2026-09-28" },
    { id: "g-d3", title: "Chạy bộ 30 phút hoặc tập Cardio duy trì thể lực", level: GoalLevelEnum.DAILY, isCompleted: false, createdAt: "2026-09-28" },
  ],
};

export const INITIAL_EISENHOWER_TASKS_MOCK: EisenhowerMatrixData = {
  [EisenhowerQuadrantEnum.GOLD_ZONE]: [
    {
      id: "6f81b20b-1de5-4394-9b1e-1c57c1929251",
      title: "Học 30 phút Tiếng Anh theo phương pháp Feynman",
      description: "Học theo phương pháp Feynman và ghi chép lại bản chất",
      type: TaskTypeEnum.EISENHOWER,
      quadrant: EisenhowerQuadrantEnum.GOLD_ZONE,
      status: TaskStatusEnum.TODO,
      isGoldZone: true,
      scheduledDate: "2026-09-28",
      startTime: "14:00",
      endTime: "14:30",
      estimatedMinutes: 30,
      createdAt: "2026-09-28T08:00:00.000Z",
    },
    {
      id: "7a92c30d-2fe6-5405-ac2f-2d68d2930362",
      title: "Ôn tập Flashcards từ vựng học thuật",
      description: "Ôn 20 thẻ từ vựng với Spaced Repetition",
      type: TaskTypeEnum.EISENHOWER,
      quadrant: EisenhowerQuadrantEnum.GOLD_ZONE,
      status: TaskStatusEnum.TODO,
      isGoldZone: true,
      scheduledDate: "2026-09-28",
      startTime: "20:00",
      endTime: "20:30",
      estimatedMinutes: 30,
      createdAt: "2026-09-28T13:20:00.000Z",
    },
  ],
  [EisenhowerQuadrantEnum.DO_FIRST]: [
    {
      id: "550e8400-e29b-41d4-a716-446655440000",
      title: "Nộp báo cáo quý 3 cho ban giám đốc",
      description: "Gửi cho sếp trước 17h chiều",
      type: TaskTypeEnum.EISENHOWER,
      quadrant: EisenhowerQuadrantEnum.DO_FIRST,
      status: TaskStatusEnum.TODO,
      isGoldZone: false,
      scheduledDate: "2026-09-28",
      startTime: "09:00",
      endTime: "10:30",
      estimatedMinutes: 90,
      createdAt: "2026-09-28T08:00:00.000Z",
    },
  ],
  [EisenhowerQuadrantEnum.DELEGATE]: [
    {
      id: "t-del-1",
      title: "Hẹn lịch họp sprint review với team design",
      description: "Gửi lời mời Google Calendar cho 5 thành viên",
      type: TaskTypeEnum.EISENHOWER,
      quadrant: EisenhowerQuadrantEnum.DELEGATE,
      status: TaskStatusEnum.TODO,
      isGoldZone: false,
      scheduledDate: "2026-09-28",
      startTime: "11:00",
      endTime: "11:15",
      estimatedMinutes: 15,
      createdAt: "2026-09-28T08:00:00.000Z",
    },
  ],
  [EisenhowerQuadrantEnum.ELIMINATE]: [
    {
      id: "t-eli-1",
      title: "Dọn dẹp hòm thư rác Gmail (Inbox Zero)",
      type: TaskTypeEnum.EISENHOWER,
      quadrant: EisenhowerQuadrantEnum.ELIMINATE,
      status: TaskStatusEnum.TODO,
      isGoldZone: false,
      estimatedMinutes: 5,
      createdAt: "2026-09-28T08:00:00.000Z",
    },
  ],
};

export const INITIAL_DAILY_HABITS_MOCK: DailyHabit[] = [
  {
    id: "8b03d41e-3gf7-6516-bd3g-3e79e3040473",
    title: "Uống 2L nước lọc mỗi ngày",
    icon: "💧",
    isActive: true,
    isCompletedToday: true,
    targetMinutes: 5,
    xpReward: 10,
    createdAt: "2026-09-20T08:00:00.000Z",
  },
  {
    id: "9c14e52f-4hg8-7627-ce4h-4f80f4150584",
    title: "Đọc sách 15 phút (Feynman Note)",
    icon: "📖",
    isActive: true,
    isCompletedToday: false,
    targetMinutes: 15,
    xpReward: 15,
    createdAt: "2026-09-20T08:00:00.000Z",
  },
  {
    id: "h-meditate",
    title: "Thiền định Deep Focus 10 phút",
    icon: "🧘‍♂️",
    isActive: true,
    isCompletedToday: false,
    targetMinutes: 10,
    xpReward: 15,
    createdAt: "2026-09-20T08:00:00.000Z",
  },
  {
    id: "h-exercise",
    title: "Tập gym / Chạy bộ 30 phút",
    icon: "🏋️‍♂️",
    isActive: true,
    isCompletedToday: false,
    targetMinutes: 30,
    xpReward: 25,
    createdAt: "2026-09-20T08:00:00.000Z",
  },
];

export const INITIAL_BATCHING_TASKS_MOCK: Task[] = [
  { id: "b-1", title: "Dọn dẹp hòm thư rác Gmail (Clear Inbox Zero)", type: TaskTypeEnum.BATCHING, status: TaskStatusEnum.TODO, isGoldZone: false, estimatedMinutes: 5, createdAt: "2026-09-28" },
  { id: "b-2", title: "Thanh toán hóa đơn tiền điện & nước hàng tháng", type: TaskTypeEnum.BATCHING, status: TaskStatusEnum.TODO, isGoldZone: false, estimatedMinutes: 3, createdAt: "2026-09-28" },
  { id: "b-3", title: "Cập nhật ứng dụng trên App Store & Windows", type: TaskTypeEnum.BATCHING, status: TaskStatusEnum.TODO, isGoldZone: false, estimatedMinutes: 4, createdAt: "2026-09-28" },
  { id: "b-4", title: "Gửi tin nhắn hẹn lịch họp nhóm ngày mai", type: TaskTypeEnum.BATCHING, status: TaskStatusEnum.TODO, isGoldZone: false, estimatedMinutes: 2, createdAt: "2026-09-28" },
];

export const INITIAL_PENDING_REWARDS_MOCK: PendingReward[] = [
  {
    id: "rew-checkin-3",
    actionType: "CHECKIN_STREAK",
    rewardXp: 50,
    claimDate: "2026-09-28",
    status: "READY_TO_CLAIM",
    createdAt: "2026-09-28T07:00:00.000Z",
  },
];
