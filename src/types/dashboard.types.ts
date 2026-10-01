import {
  GoalLevelEnum,
  EisenhowerQuadrantEnum,
  TaskTypeEnum,
  TaskStatusEnum,
} from "@/constants/dashboard.enums";

export type GoalLevel = GoalLevelEnum;

export interface Goal {
  id: string;
  title: string;
  description?: string | null;
  level: GoalLevel;
  parentGoalId?: string | null;
  isCompleted?: boolean;
  createdAt: string;
}

export interface GoalFunnel {
  yearly: Goal[];
  weekly: Goal[];
  daily: Goal[];
}

export type EisenhowerQuadrant = EisenhowerQuadrantEnum;

export type TaskType = TaskTypeEnum;

export type TaskStatus = TaskStatusEnum;

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  type?: TaskType;
  quadrant?: EisenhowerQuadrant;
  status: TaskStatus;
  scheduledDate?: string | null; // YYYY-MM-DD
  startTime?: string | null;     // HH:mm
  endTime?: string | null;       // HH:mm
  isGoldZone: boolean;
  estimatedMinutes?: number;
  completedAt?: string | null;
  createdAt: string;
}

export type EisenhowerMatrixData = Record<EisenhowerQuadrant, Task[]>;

export interface UserDashboardStats {
  xp: number;
  level: number;
  tierTitle: string;
  tierCode?: string;
  progressToNextLevel: number; // Percentage 0 - 100
  checkinStreak: number;
  perfectDayStreak: number;
  streakCount: number;
  isStreakActiveToday: boolean;
  nextLevelXp?: number;
  lastActiveDate?: string;
}

export interface CheckinResult {
  streakCount: number;
  checkinStreak: number;
  claimId?: string | null;
  isStreakActiveToday: boolean;
  xpGained?: number;
}

export interface DailyHabit {
  id: string;
  title: string;
  icon?: string;
  isActive: boolean;
  isCompletedToday: boolean;
  targetMinutes?: number;
  xpReward?: number;
  createdAt: string;
}

export interface PendingReward {
  id: string;
  actionType: string;
  rewardXp: number;
  claimDate: string;
  status: string;
  createdAt: string;
}

export interface ClaimRewardResult {
  id: string;
  status: string;
  claimedXp: number;
  newTotalXp: number;
  newLevel: number;
  tierTitle: string;
}

export interface CreateGoalDto {
  title: string;
  description?: string;
  level: GoalLevel;
  parentGoalId?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  type?: TaskType;
  quadrant?: EisenhowerQuadrant;
  scheduledDate?: string;
  startTime?: string;
  endTime?: string;
  estimatedMinutes?: number;
}

export interface ScheduleTaskDto {
  scheduledDate: string;
  startTime?: string;
  endTime?: string;
}

export interface TaskCompleteResult {
  task: Task;
  xpGained: number;
  currentXp: number;
  currentLevel: number;
}

export interface BatchingCompleteResult {
  completedCount: number;
  totalXpGained: number;
  newTotalXp?: number;
}

export interface ToggleHabitResult {
  habitId: string;
  isCompletedToday: boolean;
  xpGained?: number;
  newTotalXp?: number;
}
