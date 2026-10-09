"use client";

import React, { useState } from "react";
import { GoalFunnel, GoalLevel, Goal } from "@/types/dashboard.types";
import { GoalLevelEnum } from "@/constants/dashboard.enums";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Presence } from "@/components/ui/presence";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn/select";

const NO_PARENT_VALUE = "__none__";
import { FIELD_TRIGGER_CLASS } from "@/constants/picker.constants";
import { cn } from "@/lib/utils";
import {
  Target,
  Trophy,
  Calendar,
  Sun,
  Link2,
  X,
  Plus,
} from "lucide-react";

export interface GoalFunnelBannerProps {
  funnel: GoalFunnel;
  onAddGoal: (title: string, level: GoalLevel, parentGoalId?: string) => Promise<void>;
  onDeleteGoal: (id: string) => Promise<void>;
}

export const GoalFunnelBanner: React.FC<GoalFunnelBannerProps> = ({
  funnel,
  onAddGoal,
  onDeleteGoal,
}) => {
  const [activeLevel, setActiveLevel] = useState<GoalLevel>(GoalLevelEnum.DAILY);
  const [newGoalTitle, setNewGoalTitle] = useState("");
  const [selectedParentId, setSelectedParentId] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);

  const levelConfigs: Record<
    GoalLevel,
    { title: string; badge: string; icon: React.ComponentType<{ className?: string }>; goals: Goal[] }
  > = {
    [GoalLevelEnum.YEARLY]: {
      title: "Mục Tiêu Năm (Yearly Vision)",
      badge: "Tầm nhìn 1 Năm",
      icon: Trophy,
      goals: funnel.yearly,
    },
    [GoalLevelEnum.WEEKLY]: {
      title: "Mục Tiêu Tuần (Weekly Milestones)",
      badge: "Cột mốc Tuần",
      icon: Calendar,
      goals: funnel.weekly,
    },
    [GoalLevelEnum.DAILY]: {
      title: "Mục Tiêu Hôm Nay (Daily Focus)",
      badge: "Tập trung Hôm nay",
      icon: Sun,
      goals: funnel.daily,
    },
  };

  const ActiveIcon = levelConfigs[activeLevel].icon;

  // Possible parent goals based on current active level
  const parentCandidates: Goal[] =
    activeLevel === GoalLevelEnum.DAILY
      ? funnel.weekly
      : activeLevel === GoalLevelEnum.WEEKLY
      ? funnel.yearly
      : [];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalTitle.trim()) return;
    setIsAdding(true);
    try {
      await onAddGoal(
        newGoalTitle.trim(),
        activeLevel,
        selectedParentId ? selectedParentId : undefined
      );
      setNewGoalTitle("");
      setSelectedParentId("");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Card className="w-full space-y-4">
      {/* Funnel Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <div>
          <h2 className="text-2xl font-serif-display font-bold text-text-primary flex items-center gap-2.5 tracking-tight">
            <Target className="w-5 h-5 text-primary stroke-[2]" />
            <span>Phễu Mục Tiêu MAZE AIM</span>
          </h2>
          <p className="text-xs text-text-secondary mt-0.5">
            Dẫn truyền mục tiêu từ Năm &rarr; Tuần &rarr; Hôm nay để mỗi việc làm đều hướng về kết quả lớn
          </p>
        </div>

        {/* Level Switcher Tabs */}
        <div className="flex items-center gap-1 p-1 bg-surface-secondary rounded-xl self-start sm:self-auto">
          {([GoalLevelEnum.DAILY, GoalLevelEnum.WEEKLY, GoalLevelEnum.YEARLY] as GoalLevel[]).map((lvl) => {
            const Icon = levelConfigs[lvl].icon;
            return (
              <button
                key={lvl}
                onClick={() => {
                  setActiveLevel(lvl);
                  setSelectedParentId("");
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  activeLevel === lvl
                    ? "bg-primary text-on-primary shadow-warm-xs"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{lvl}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Goal List for Active Level */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <ActiveIcon className="w-4 h-4 text-primary" />
            <span>{levelConfigs[activeLevel].title}</span>
          </span>
          <Badge variant="primary" className="text-xs font-bold">
            {levelConfigs[activeLevel].goals.length} Mục tiêu
          </Badge>
        </div>

        {/* Goals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {levelConfigs[activeLevel].goals.map((goal, idx) => (
            <div
              key={goal.id}
              className="p-4 rounded-xl bg-surface-secondary/80 shadow-warm-xs border-0 flex items-start justify-between gap-2 group hover:shadow-warm transition-all"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <span className="text-xs font-bold text-primary px-2 py-0.5 rounded-md bg-primary-soft flex-shrink-0">
                  #{idx + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary leading-snug break-words">
                    {goal.title}
                  </p>
                  {goal.description ? (
                    <p className="text-xs text-text-tertiary mt-0.5 truncate">
                      {goal.description}
                    </p>
                  ) : null}
                </div>
              </div>
              <button
                onClick={() => onDeleteGoal(goal.id)}
                className="opacity-0 group-hover:opacity-100 text-xs text-text-tertiary hover:text-red-500 hover:bg-red-500/10 rounded-md transition-all p-1"
                title="Xóa mục tiêu"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}

          {levelConfigs[activeLevel].goals.length === 0 ? (
            <div className="col-span-3 py-6 text-center text-xs text-text-tertiary border border-dashed border-border rounded-xl">
              Chưa có mục tiêu nào ở tầng này. Thêm mục tiêu bên dưới để bắt đầu!
            </div>
          ) : null}
        </div>

        {/* Add Goal Form */}
        <form onSubmit={handleCreate} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1 border-t border-border-subtle">
          <Input
            placeholder={`+ Thêm mục tiêu ${activeLevel} mới...`}
            value={newGoalTitle}
            onChange={(e) => setNewGoalTitle(e.target.value)}
            className="flex-1 text-xs"
          />

          <Presence show={parentCandidates.length > 0} variant="pop">
            {/* Radix Select không nhận value rỗng → dùng giá trị đại diện cho "không chọn" */}
            <Select
              value={selectedParentId || NO_PARENT_VALUE}
              onValueChange={(v) => setSelectedParentId(v === NO_PARENT_VALUE ? "" : v)}
            >
              <SelectTrigger className={cn(FIELD_TRIGGER_CLASS, "h-9 bg-surface text-text-secondary")}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value={NO_PARENT_VALUE} className="text-xs">Thuộc mục tiêu cha (Tùy chọn)</SelectItem>
                {parentCandidates.map((p) => (
                  <SelectItem key={p.id} value={p.id} className="text-xs">
                    {p.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Presence>

          <Button type="submit" size="sm" isLoading={isAdding} disabled={!newGoalTitle.trim()}>
            Thêm
          </Button>
        </form>
      </div>
    </Card>
  );
};
