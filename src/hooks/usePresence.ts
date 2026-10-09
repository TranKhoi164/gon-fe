"use client";

import { useEffect, useState } from "react";

/**
 * Giữ component trong DOM thêm `exitMs` sau khi `open` chuyển sang false để chạy xong exit transition.
 * Dùng kèm `data-state={state}` + TRANSITION_CLASSES.
 */
export function usePresence(open: boolean, exitMs: number) {
  const [isMounted, setIsMounted] = useState(open);

  // Mở lại → mount ngay trong lần render này (không chờ effect)
  if (open && !isMounted) setIsMounted(true);

  useEffect(() => {
    if (open || !isMounted) return;
    const timer = setTimeout(() => setIsMounted(false), exitMs);
    return () => clearTimeout(timer);
  }, [open, isMounted, exitMs]);

  return {
    isMounted: open || isMounted,
    state: (open ? "open" : "closed") as "open" | "closed",
  };
}

/**
 * Giữ giá trị khác null gần nhất — để modal/popover vẫn có dữ liệu hiển thị trong lúc chạy exit transition
 * (vd. `selectedTask` bị set về null khi đóng).
 */
export function useRetainedValue<T>(value: T | null | undefined): T | null {
  const [retained, setRetained] = useState<T | null>(value ?? null);
  if (value != null && value !== retained) setRetained(value);
  return value ?? retained;
}
