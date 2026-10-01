"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MascotMood } from "@/types/landing.types";
import { MASCOT_CARD_CONFIG } from "@/constants/landing.constants";

interface GonMiniMascotProps {
  mood?: MascotMood;
  className?: string;
}

/**
 * Compact Smiski-style companion sprite ("Bé Gọn") sitting with a Sage laptop.
 */
export const GonMiniMascot: React.FC<GonMiniMascotProps> = ({
  mood = "locking-in",
  className = "w-10 h-10",
}) => {
  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full text-primary"
      >
        {/* Minimal 4-point star sparkle */}
        <path
          d="M84 16L85.8 21.2L91 23L85.8 24.8L84 30L82.2 24.8L77 23L82.2 21.2L84 16Z"
          fill="currentColor"
          className={mood === "cheering" ? "animate-ping" : "opacity-75"}
        />

        {/* Soft Warm Head */}
        <circle
          cx="50"
          cy="40"
          r="24"
          fill="#F3E6A1"
          stroke="#C8B975"
          strokeWidth="2"
        />

        {/* Minimalist Eyes */}
        {mood === "cheering" ? (
          <>
            <path
              d="M39 39C40.5 36.5 43.5 36.5 45 39"
              stroke="#2D5236"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path
              d="M55 39C56.5 36.5 59.5 36.5 61 39"
              stroke="#2D5236"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </>
        ) : (
          <>
            <circle cx="42" cy="40" r="2.8" fill="#2D5236" />
            <circle cx="58" cy="40" r="2.8" fill="#2D5236" />
          </>
        )}

        {/* Mouth */}
        {mood === "cheering" ? (
          <path
            d="M46 46C47.5 49 52.5 49 54 46"
            stroke="#2D5236"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        ) : mood === "curious" ? (
          <circle cx="50" cy="47" r="2.2" fill="#2D5236" />
        ) : (
          <line
            x1="45"
            y1="47"
            x2="55"
            y2="47"
            stroke="#2D5236"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        )}

        {/* Torso & Arms typing */}
        <path
          d="M36 62C36 57 64 57 64 62L66 80C66 83 34 83 34 80L36 62Z"
          fill="#F3E6A1"
          stroke="#C8B975"
          strokeWidth="2"
        />

        {/* Compact Sage Laptop */}
        <rect
          x="31"
          y="62"
          width="38"
          height="20"
          rx="3"
          fill="#6D9775"
          stroke="#2D5236"
          strokeWidth="2"
        />
        <rect x="45" y="69" width="10" height="6" rx="1.5" fill="#F8F9F6" />
      </svg>
    </div>
  );
};

/**
 * Editorial Illustration Card featuring Bé Gọn (Smiski-style companion) in deep work,
 * combined with warm terracotta, muted sage, and warm sand accents.
 * No macOS window frames, no red-yellow-green traffic lights.
 */
