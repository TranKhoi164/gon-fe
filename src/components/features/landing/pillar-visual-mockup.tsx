"use client";

import React from "react";
import { GonMiniMascot } from "./gon-mascot-card";

interface PillarVisualMockupProps {
  visualType: "maze-funnel" | "feynman-brain" | "gamified-xp";
}

export const PillarVisualMockup: React.FC<PillarVisualMockupProps> = ({
  visualType,
}) => {
  if (visualType === "maze-funnel") {
    return (
      <div className="rounded-xl bg-surface-secondary border border-border dark:border-white/[0.08] shadow-sm overflow-hidden">
        {/* Window Top Strip */}
        <div className="px-4 py-2.5 bg-surface-tertiary/70 border-b border-border dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-secondary">
              🎯 QUẢN LÝ MỤC TIÊU & VIỆC TRỌNG TÂM
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-primary-soft text-primary text-[10px] font-mono font-bold">
            NĂM → TUẦN → NGÀY
          </span>
        </div>

        <div className="p-5 space-y-3 bg-surface">
          {/* Goal Tiers */}
          <div className="space-y-2">
            <div className="p-3 rounded-lg bg-surface-secondary border border-border dark:border-white/[0.08] flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary">
                🔭 Mục tiêu lớn trong Năm
              </span>
              <span className="text-[11px] font-mono font-bold text-primary bg-primary-soft px-2 py-0.5 rounded">
                Đang theo dõi
              </span>
            </div>
            <div className="mx-2 p-3 rounded-lg bg-surface-secondary border border-border dark:border-white/[0.08] flex items-center justify-between">
              <span className="text-xs font-semibold text-text-secondary">
                🗓️ Mục tiêu Trọng tâm Tuần
              </span>
              <span className="text-[11px] font-mono font-bold text-primary bg-primary-soft px-2 py-0.5 rounded">
                Đúng tiến độ
              </span>
            </div>
            <div className="mx-4 p-3.5 rounded-lg bg-butter-surface border border-butter-border dark:border-white/[0.08] border-l-2 border-l-accent-gold space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-primary">
                  ⭐ Việc Quan Trọng Hôm Nay
                </span>
                <span className="px-1.5 py-0.5 rounded bg-accent-gold-soft text-accent-gold text-[10px] font-mono font-bold">
                  +50% EXP
                </span>
              </div>
              <div className="text-xs text-text-secondary flex items-center justify-between bg-surface px-2.5 py-1.5 rounded border border-border-subtle">
                <span>✓ Hoàn thiện bản thiết kế sản phẩm</span>
                <span className="font-mono text-[11px] text-primary font-bold">
                  09:00 – 11:00
                </span>
              </div>
            </div>
          </div>

          {/* Batching Bucket Footer */}
          <div className="p-3 rounded-lg bg-surface-secondary border border-border dark:border-white/[0.08] flex items-center justify-between text-xs">
            <span className="font-medium text-text-secondary">
              🧺 Giỏ gom việc vặt (Mail, hóa đơn, tin nhắn...)
            </span>
            <span className="px-2 py-0.5 rounded bg-surface border border-border-subtle text-text-primary font-mono font-bold text-[10px]">
              Xử lý gọn 16:30 (15p)
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (visualType === "feynman-brain") {
    return (
      <div className="rounded-xl bg-surface-secondary border border-border dark:border-white/[0.08] shadow-sm overflow-hidden">
        {/* Window Top Strip */}
        <div className="px-4 py-2.5 bg-surface-tertiary/70 border-b border-border dark:border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-secondary">
              🧠 GHI CHÉP DỄ HIỂU & CHUYỂN THÀNH VIỆC LÀM
            </span>
          </div>
          <span className="px-2 py-0.5 rounded bg-surface border border-border dark:border-white/[0.08] text-[10px] font-mono font-bold text-primary">
            🔁 Tự nhắc ôn: Ngày thứ 3
          </span>
        </div>

        <div className="p-5 space-y-3.5 bg-surface">
          {/* Note Card */}
          <div className="rounded-lg bg-surface-secondary border border-border dark:border-white/[0.08] p-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="px-2 py-0.5 rounded bg-primary-soft text-primary text-[10px] font-mono font-bold">
                Chủ đề: Kỹ năng Quản lý Thời gian
              </span>
              <GonMiniMascot mood="curious" className="w-7 h-7" />
            </div>
            <p className="text-sm font-bold text-text-primary">
              Tại sao càng cho nhiều thời gian, việc càng lâu xong?
            </p>
            <p className="text-xs text-text-secondary leading-relaxed bg-butter-surface p-3 rounded-lg border border-butter-border dark:border-white/[0.08]">
              💡 <strong>Hiểu đơn giản bằng lời của mình:</strong> Công việc luôn tự
              phình to ra để lấp đầy thời gian bạn dành cho nó. Nếu khóa lịch đúng 90
              phút, bạn sẽ tập trung cao độ và làm xong gọn trong 90 phút.
            </p>
          </div>

          {/* Action Bridge */}
          <div className="rounded-lg bg-surface-secondary border border-primary/40 p-3.5 flex items-center justify-between gap-3">
            <div className="text-xs">
              <span className="font-mono font-bold text-primary block text-[11px]">
                ⚡ VIỆC ÁP DỤNG NGAY HÔM NAY:
              </span>
              <span className="text-text-primary font-medium">
                Khóa lịch 45 phút chiều nay để làm xong bài thuyết trình
              </span>
            </div>
            <span className="px-2.5 py-1 rounded-md bg-primary text-on-primary font-mono font-bold text-[10px] shrink-0">
              Đã đưa vào Việc Ngày ✓
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-surface-secondary border border-border dark:border-white/[0.08] shadow-sm overflow-hidden">
      {/* Window Top Strip */}
      <div className="px-4 py-2.5 bg-surface-tertiary/70 border-b border-border dark:border-white/[0.08] flex items-center justify-between">
        <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-text-secondary">
          🏆 TIẾN ĐỘ PHÁT TRIỂN & QUÀ TỰ THƯỞNG
        </span>
        <span className="px-2 py-0.5 rounded bg-accent-gold-soft border border-accent-gold/30 text-accent-gold text-[10px] font-mono font-bold">
          🔥 21 Ngày Liên Tiếp
        </span>
      </div>

      <div className="p-5 space-y-3.5 bg-surface">
        {/* XP Bar */}
        <div className="rounded-lg bg-surface-secondary border border-border dark:border-white/[0.08] p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GonMiniMascot mood="cheering" className="w-8 h-8" />
              <div>
                <span className="text-xs font-bold text-text-primary block">
                  Cấp độ 7 • Người Giữ Kỷ Luật
                </span>
                <span className="text-[10px] font-mono text-text-tertiary">
                  Thưởng hoàn thành việc trọng tâm: +50% EXP
                </span>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-primary">
              1,450 / 1,600 EXP
            </span>
          </div>
          <div className="w-full h-1.5 rounded-sm bg-surface-tertiary overflow-hidden">
            <div className="w-[88%] h-full bg-primary" />
          </div>
        </div>

        {/* Real-life Custom Rewards Vault */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-butter-surface border border-butter-border dark:border-white/[0.08] p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm">🍵</span>
              <span className="px-1.5 py-0.5 rounded bg-primary text-on-primary text-[10px] font-mono font-bold">
                ĐỦ ĐIỂM NHẬN QUÀ
              </span>
            </div>
            <p className="text-xs font-bold text-text-primary pt-1">
              Tự thưởng 1 Ly Matcha
            </p>
            <p className="text-[10px] font-mono text-text-tertiary">Mốc đổi: 500 EXP</p>
          </div>

          <div className="rounded-lg bg-surface-secondary border border-border dark:border-white/[0.08] p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm">📖</span>
              <span className="px-1.5 py-0.5 rounded bg-surface border border-border-subtle text-text-secondary text-[10px] font-mono font-bold">
                CÒN 150 EXP
              </span>
            </div>
            <p className="text-xs font-bold text-text-primary pt-1">
              Mua 1 Cuốn Sách Mới
            </p>
            <p className="text-[10px] font-mono text-text-tertiary">Mốc đổi: 1,600 EXP</p>
          </div>
        </div>
      </div>
    </div>
  );
};
