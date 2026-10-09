"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { usePresence } from "@/hooks/usePresence";
import { TRANSITION_CLASSES, TRANSITION_MS } from "@/constants/transition.constants";

type PresenceVariant = "fade" | "pop" | "collapse";

const VARIANT_CLASS: Record<PresenceVariant, string> = {
  fade: TRANSITION_CLASSES.FADE_SLIDE,
  pop: TRANSITION_CLASSES.POP,
  collapse: TRANSITION_CLASSES.COLLAPSE,
};

export interface PresenceProps extends Omit<React.HTMLAttributes<HTMLElement>, "children"> {
  show: boolean;
  variant?: PresenceVariant;
  as?: "div" | "span" | "section" | "p";
  children: React.ReactNode;
}

/**
 * Giữ children trong DOM tới hết exit transition rồi mới unmount.
 * Dùng cho modal tự quản lý animation (DialogShell): state bên trong reset mỗi lần mở.
 */
export const PresenceMount: React.FC<{ open: boolean; exitMs?: number; children: React.ReactNode }> = ({
  open,
  exitMs = TRANSITION_MS.MODAL,
  children,
}) => {
  const { isMounted } = usePresence(open, exitMs);
  return isMounted ? <>{children}</> : null;
};

/**
 * Thay cho `{show && <X />}`: có enter + exit transition, chỉ unmount sau khi exit chạy xong.
 * `collapse` co giãn chiều cao (dùng cho các phần form ẩn/hiện).
 */
export const Presence: React.FC<PresenceProps> = ({
  show,
  variant = "fade",
  as: Tag = "div",
  className,
  children,
  ...rest
}) => {
  const { isMounted, state } = usePresence(show, TRANSITION_MS.POPOVER);
  if (!isMounted) return null;

  if (variant === "collapse") {
    return (
      <Tag data-state={state} className={VARIANT_CLASS.collapse} {...rest}>
        <div className={cn("min-h-0 overflow-hidden", className)}>{children}</div>
      </Tag>
    );
  }

  return (
    <Tag data-state={state} className={cn(VARIANT_CLASS[variant], className)} {...rest}>
      {children}
    </Tag>
  );
};
