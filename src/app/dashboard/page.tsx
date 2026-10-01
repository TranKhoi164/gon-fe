"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { GamifiedHeaderBar } from "@/components/features/action-dashboard/gamified-header-bar";
import { GoalFunnelBanner } from "@/components/features/action-dashboard/goal-funnel-banner";
import { EisenhowerMatrix } from "@/components/features/action-dashboard/eisenhower-matrix";
import { CalendarGridView } from "@/components/features/action-dashboard/calendar-grid-view";
import { DailyHabitsChecklist } from "@/components/features/action-dashboard/daily-habits-checklist";
import { BatchingBucket } from "@/components/features/action-dashboard/batching-bucket";
import { FastCaptureModal } from "@/components/features/action-dashboard/fast-capture-modal";
import { RewardsModal } from "@/components/features/action-dashboard/rewards-modal";
import { LayoutGrid, Calendar, Sparkles } from "lucide-react";

import { dashboardService } from "@/services/dashboardService";
import {
  UserDashboardStats,
  GoalFunnel,
  GoalLevel,
  EisenhowerMatrixData,
  EisenhowerQuadrant,
  Task,
  DailyHabit,
  TaskType,
  PendingReward,
  ClaimRewardResult,
} from "@/types/dashboard.types";
import {
  INITIAL_USER_STATS_MOCK,
  INITIAL_GOAL_FUNNEL_MOCK,
  INITIAL_EISENHOWER_TASKS_MOCK,
  INITIAL_DAILY_HABITS_MOCK,
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
  const [dailyHabits, setDailyHabits] = useState<DailyHabit[]>(INITIAL_DAILY_HABITS_MOCK);
  const [batchingTasks, setBatchingTasks] = useState<Task[]>(INITIAL_BATCHING_TASKS_MOCK);
  const [pendingRewards, setPendingRewards] = useState<PendingReward[]>(INITIAL_PENDING_REWARDS_MOCK);

  const [viewMode, setViewMode] = useState<DashboardViewModeEnum>(DashboardViewModeEnum.EISENHOWER);
  const [isFastCaptureOpen, setIsFastCaptureOpen] = useState(false);
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
  const [xpToast, setXpToast] = useState<{ message: string } | null>(null);

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

  // Initial Data Fetching
  useEffect(() => {
    let isMounted = true;
    const fetchAllDashboardData = async () => {
      const todayStr = new Date().toISOString().split("T")[0];
      const [
        fetchedStats,
        fetchedFunnel,
        fetchedMatrix,
        fetchedHabits,
        fetchedBatching,
        fetchedRewards,
      ] = await Promise.all([
        dashboardService.getDashboardStats(),
        dashboardService.getGoalFunnel(),
        dashboardService.getEisenhowerTasks(todayStr),
        dashboardService.getDailyHabits(todayStr),
        dashboardService.getBatchingTasks(),
        dashboardService.getPendingRewards(),
      ]);

      if (isMounted) {
        setStats(fetchedStats);
        setFunnel(fetchedFunnel);
        setEisenhowerData(fetchedMatrix);
        setDailyHabits(fetchedHabits);
        setBatchingTasks(fetchedBatching);
        setPendingRewards(fetchedRewards);
      }
    };

    fetchAllDashboardData();
    return () => {
      isMounted = false;
    };
  }, []);

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
  const handleToggleTaskStatus = async (taskId: string, currentStatus: string) => {
    const nextStatus =
      currentStatus === TaskStatusEnum.COMPLETED
        ? TaskStatusEnum.TODO
        : TaskStatusEnum.COMPLETED;

    const result = await dashboardService.completeTask(taskId);

    // Update state matrix
    setEisenhowerData((prev) => {
      const updated = { ...prev };
      (Object.keys(updated) as EisenhowerQuadrant[]).forEach((quadrant) => {
        updated[quadrant] = updated[quadrant].map((t) =>
          t.id === taskId
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

    if (result.xpGained > 0) {
      setStats((prev) => ({
        ...prev,
        xp: result.currentXp || prev.xp + result.xpGained,
        level: result.currentLevel || prev.level,
      }));
      triggerXpToast(`+${result.xpGained} XP - Hoàn thành công việc! Tích lũy kỷ luật.`);
      await refreshStats();
    }
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

  const handleMoveToBatching = (task: Task) => {
    // Remove from Eliminate quadrant
    setEisenhowerData((prev) => ({
      ...prev,
      [EisenhowerQuadrantEnum.ELIMINATE]: prev[EisenhowerQuadrantEnum.ELIMINATE].filter(
        (t) => t.id !== task.id
      ),
    }));
    // Add to Batching tasks
    setBatchingTasks((prev) => [...prev, { ...task, type: TaskTypeEnum.BATCHING }]);
    triggerXpToast("Đã chuyển việc vặt vào Thùng Gom Batching 15p!");
  };

  // 5. Daily Habits Handlers
  const handleToggleHabit = async (id: string) => {
    const todayStr = new Date().toISOString().split("T")[0];
    const result = await dashboardService.toggleHabit(id, todayStr);

    setDailyHabits((prev) =>
      prev.map((h) =>
        h.id === id ? { ...h, isCompletedToday: !h.isCompletedToday } : h
      )
    );

    if (result.isCompletedToday && (result.xpGained ?? 0) > 0) {
      setStats((prev) => ({
        ...prev,
        xp: result.newTotalXp || prev.xp + (result.xpGained || 15),
      }));
      triggerXpToast(`+${result.xpGained || 15} XP - Hoàn thành thói quen kỷ luật!`);
      await refreshStats();
    }
  };

  const handleAddHabit = async (title: string) => {
    const newHabit = await dashboardService.createHabit(title);
    setDailyHabits((prev) => [...prev, newHabit]);
    triggerXpToast("Đã thêm thói quen mới thành công!");
  };

  // 6. Batching Session Handler
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

  // Extract all tasks for calendar grid
  const allCalendarTasks: Task[] = [
    ...eisenhowerData.GOLD_ZONE,
    ...eisenhowerData.DO_FIRST,
    ...eisenhowerData.DELEGATE,
    ...eisenhowerData.ELIMINATE,
  ];

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface p-3.5 rounded-xl shadow-warm border-0">
            <span className="text-xs font-semibold text-text-tertiary uppercase tracking-wider font-serif-display">
              Chế Độ Xem Hành Động
            </span>
            <div className="flex items-center gap-1.5 p-1 bg-surface-secondary rounded-lg">
              <button
                onClick={() => setViewMode(DashboardViewModeEnum.EISENHOWER)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
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
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
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
              onAddTask={(title, q, desc) =>
                handleAddTask(title, TaskTypeEnum.EISENHOWER, q, desc)
              }
              onMoveToBatching={handleMoveToBatching}
            />
          ) : (
            <CalendarGridView tasks={allCalendarTasks} />
          )}

          {/* Bottom Grid: Daily Habits & Batching Bucket */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DailyHabitsChecklist
              habits={dailyHabits}
              onToggleHabit={handleToggleHabit}
              onAddHabit={handleAddHabit}
            />
            <BatchingBucket
              tasks={batchingTasks}
              onAddBatchTask={(title) =>
                handleAddTask(title, TaskTypeEnum.BATCHING)
              }
              onCompleteBatchingSession={handleCompleteBatchingSession}
            />
          </div>
        </main>

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