export const GonMascotHeroCard: React.FC = () => {
  const [heroXp, setHeroXp] = useState<number>(MASCOT_CARD_CONFIG.initialXp);
  const [isBoosted, setIsBoosted] = useState<boolean>(false);
  const [completedTask, setCompletedTask] = useState<boolean>(false);

  const handleBoost = () => {
    setHeroXp((xp) => Math.min(MASCOT_CARD_CONFIG.maxXp, xp + 50));
    setCompletedTask(true);
    setIsBoosted(true);
    setTimeout(() => setIsBoosted(false), 1600);
  };

  const progressPercentage = Math.min(
    100,
    Math.round((heroXp / MASCOT_CARD_CONFIG.maxXp) * 100)
  );

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Main Illustration Card Container with moderate rounded corners */}
      <div className="rounded-2xl bg-surface-secondary border border-border dark:border-white/[0.08] p-4 sm:p-5 shadow-lg overflow-hidden transition-all">
        {/* Top Header Strip: Clean Status Bar without window dots */}
        <div className="flex items-center justify-between gap-3 pb-3 mb-3 border-b border-border dark:border-white/[0.08]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-primary">
              BÉ GỌN @DEEP WORK
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Terracotta Accent Pill for Streak */}
            <span className="px-2.5 py-1 rounded-lg bg-[#fbf0ec] dark:bg-[#2a1b18] text-[#c96a52] dark:text-[#e88874] border border-[#f0d5cc] dark:border-[#52332c] text-[10px] font-mono font-bold">
              🔥 14 ngày liên tiếp
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-primary-soft text-primary text-[10px] font-mono font-bold">
              Lv.{MASCOT_CARD_CONFIG.level}
            </span>
          </div>
        </div>

        {/* Central Illustration Area: 3D AI Clay Mascot Bé Gọn with moderate rounded corners */}
        <div className="relative rounded-xl overflow-hidden border border-border dark:border-white/[0.08] bg-[#fbf9f2] dark:bg-[#131915] aspect-[4/3] flex items-center justify-center">
          <Image
            src="/images/gon-mascot-locking-in.jpg"
            alt="Hình minh họa 3D Bé Gọn đang tập trung làm việc cùng chiếc laptop xanh Sage"
            fill
            priority
            className={`object-cover transition-transform duration-500 ${
              isBoosted ? "scale-104" : "hover:scale-101"
            }`}
          />

          {/* Floating Live XP Toast when interacting */}
          {isBoosted && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 px-3.5 py-1.5 rounded-md bg-primary text-on-primary font-mono font-bold text-xs shadow-md animate-bounce">
              ✨ +50 EXP • Bé Gọn đang tập trung cùng bạn!
            </div>
          )}

          {/* Top-left editorial label */}
          <div className="absolute top-3 left-3 z-10">
            <span className="px-2.5 py-1 rounded-md bg-surface/90 backdrop-blur-md border border-border text-[10px] font-mono font-bold text-text-secondary shadow-xs">
              LOCKING IN...
            </span>
          </div>

          {/* Bottom Floating Interactive Card */}
          <div className="absolute bottom-3 inset-x-3 z-20 rounded-xl bg-surface/95 dark:bg-surface/95 backdrop-blur-md border border-border dark:border-white/[0.08] p-3 shadow-md space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label
                onClick={handleBoost}
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={completedTask}
                  onChange={() => {}}
                  className="w-3.5 h-3.5 accent-primary rounded-xs cursor-pointer"
                />
                <span
                  className={`text-xs font-medium ${
                    completedTask
                      ? "line-through text-text-tertiary"
                      : "text-text-primary"
                  }`}
                >
                  Hoàn thành việc trọng tâm hôm nay
                </span>
              </label>

              <button
                type="button"
                onClick={handleBoost}
                className="px-2.5 py-1 rounded-lg bg-primary-soft hover:bg-primary text-primary hover:text-on-primary text-[10px] font-mono font-bold transition-colors cursor-pointer shrink-0"
              >
                {completedTask ? "✓ Đã nhận" : "+50 EXP"}
              </button>
            </div>

            {/* XP Level Progress Bar */}
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 rounded-full bg-surface-tertiary overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <span className="text-[10px] font-mono font-bold text-accent-gold shrink-0">
                {heroXp}/500 XP
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Highlight Badges in Complementary Palette (Sage, Terracotta, Warm Sand) */}
        <div className="mt-3 grid grid-cols-2 gap-2.5 pt-1 text-[11px]">
          <div className="p-2.5 rounded-xl bg-surface border border-border dark:border-white/[0.08] flex items-center gap-2">
            <span className="text-sm">🎯</span>
            <div className="min-w-0">
              <span className="font-bold text-text-primary block truncate">
                Việc trọng tâm
              </span>
              <span className="text-[10px] text-text-tertiary font-mono">
                Khóa giờ 09:00 - 10:30
              </span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#fbf0ec] dark:bg-[#231a18] border border-[#f0d5cc] dark:border-[#422923] flex items-center gap-2">
            <span className="text-sm">🧠</span>
            <div className="min-w-0">
              <span className="font-bold text-[#c96a52] dark:text-[#e88874] block truncate">
                Đúc kết ghi chép
              </span>
              <span className="text-[10px] text-text-tertiary font-mono">
                Nhắc ôn tập tự động
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
