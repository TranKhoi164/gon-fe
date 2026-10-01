"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  PLAYGROUND_INITIAL_TASKS,
  FEYNMAN_PRESETS_DATA,
  PLAYGROUND_CONFIG,
} from "@/constants/landing.constants";
import { ROUTES } from "@/constants/routes.constants";
import { PlaygroundDemoTask, MascotMood } from "@/types/landing.types";
import { GonMiniMascot } from "./gon-mascot-card";

export const InteractivePlayground: React.FC = () => {
  const [tasks, setTasks] = useState<PlaygroundDemoTask[]>(PLAYGROUND_INITIAL_TASKS);
  const [xp, setXp] = useState<number>(PLAYGROUND_CONFIG.initialXp);
  const [selectedPresetId, setSelectedPresetId] = useState<string>(
    FEYNMAN_PRESETS_DATA[0].id
  );
  const [customConcept, setCustomConcept] = useState<string>("");
  const [isFeynmanized, setIsFeynmanized] = useState<boolean>(true);
  const [floatingXpMsg, setFloatingXpMsg] = useState<string | null>(null);
  const [mascotMood, setMascotMood] = useState<MascotMood>("locking-in");
  const [pushedActionIds, setPushedActionIds] = useState<string[]>([]);

  const activePreset =
    FEYNMAN_PRESETS_DATA.find((p) => p.id === selectedPresetId) ||
    FEYNMAN_PRESETS_DATA[0];

  const level = xp >= PLAYGROUND_CONFIG.levelTwoThresholdXp ? 2 : 1;
  const levelProgress =
    level === 1
      ? Math.min(
          100,
          Math.round((xp / PLAYGROUND_CONFIG.levelTwoThresholdXp) * 100)
        )
      : Math.min(
          100,
          Math.round(
            ((xp - PLAYGROUND_CONFIG.levelTwoThresholdXp) /
              PLAYGROUND_CONFIG.levelTwoSpanXp) *
              100
          )
        );

  const triggerCelebration = (message: string) => {
    setFloatingXpMsg(message);
    setMascotMood("cheering");
    setTimeout(() => {
      setFloatingXpMsg(null);
      setMascotMood("locking-in");
    }, PLAYGROUND_CONFIG.celebrationDurationMs);
  };

  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextCompleted = !t.completed;
        if (nextCompleted) {
          setXp((curr) => curr + t.xpReward);
          triggerCelebration(
            `+${t.xpReward} EXP • ${
              t.isGoldZone ? "Thưởng x1.5 Việc Trọng Tâm!" : "Hoàn thành!"
            }`
          );
        } else {
          setXp((curr) => Math.max(0, curr - t.xpReward));
        }
        return { ...t, completed: nextCompleted };
      })
    );
  };

  const handleFeynmanize = (e: React.FormEvent) => {
    e.preventDefault();
    setIsFeynmanized(true);
    setXp((curr) => curr + PLAYGROUND_CONFIG.feynmanizeBonusXp);
    triggerCelebration(
      `+${PLAYGROUND_CONFIG.feynmanizeBonusXp} EXP • Đã đúc kết ý chính!`
    );
  };

  const handlePushActionToTasks = () => {
    const actionKey = customConcept.trim() || activePreset.id;
    if (pushedActionIds.includes(actionKey)) return;

    const newActionTitle = customConcept.trim()
      ? `Áp dụng thực tế "${customConcept.trim()}" trong 25 phút hôm nay`
      : activePreset.extractedAction;

    const newTask: PlaygroundDemoTask = {
      id: `feynman-action-${actionKey}`,
      title: newActionTitle,
      tag: "🧠 TỪ GHI CHÉP HÔM NAY (+50% EXP)",
      xpReward: activePreset.xpBonus,
      isGoldZone: true,
      completed: false,
    };

    setTasks((prev) => [newTask, ...prev]);
    setPushedActionIds((prev) => [...prev, actionKey]);
    setXp((curr) => curr + PLAYGROUND_CONFIG.pushActionBonusXp);
    triggerCelebration("⚡ Đã thêm vào danh sách Việc Trọng Tâm hôm nay!");
  };

  return (
    <div className="rounded-2xl bg-surface-secondary border border-border dark:border-white/[0.08] overflow-hidden shadow-md">
      {/* Clean Status Strip with Bé Gọn Mascot (No macOS window traffic dots) */}
      <div className="px-4 py-2.5 bg-surface-secondary border-b border-border dark:border-white/[0.08] flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[11px] font-mono font-bold text-text-secondary uppercase tracking-wider">
            KHÔNG GIAN TRẢI NGHIỆM TRỰC TIẾP
          </span>
        </div>

        <div className="flex items-center gap-2">
          <GonMiniMascot mood={mascotMood} className="w-6 h-6" />
          <span className="text-[11px] font-mono text-primary font-bold">
            BÉ GỌN ĐỒNG HÀNH
          </span>
        </div>
      </div>

      <div className="p-6 sm:p-8 bg-surface">
        {/* Top Status Header & Live XP Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-6 border-b border-border dark:border-white/[0.08]">
          <div>
            <span className="inline-block px-2 py-0.5 rounded bg-primary-soft text-primary text-[11px] font-mono font-bold uppercase mb-1.5">
              Dùng thử ngay trên trang
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-text-primary tracking-tight">
              Trải nghiệm luồng &ldquo;Hiểu sâu → Chọn việc quan trọng → Nhận thưởng&rdquo;
            </h3>
            <p className="text-xs sm:text-sm text-text-secondary mt-0.5">
              Tóm gọn kiến thức ở cột trái, chuyển thành đầu việc ở cột phải và bấm hoàn thành để nhận điểm thưởng.
            </p>
          </div>

          {/* Live Gamified Meter */}
          <div className="rounded-lg bg-surface-secondary border border-border dark:border-white/[0.08] p-3.5 min-w-[250px] relative">
            {floatingXpMsg && (
              <div className="absolute -top-8 right-2 px-2.5 py-1 rounded-md bg-primary text-on-primary text-[11px] font-mono font-bold shadow-sm whitespace-nowrap z-20">
                {floatingXpMsg}
              </div>
            )}
            <div className="flex items-center justify-between text-xs font-mono font-bold mb-1.5">
              <span className="text-primary">
                ⭐ Lv.{level} • {level >= 2 ? "Người Kỷ Luật" : "Tập Sự Gọn"}
              </span>
              <span className="text-accent-gold">{xp} EXP</span>
            </div>
            <div className="w-full h-1.5 rounded-sm bg-surface-tertiary overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-text-tertiary">
              <span>🔥 Chuỗi duy trì: {PLAYGROUND_CONFIG.streakDays} ngày</span>
              <span>
                {level >= 2
                  ? "🎁 Đủ điểm: Tự thưởng 1 ly Matcha!"
                  : `Còn ${Math.max(
                      0,
                      PLAYGROUND_CONFIG.levelTwoThresholdXp - xp
                    )} EXP lên Lv.2`}
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Closed Loop Interactive Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Column 1: Note Simplifier -> Action Extractor */}
          <div className="rounded-lg bg-surface-secondary border border-border dark:border-white/[0.08] p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2 py-0.5 rounded bg-primary-soft text-primary text-[11px] font-mono font-bold">
                  BƯỚC 01 • HIỂU BẢN CHẤT
                </span>
                <span className="text-[11px] font-mono text-text-tertiary">
                  Ghi chép → Việc làm
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-text-primary mb-2.5">
                Chọn hoặc nhập 1 chủ đề bạn muốn áp dụng hôm nay:
              </h4>

              {/* Preset Pills */}
              <div className="flex flex-wrap gap-1.5 mb-3.5">
                {FEYNMAN_PRESETS_DATA.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setSelectedPresetId(preset.id);
                      setCustomConcept("");
                      setIsFeynmanized(true);
                    }}
                    className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer border ${
                      selectedPresetId === preset.id && !customConcept
                        ? "bg-primary text-on-primary border-primary"
                        : "bg-surface text-text-secondary border-border dark:border-white/[0.08] hover:border-primary/50"
                    }`}
                  >
                    {preset.concept}
                  </button>
                ))}
              </div>

              {/* Custom Concept Input */}
              <form onSubmit={handleFeynmanize} className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={customConcept}
                  onChange={(e) => setCustomConcept(e.target.value)}
                  placeholder="Hoặc tự nhập kỹ năng bạn đang học..."
                  className="flex-1 px-3 py-2 rounded-md bg-surface border border-border dark:border-white/[0.08] text-xs sm:text-sm text-text-primary focus:outline-none focus:border-primary"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-md bg-primary hover:bg-primary-hover text-on-primary text-xs font-bold transition-colors shrink-0 cursor-pointer"
                >
                  ✨ Tóm gọn ý chính
                </button>
              </form>

              {/* Output Card */}
              {isFeynmanized && (
                <div className="rounded-lg bg-butter-surface border border-butter-border dark:border-white/[0.08] p-3.5 space-y-3">
                  <div>
                    <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-tertiary">
                      💬 Đúc kết ngắn gọn, dễ nhớ:
                    </p>
                    <p className="text-xs sm:text-sm text-text-primary font-medium mt-1 leading-relaxed">
                      {customConcept.trim()
                        ? `"${customConcept.trim()}" hiểu đơn giản là: Tách nhỏ vấn đề phức tạp thành 1 thói quen 25 phút có thể thực hành ngay hôm nay để tạo kết quả đo lường được.`
                        : activePreset.simplifiedExplanation}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-butter-border dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold text-primary block">
                        🎯 VIỆC CỤ THỂ ĐỂ ÁP DỤNG NGAY:
                      </span>
                      <span className="text-xs text-text-secondary font-medium">
                        {customConcept.trim()
                          ? `Áp dụng thực tế "${customConcept.trim()}" trong 25 phút hôm nay`
                          : activePreset.extractedAction}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handlePushActionToTasks}
                      disabled={pushedActionIds.includes(
                        customConcept.trim() || activePreset.id
                      )}
                      className="px-3 py-1.5 rounded-md bg-surface hover:bg-primary text-text-primary hover:text-on-primary text-xs font-mono font-bold border border-border dark:border-white/[0.08] transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                    >
                      {pushedActionIds.includes(
                        customConcept.trim() || activePreset.id
                      )
                        ? "✓ Đã thêm vào Việc Hôm Nay"
                        : "➕ Đưa vào Việc Hôm Nay →"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Column 2: Priority Task List & Instant XP Reward */}
          <div className="rounded-lg bg-surface-secondary border border-border dark:border-white/[0.08] p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2 py-0.5 rounded bg-accent-gold-soft text-accent-gold text-[11px] font-mono font-bold border border-accent-gold/30">
                  BƯỚC 02 • HOÀN THÀNH VIỆC TRỌNG TÂM (+50% EXP)
                </span>
                <span className="text-[11px] font-mono text-text-tertiary">
                  Nhấp để hoàn thành
                </span>
              </div>

              <h4 className="text-sm sm:text-base font-bold text-text-primary mb-2.5">
                Danh Sách Việc Quan Trọng Hôm Nay:
              </h4>

              <div className="space-y-2">
                {tasks.map((task) => (
                  <label
                    key={task.id}
                    onClick={() => handleToggleTask(task.id)}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-colors cursor-pointer select-none ${
                      task.completed
                        ? "bg-surface/60 border-border-subtle opacity-65"
                        : task.isGoldZone
                        ? "bg-butter-surface border-butter-border dark:border-white/[0.08] hover:border-primary"
                        : "bg-surface border-border dark:border-white/[0.08] hover:border-primary"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => {}}
                      className="mt-0.5 w-3.5 h-3.5 accent-primary rounded-xs cursor-pointer"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs sm:text-sm font-medium ${
                          task.completed
                            ? "line-through text-text-tertiary"
                            : "text-text-primary"
                        }`}
                      >
                        {task.title}
                      </p>
                      <span className="text-[10px] font-mono text-text-tertiary block mt-0.5">
                        {task.tag}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${
                        task.completed
                          ? "bg-primary text-on-primary"
                          : "bg-accent-gold-soft text-accent-gold border border-accent-gold/25"
                      }`}
                    >
                      +{task.xpReward}XP
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Endowed Progress Conversion Prompt */}
            <div className="mt-5 pt-3.5 border-t border-border dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-xs text-text-secondary">
                Đã tích lũy <strong className="text-accent-gold font-mono">{xp} EXP</strong>{" "}
                (Lv.{level}). Lưu lại tiến độ này để tiếp tục:
              </div>
              <Link
                href={ROUTES.REGISTER}
                className="px-3.5 py-2 rounded-md bg-primary hover:bg-primary-hover text-on-primary text-xs font-bold text-center transition-colors shrink-0"
              >
                Lưu tiến độ Lv.{level} →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
