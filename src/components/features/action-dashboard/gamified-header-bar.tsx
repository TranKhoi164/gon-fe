"use client";

import React, { useState } from "react";
import { UserDashboardStats, PendingReward } from "@/types/dashboard.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Award,
  Shield,
  Flame,
  Calendar,
  Sparkles,
  CheckCircle2,
  Zap,
  Gift,
} from "lucide-react";

export interface GamifiedHeaderBarProps {
  stats: UserDashboardStats;
  pendingRewards?: PendingReward[];
  onCheckin: () => Promise<void>;
  onOpenRewards: () => void;
}

export const GamifiedHeaderBar: React.FC<GamifiedHeaderBarProps> = ({
  stats,
  pendingRewards = [],
  onCheckin,
  onOpenRewards,
}) => {
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const handleCheckinClick = async () => {
    if (stats.isStreakActiveToday || isCheckingIn) return;
    setIsCheckingIn(true);
    try {
      await onCheckin();
    } finally {
      setIsCheckingIn(false);
    }
  };

  const progressPercent = Math.min(100, Math.max(0, stats.progressToNextLevel || 0));

  return (
    <div className="w-full p-5 rounded-xl bg-surface shadow-warm border-0 flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-5">
      {/* Left: Level, Tier Title, XP progress bar */}
      <div className="flex-1 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="primary" className="text-xs py-1 px-2.5 font-bold flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" />
              <span>Level {stats.level}</span>
            </Badge>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold bg-amber-500/10 text-amber-700 dark:text-amber-300">
              <Shield className="w-3.5 h-3.5" />
              <span>{stats.tierTitle || "Tập sự kỷ luật"}</span>
            </span>
            <span className="font-extrabold text-sm text-text-primary ml-1">
              {stats.xp.toLocaleString()} XP
            </span>
          </div>

          <div className="flex items-center gap-2 text-text-secondary font-medium">
            <span>Tiến độ cấp:</span>
            <span className="font-bold text-primary">{progressPercent.toFixed(1)}%</span>
          </div>
        </div>

        {/* Solid Progress Bar (minimalist, no gradient) */}
        <div className="w-full h-2 rounded-full bg-surface-secondary overflow-hidden">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Center: Streak Counters */}
      <div className="flex items-center justify-around sm:justify-start gap-4 xl:gap-6 py-3 xl:py-0 xl:px-6">
        {/* Total Streak */}
        <div className="text-center xl:text-left">
          <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider">
            Chuỗi Tổng
          </p>
          <div className="flex items-center justify-center xl:justify-start gap-1.5 mt-0.5">
            <Flame className="w-4 h-4 text-amber-600 dark:text-amber-400 stroke-[2]" />
            <span className="text-base font-black text-amber-600 dark:text-amber-400">
              {stats.streakCount} Ngày
            </span>
          </div>
        </div>

        <div className="h-7 w-px bg-border" />

        {/* Check-in Streak */}
        <div className="text-center xl:text-left">
          <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider">
            Điểm Danh
          </p>
          <div className="flex items-center justify-center xl:justify-start gap-1.5 mt-0.5">
            <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[2]" />
            <span className="text-base font-black text-emerald-600 dark:text-emerald-400">
              {stats.checkinStreak || stats.streakCount} Ngày
            </span>
          </div>
        </div>

        <div className="h-7 w-px bg-border" />

        {/* Perfect Day Streak */}
        <div className="text-center xl:text-left">
          <p className="text-[10px] text-text-tertiary uppercase font-bold tracking-wider">
            Perfect Day
          </p>
          <div className="flex items-center justify-center xl:justify-start gap-1.5 mt-0.5">
            <Sparkles className="w-4 h-4 text-accent-gold stroke-[2]" />
            <span className="text-base font-black text-accent-gold">
              {stats.perfectDayStreak || 0} Ngày
            </span>
          </div>
        </div>
      </div>

      {/* Right: Check-in Action & Rewards Trigger */}
      <div className="flex items-center justify-end gap-2.5">
        {/* Checkin Button */}
        {stats.isStreakActiveToday ? (
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold shadow-xs">
            <CheckCircle2 className="w-3.5 h-3.5 stroke-[2]" />
            <span>Đã Điểm Danh Hôm Nay</span>
          </div>
        ) : (
          <Button
            size="md"
            variant="gold"
            isLoading={isCheckingIn}
            onClick={handleCheckinClick}
            className="shadow-warm-xs font-bold flex items-center gap-1.5"
          >
            <Zap className="w-3.5 h-3.5 stroke-[2]" />
            <span>Điểm Danh Ngày (+10 XP)</span>
          </Button>
        )}

        {/* Rewards Bag Button */}
        <button
          onClick={onOpenRewards}
          className="relative p-2.5 rounded-xl bg-surface-secondary border border-border-subtle text-text-primary hover:bg-surface hover:border-accent-gold/50 transition-all flex items-center gap-1.5 text-xs font-bold"
          title="Xem kho phần thưởng"
        >
          <Gift className="w-4 h-4 stroke-[1.8]" />
          <span className="hidden sm:inline">Phần Thưởng</span>
          {pendingRewards.length > 0 ? (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center shadow-warm-xs">
              {pendingRewards.length}
            </span>
          ) : null}
        </button>
      </div>
    </div>
  );
};

