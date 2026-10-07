"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { GamifiedHeaderBar } from "@/components/features/action-dashboard/gamified-header-bar";
import { GoalFunnelBanner } from "@/components/features/action-dashboard/goal-funnel-banner";
import { EisenhowerMatrix } from "@/components/features/action-dashboard/eisenhower-matrix";
import { CalendarGridView } from "@/components/features/action-dashboard/calendar-grid-view";
import { BatchingBucket } from "@/components/features/action-dashboard/batching-bucket";
import { FastCaptureModal } from "@/components/features/action-dashboard/fast-capture-modal";
import { RewardsModal } from "@/components/features/action-dashboard/rewards-modal";
import { LayoutGrid, Calendar, Sparkles } from "lucide-react";
import { GoogleCalendarTaskModal } from "@/components/features/action-dashboard/google-calendar-task-modal";
import { RecurrenceConfig } from "@/types/recurrence.types";

import { dashboardService } from "@/services/dashboardService";
import {
  UserDashboardStats,
  GoalFunnel,
  GoalLevel,
  EisenhowerMatrixData,
  EisenhowerQuadrant,
  Task,
  CalendarTaskItem,
  TaskType,
  PendingReward,
  ClaimRewardResult,
  CreateTaskDto,
  OverrideOccurrenceDto,
} from "@/types/dashboard.types";
import {
  INITIAL_USER_STATS_MOCK,
  INITIAL_GOAL_FUNNEL_MOCK,
  INITIAL_EISENHOWER_TASKS_MOCK,
  INITIAL_BATCHING_TASKS_MOCK,
  INITIAL_PENDING_REWARDS_MOCK,
} from "@/constants/dashboard.constants";
import {
  GoalLevelEnum,
  EisenhowerQuadrantEnum,
  TaskTypeEnum,
  TaskStatusEnum,
  DashboardViewModeEnum,
} from "@/constants/dashboard.enums";
import { TOAST_MESSAGES } from "@/constants/messages.constants";

