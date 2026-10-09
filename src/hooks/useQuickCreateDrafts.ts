"use client";

import { useCallback, useRef, useState } from "react";
import { EisenhowerQuadrant } from "@/types/dashboard.types";
import { QuickCreateDraft, QuickCreateSlot } from "@/types/calendar-quick-create.types";
import { createInitialDraft } from "@/utils/quickCreateTask";

export interface LocalTaskDraft {
  key: number;
  draft: QuickCreateDraft;
}

/**
 * Quản lý draft tạo nhanh trên lịch:
 * - Click vào ô lịch → draft được thêm vào state ngay lập tức để hiển thị trên lịch.
 * - Draft chỉ được lưu DB khi người dùng bấm Lưu; đóng popover (hoặc mở ô khác) thì draft bị gỡ.
 */
export function useQuickCreateDrafts() {
  const [activeSlot, setActiveSlot] = useState<(QuickCreateSlot & { key: number }) | null>(null);
  const [drafts, setDrafts] = useState<LocalTaskDraft[]>([]);
  const activeKeyRef = useRef<number | null>(null);

  const open = useCallback((slot: QuickCreateSlot, quadrant?: EisenhowerQuadrant) => {
    const prevKey = activeKeyRef.current;
    const key = Date.now();
    activeKeyRef.current = key;
    setDrafts((prev) => [
      ...prev.filter((d) => d.key !== prevKey),
      { key, draft: createInitialDraft(slot, quadrant) },
    ]);
    setActiveSlot({ ...slot, key });
  }, []);

  /** Đóng popover và gỡ sự kiện nháp khỏi lịch */
  const close = useCallback(() => {
    const key = activeKeyRef.current;
    activeKeyRef.current = null;
    setActiveSlot(null);
    if (key !== null) setDrafts((prev) => prev.filter((d) => d.key !== key));
  }, []);

  const updateDraft = useCallback((key: number, draft: QuickCreateDraft) => {
    setDrafts((prev) => prev.map((d) => (d.key === key ? { ...d, draft } : d)));
  }, []);

  const activeDraft = activeSlot ? drafts.find((d) => d.key === activeSlot.key) ?? null : null;

  return {
    activeSlot,
    activeDraft,
    drafts,
    open,
    close,
    updateDraft,
  };
}
