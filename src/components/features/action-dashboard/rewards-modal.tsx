"use client";

import React, { useState } from "react";
import { PendingReward, ClaimRewardResult } from "@/types/dashboard.types";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingRewards: PendingReward[];
  onClaimReward: (id: string) => Promise<ClaimRewardResult | null>;
}

export const RewardsModal: React.FC<RewardsModalProps> = ({
  isOpen,
  onClose,
  pendingRewards,
  onClaimReward,
}) => {
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [claimedResult, setClaimedResult] = useState<ClaimRewardResult | null>(null);

  const handleClaim = async (id: string) => {
    setClaimingId(id);
    try {
      const res = await onClaimReward(id);
      if (res) {
        setClaimedResult(res);
      }
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setClaimedResult(null);
        onClose();
      }}
      title="🎁 Kho Quà & Phần Thưởng Kỷ Luật"
      description="Nhận điểm kinh nghiệm (XP) cho các cột mốc chuỗi và ngày hoàn hảo"
    >
      <div className="space-y-4">
        {/* Celebration Banner when just claimed */}
        {claimedResult ? (
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/20 via-primary/20 to-emerald-500/20 border border-accent-gold text-center space-y-1.5 animate-in zoom-in-95 duration-200">
            <span className="text-3xl">🎉</span>
            <h4 className="text-base font-black text-amber-500">
              Nhận Thưởng Thành Công!
            </h4>
            <p className="text-xs text-text-primary">
              Bạn vừa nhận được{" "}
              <span className="font-bold text-accent-gold">
                +{claimedResult.claimedXp} XP
              </span>
              . Cấp độ hiện tại:{" "}
              <span className="font-bold text-primary">
                Level {claimedResult.newLevel} ({claimedResult.tierTitle})
              </span>
            </p>
          </div>
        ) : null}

        {/* Pending Rewards List */}
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {pendingRewards.map((reward) => {
            const isClaiming = claimingId === reward.id;

            return (
              <div
                key={reward.id}
                className="p-3.5 rounded-xl border border-border bg-surface-secondary/70 flex items-center justify-between gap-3 hover:border-accent-gold/50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center text-xl">
                    🏆
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-text-primary">
                      {reward.actionType === "CHECKIN_STREAK"
                        ? "Thưởng Chuỗi Điểm Danh Liên Tục"
                        : reward.actionType === "PERFECT_DAY"
                        ? "Thưởng Ngày Hoàn Hảo (Perfect Day)"
                        : "Thưởng Cột Mốc Kỷ Luật"}
                    </h5>
                    <p className="text-[11px] text-text-tertiary">
                      Ngày: {reward.claimDate} • Trạng thái: Sẵn sàng nhận
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="gold" className="text-xs font-bold">
                    +{reward.rewardXp} XP
                  </Badge>
                  <Button
                    size="sm"
                    variant="gold"
                    isLoading={isClaiming}
                    onClick={() => handleClaim(reward.id)}
                  >
                    Nhận ngay
                  </Button>
                </div>
              </div>
            );
          })}

          {pendingRewards.length === 0 ? (
            <div className="py-8 text-center text-xs text-text-tertiary border border-dashed border-border rounded-xl space-y-1">
              <span className="text-2xl block">✨</span>
              <p className="font-semibold text-text-secondary">
                Không có phần thưởng nào đang chờ
              </p>
              <p>Hãy hoàn thành mục tiêu ngày và duy trì Streak để mở khóa thêm quà!</p>
            </div>
          ) : null}
        </div>

        <div className="flex justify-end pt-2 border-t border-border">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setClaimedResult(null);
              onClose();
            }}
          >
            Đóng
          </Button>
        </div>
      </div>
    </Modal>
  );
};