export default function ActionDashboardPage() {
  const [stats, setStats] = useState<UserDashboardStats>(INITIAL_USER_STATS_MOCK);
  const [funnel, setFunnel] = useState<GoalFunnel>(INITIAL_GOAL_FUNNEL_MOCK);
  const [eisenhowerData, setEisenhowerData] = useState<EisenhowerMatrixData>(INITIAL_EISENHOWER_TASKS_MOCK);
  const [includeUnscheduled, setIncludeUnscheduled] = useState(false);
  const [calendarTasks, setCalendarTasks] = useState<CalendarTaskItem[]>([]);
  const [calendarRange, setCalendarRange] = useState<{ start: string; end: string }>(() => {
    const today = new Date();
    const start = new Date(today.getFullYear(), today.getMonth(), 1);
    start.setDate(start.getDate() - 7);
    const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    end.setDate(end.getDate() + 7);
    return {
      start: start.toISOString().split("T")[0],
      end: end.toISOString().split("T")[0],
    };
  });
  const [batchingTasks, setBatchingTasks] = useState<Task[]>(INITIAL_BATCHING_TASKS_MOCK);
  const [pendingRewards, setPendingRewards] = useState<PendingReward[]>(INITIAL_PENDING_REWARDS_MOCK);

  const [viewMode, setViewMode] = useState<DashboardViewModeEnum>(DashboardViewModeEnum.EISENHOWER);
  const [isFastCaptureOpen, setIsFastCaptureOpen] = useState(false);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
  const [xpToast, setXpToast] = useState<{ message: string } | null>(null);

  const [isGoogleTaskModalOpen, setIsGoogleTaskModalOpen] = useState(false);
  const [googleModalInitialData, setGoogleModalInitialData] = useState<{
    date?: string;
    startTime?: string;
    endTime?: string;
    quadrant?: EisenhowerQuadrant;
  }>({});

  const handleOpenGoogleTaskModal = (initialData?: {
    date?: string;
    startTime?: string;
    endTime?: string;
    quadrant?: EisenhowerQuadrant;
  }) => {
    setGoogleModalInitialData(initialData || {});
    setIsGoogleTaskModalOpen(true);
  };

  // Show floating XP reward notification toast
  const triggerXpToast = (message: string) => {
    setXpToast({ message });
    setTimeout(() => setXpToast(null), 3500);
  };

  // Re-fetch dashboard stats to keep XP & streaks in sync
  const refreshStats = useCallback(async () => {
    const updatedStats = await dashboardService.getDashboardStats();
    setStats(updatedStats);
  }, []);

  // Fetch calendar tasks for range
  const fetchCalendarTasks = useCallback(async (startStr: string, endStr: string) => {
    const data = await dashboardService.getCalendarTasks(startStr, endStr);
    setCalendarTasks(data);
  }, []);

  // Range change callback from calendar
  const handleRangeChange = useCallback((startStr: string, endStr: string) => {
    setCalendarRange({ start: startStr, end: endStr });
    fetchCalendarTasks(startStr, endStr);
  }, [fetchCalendarTasks]);

  // Initial Data Fetching
  useEffect(() => {
    let isMounted = true;
    const fetchAllDashboardData = async () => {
      const todayStr = new Date().toISOString().split("T")[0];
      const [
        fetchedStats,
        fetchedFunnel,
        fetchedMatrix,
        fetchedBatching,
        fetchedRewards,
        fetchedCalendarTasks,
      ] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getGoalFunnel(),
        dashboardService.getEisenhowerTasks(todayStr, includeUnscheduled),
        dashboardService.getBatchingTasks(),
        dashboardService.getPendingRewards(),
        dashboardService.getCalendarTasks(calendarRange.start, calendarRange.end),
      ]);

      if (isMounted) {
        setStats(fetchedStats);
        setFunnel(fetchedFunnel);
        setEisenhowerData(fetchedMatrix);
        setBatchingTasks(fetchedBatching);
        setPendingRewards(fetchedRewards);
        setCalendarTasks(fetchedCalendarTasks);
      }
    };

    fetchAllDashboardData();
    return () => {
      isMounted = false;
    };
  }, [calendarRange.start, calendarRange.end, includeUnscheduled]);

  // Global Ctrl+K Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsFastCaptureOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // 1. Check-in Handler
  const handleCheckin = async () => {
    const result = await dashboardService.checkin();
    setStats((prev) => ({
      ...prev,
      isStreakActiveToday: true,
      streakCount: result.streakCount,
      checkinStreak: result.checkinStreak,
      xp: prev.xp + (result.xpGained || 10),
    }));
    triggerXpToast(`+${result.xpGained || 10} XP - Điểm danh ngày thành công! Giữ chuỗi kỷ luật.`);
    await refreshStats();
  };

  // 2. Rewards Claim Handler
  const handleClaimReward = async (id: string): Promise<ClaimRewardResult | null> => {
    const result = await dashboardService.claimReward(id);
    setPendingRewards((prev) => prev.filter((r) => r.id !== id));
    setStats((prev) => ({
      ...prev,
      xp: result.newTotalXp,
      level: result.newLevel,
      tierTitle: result.tierTitle,
    }));
    triggerXpToast(`+${result.claimedXp} XP - Đã nhận phần thưởng ${result.tierTitle}!`);
    await refreshStats();
    return result;
  };

  // 3. Goal Funnel Handlers
  const handleAddGoal = async (title: string, level: GoalLevel, parentGoalId?: string) => {
    const newGoal = await dashboardService.createGoal({ title, level, parentGoalId });
    setFunnel((prev) => {
      const key =
        level === GoalLevelEnum.YEARLY
          ? "yearly"
          : level === GoalLevelEnum.WEEKLY
          ? "weekly"
          : "daily";
      return {
        ...prev,
        [key]: [...prev[key], newGoal],
      };
    });
    triggerXpToast(TOAST_MESSAGES.GOAL_CREATED);
  };

  const handleDeleteGoal = async (id: string) => {
    await dashboardService.deleteGoal(id);
    setFunnel((prev) => ({
      yearly: prev.yearly.filter((g) => g.id !== id),
      weekly: prev.weekly.filter((g) => g.id !== id),
      daily: prev.daily.filter((g) => g.id !== id),
    }));
    triggerXpToast(TOAST_MESSAGES.GOAL_DELETED);
  };

  // 4. Eisenhower Task Handlers
  const handleToggleTaskStatus = async (task: Task) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const nextStatus =
      task.status === TaskStatusEnum.COMPLETED
        ? TaskStatusEnum.TODO
        : TaskStatusEnum.COMPLETED;

    let xpGained = 0;
    let currentXp = stats.xp;
    let currentLevel = stats.level;

    if (task.isRecurring) {
      const occurrenceDate = task.occurrenceDate || todayStr;
      const result = await dashboardService.updateOccurrenceStatus(
        task.id,
        occurrenceDate,
        nextStatus
      );
      xpGained = result.xpGained;
      currentXp = result.currentXp;
      currentLevel = result.currentLevel;

      // Update local calendarTasks state if present
      setCalendarTasks((prev) =>
        prev.map((item) =>
          item.id === task.id && item.occurrenceDate === occurrenceDate
            ? { ...item, status: nextStatus, completedAt: result.task.completedAt }
            : item
        )
      );
    } else {
      const result = await dashboardService.completeTask(task.id);
      xpGained = result.xpGained;
      currentXp = result.currentXp || currentXp + xpGained;
      currentLevel = result.currentLevel || currentLevel;

      // Update local calendarTasks state if present
      setCalendarTasks((prev) =>
        prev.map((item) =>
          item.id === task.id
            ? { ...item, status: nextStatus, completedAt: result.task.completedAt }
            : item
        )
      );
    }

    // Update state matrix
    setEisenhowerData((prev) => {
      const updated = { ...prev };
      (Object.keys(updated) as EisenhowerQuadrant[]).forEach((quadrant) => {
        updated[quadrant] = updated[quadrant].map((t) =>
          t.id === task.id
            ? {
                ...t,
                status: nextStatus,
                completedAt:
                  nextStatus === TaskStatusEnum.COMPLETED
                    ? new Date().toISOString()
                    : undefined,
              }
            : t
        );
      });
      return updated;
    });

    if (xpGained > 0) {
      setStats((prev) => ({
        ...prev,
        xp: currentXp,
        level: currentLevel,
      }));
      triggerXpToast(`+${xpGained} XP - Hoàn thành công việc! Tích lũy kỷ luật.`);
      await refreshStats();
    } else if (xpGained < 0) {
      setStats((prev) => ({
        ...prev,
        xp: currentXp,
        level: currentLevel,
      }));
      triggerXpToast(`Đã hủy hoàn thành (${xpGained} XP)`);
      await refreshStats();
    }
  };

  const handleToggleIncludeUnscheduled = async () => {
    const nextVal = !includeUnscheduled;
    setIncludeUnscheduled(nextVal);
    const todayStr = new Date().toISOString().split("T")[0];
    const matrix = await dashboardService.getEisenhowerTasks(todayStr, nextVal);
    setEisenhowerData(matrix);
  };

  const handleAddTask = async (
    title: string,
    type: TaskType,
    quadrant?: EisenhowerQuadrant,
    description?: string
  ) => {
    const defaultQuadrant = EisenhowerQuadrantEnum.GOLD_ZONE;
    const createdTask = await dashboardService.createTask({
      title,
      description,
      type,
      quadrant: quadrant || defaultQuadrant,
    });

    if (type === TaskTypeEnum.BATCHING) {
      setBatchingTasks((prev) => [...prev, createdTask]);
    } else {
      const q = quadrant || defaultQuadrant;
      setEisenhowerData((prev) => ({
        ...prev,
        [q]: [...prev[q], createdTask],
      }));
    }
    triggerXpToast(TOAST_MESSAGES.TASK_CREATED);
  };

  const handleSaveGoogleTask = async ({
    title,
    description,
    type,
    quadrant,
    scheduledDate,
    startTime,
    endTime,
    estimatedMinutes,
    rrule,
    recurrenceSummary,
  }: {
    title: string;
    description?: string;
    type: TaskType;
    quadrant: EisenhowerQuadrant;
    scheduledDate: string;
    startTime: string;
    endTime: string;
    estimatedMinutes: number;
    rrule?: string;
    recurrence?: RecurrenceConfig | null;
    recurrenceSummary?: string;
    recurringDates?: string[];
  }) => {
    const fullDesc = recurrenceSummary
      ? description
        ? `🔁 ${recurrenceSummary}\n\n${description}`
        : `🔁 ${recurrenceSummary}`
      : description;

    // Create 1 single task on backend with optional rrule (Zero-Waste Database)
    const createdTask = await dashboardService.createTask({
      title,
      description: fullDesc,
      type,
      quadrant,
      scheduledDate,
      startTime: startTime ? `${startTime}:00` : undefined,
      endTime: endTime ? `${endTime}:00` : undefined,
      estimatedMinutes,
      rrule,
    });

    if (type === TaskTypeEnum.BATCHING) {
      setBatchingTasks((prev) => [...prev, createdTask]);
    } else {
      const todayStr = new Date().toISOString().split("T")[0];
      const matrix = await dashboardService.getEisenhowerTasks(todayStr);
      setEisenhowerData(matrix);
    }

    // Refresh calendar tasks
    await fetchCalendarTasks(calendarRange.start, calendarRange.end);

    triggerXpToast(
      rrule ? "Đã tạo chuỗi công việc lặp lại thành công!" : TOAST_MESSAGES.TASK_CREATED
    );
  };

  // Toggle Occurrence Status (Tick/Untick)
  const handleToggleOccurrenceStatus = async (
    id: string,
    date: string,
    newStatus: TaskStatusEnum
  ) => {
    const result = await dashboardService.updateOccurrenceStatus(id, date, newStatus);

    // Update local calendarTasks state
    setCalendarTasks((prev) =>
      prev.map((item) =>
        item.id === id && item.occurrenceDate === date
          ? { ...item, status: newStatus, completedAt: result.task.completedAt }
          : item
      )
    );

    // Refresh today's Eisenhower matrix if occurrence is today
    const todayStr = new Date().toISOString().split("T")[0];
    if (date === todayStr) {
      const matrix = await dashboardService.getEisenhowerTasks(todayStr);
      setEisenhowerData(matrix);
    }

    // Gamification Toast & Stats update
    if (result.xpGained > 0) {
      triggerXpToast(`+${result.xpGained} XP - Hoàn thành công việc!`);
    } else if (result.xpGained < 0) {
      triggerXpToast(`Đã hủy hoàn thành (${result.xpGained} XP)`);
    }

    setStats((prev) => ({
      ...prev,
      xp: result.currentXp,
      level: result.currentLevel,
    }));
    await refreshStats();
  };

  // Override Occurrence (Edit single day)
  const handleOverrideOccurrence = async (
    id: string,
    date: string,
    dto: OverrideOccurrenceDto
  ) => {
    await dashboardService.overrideOccurrence(id, date, dto);
    await fetchCalendarTasks(calendarRange.start, calendarRange.end);
    const todayStr = new Date().toISOString().split("T")[0];
    if (date === todayStr) {
      const matrix = await dashboardService.getEisenhowerTasks(todayStr);
      setEisenhowerData(matrix);
    }
    triggerXpToast("Đã cập nhật riêng cho ngày này thành công!");
  };

  // Cancel Occurrence (Skip/Delete single day)
  const handleCancelOccurrence = async (id: string, date: string) => {
    await dashboardService.cancelOccurrence(id, date);
    setCalendarTasks((prev) =>
      prev.filter((item) => !(item.id === id && item.occurrenceDate === date))
    );
    const todayStr = new Date().toISOString().split("T")[0];
    if (date === todayStr) {
      const matrix = await dashboardService.getEisenhowerTasks(todayStr);
      setEisenhowerData(matrix);
    }
    triggerXpToast("Đã bỏ qua công việc cho ngày này!");
  };

  // Update Entire Series
  const handleUpdateTaskSeries = async (id: string, dto: Partial<CreateTaskDto>) => {
    await dashboardService.updateTaskSeries(id, dto);
    await fetchCalendarTasks(calendarRange.start, calendarRange.end);
    const todayStr = new Date().toISOString().split("T")[0];
    const matrix = await dashboardService.getEisenhowerTasks(todayStr);
    setEisenhowerData(matrix);
    triggerXpToast("Đã cập nhật toàn bộ chuỗi công việc thành công!");
  };

  // Delete Entire Series
  const handleDeleteTaskSeries = async (id: string) => {
    await dashboardService.deleteTaskSeries(id);
    setCalendarTasks((prev) => prev.filter((item) => item.id !== id));
    const todayStr = new Date().toISOString().split("T")[0];
    const matrix = await dashboardService.getEisenhowerTasks(todayStr);
    setEisenhowerData(matrix);
    triggerXpToast("Đã xóa chuỗi công việc thành công!");
  };

  const handleMoveToBatching = async (task: Task) => {
    // Remove from Eliminate quadrant
    setEisenhowerData((prev) => ({
      ...prev,
      [EisenhowerQuadrantEnum.ELIMINATE]: prev[EisenhowerQuadrantEnum.ELIMINATE].filter(
        (t) => t.id !== task.id
      ),
    }));
    // Add to Batching tasks
    setBatchingTasks((prev) => [...prev, { ...task, type: TaskTypeEnum.BATCHING }]);

    // Persist to backend
    await dashboardService.updateTaskSeries(task.id, { type: TaskTypeEnum.BATCHING });

    triggerXpToast("Đã chuyển việc vặt vào Thùng Gom Batching 15p!");
  };

  // 5. Batching Session Handler
  const handleCompleteBatchingSession = async (taskIds: string[]) => {
    const result = await dashboardService.completeBatchingSession(taskIds);
    setBatchingTasks((prev) => prev.filter((t) => !taskIds.includes(t.id)));
    setStats((prev) => ({
      ...prev,
      xp: result.newTotalXp || prev.xp + result.totalXpGained,
    }));
    triggerXpToast(
      TOAST_MESSAGES.BATCHING_SESSION_COMPLETED(
        result.totalXpGained,
        result.completedCount
      )
    );
    await refreshStats();
  };

  return (
    <div className="min-h-screen bg-background text-text-primary flex font-sans">
      {/* Navigation Sidebar (Collapsible) */}
      <Sidebar userStats={stats} onOpenFastCapture={() => setIsFastCaptureOpen(true)} />

      {/* Floating XP Reward Toast */}
      {xpToast ? (
        <div className="fixed top-6 right-6 z-50 px-4 py-2.5 rounded-lg bg-accent-gold text-slate-950 font-bold text-xs shadow-warm-lg animate-in slide-in-from-top-3 duration-300 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-slate-950" />
          <span>{xpToast.message}</span>
        </div>
      ) : null}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 max-w-7xl mx-auto p-4 md:p-6 space-y-6 overflow-y-auto">
          {/* Gamified Header Bar with Tier, Streak & Check-in */}
          <GamifiedHeaderBar
            stats={stats}
            pendingRewards={pendingRewards}
            onCheckin={handleCheckin}
            onOpenRewards={() => setIsRewardsModalOpen(true)}
          />

          {/* 3-3-3 Goal Funnel Banner (MAZE AIM) */}
          <GoalFunnelBanner
            funnel={funnel}
            onAddGoal={handleAddGoal}
            onDeleteGoal={handleDeleteGoal}
          />

          {/* View Mode Switcher Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-surface px-3.5 py-2 rounded-xl shadow-warm border border-border/40">
            <span className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider font-serif-display">
              Chế Độ Xem Hành Động
            </span>
            <div className="flex items-center gap-1 p-0.5 bg-surface-secondary rounded-lg">
              <button
                onClick={() => setViewMode(DashboardViewModeEnum.EISENHOWER)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  viewMode === DashboardViewModeEnum.EISENHOWER
                    ? "bg-primary text-on-primary shadow-warm-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Ma Trận Eisenhower</span>
              </button>
              <button
                onClick={() => setViewMode(DashboardViewModeEnum.CALENDAR)}
                className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  viewMode === DashboardViewModeEnum.CALENDAR
                    ? "bg-primary text-on-primary shadow-warm-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Lịch Biểu Timeboxing</span>
              </button>
            </div>
          </div>

          {/* Conditional View: Eisenhower Matrix vs Calendar Grid */}
          {viewMode === DashboardViewModeEnum.EISENHOWER ? (
            <EisenhowerMatrix
              data={eisenhowerData}
              onToggleTaskStatus={handleToggleTaskStatus}
              onMoveToBatching={handleMoveToBatching}
              onOpenCreateModal={(q) => handleOpenGoogleTaskModal({ quadrant: q })}
              includeUnscheduled={includeUnscheduled}
              onToggleIncludeUnscheduled={handleToggleIncludeUnscheduled}
            />
          ) : (
            <CalendarGridView
              tasks={calendarTasks}
              onOpenCreateModal={handleOpenGoogleTaskModal}
              onRangeChange={handleRangeChange}
              onToggleOccurrenceStatus={handleToggleOccurrenceStatus}
              onOverrideOccurrence={handleOverrideOccurrence}
              onCancelOccurrence={handleCancelOccurrence}
              onUpdateSeries={handleUpdateTaskSeries}
              onDeleteSeries={handleDeleteTaskSeries}
            />
          )}

          {/* Bottom Section: Batching Bucket */}
          <div>
            <BatchingBucket
              tasks={batchingTasks}
              onAddBatchTask={(title) =>
                handleAddTask(title, TaskTypeEnum.BATCHING)
              }
              onCompleteBatchingSession={handleCompleteBatchingSession}
            />
          </div>
        </main>

      {/* Google Calendar Styled Task Modal with Eisenhower & Recurrence */}
      <GoogleCalendarTaskModal
        isOpen={isGoogleTaskModalOpen}
        onClose={() => setIsGoogleTaskModalOpen(false)}
        onSaveTask={handleSaveGoogleTask}
        initialDate={googleModalInitialData.date}
        initialStartTime={googleModalInitialData.startTime}
        initialEndTime={googleModalInitialData.endTime}
        initialQuadrant={googleModalInitialData.quadrant}
      />

      {/* Global Fast Capture Modal (Ctrl+K) */}
      <FastCaptureModal
        isOpen={isFastCaptureOpen}
        onClose={() => setIsFastCaptureOpen(false)}
        onAddTask={(title, type, quadrant) => handleAddTask(title, type, quadrant)}
      />

      {/* Rewards Claim Modal */}
      <RewardsModal
        isOpen={isRewardsModalOpen}
        onClose={() => setIsRewardsModalOpen(false)}
        pendingRewards={pendingRewards}
        onClaimReward={handleClaimReward}
      />
    </div>
  );
}
