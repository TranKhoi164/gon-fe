"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";
import { usePresence } from "@/hooks/usePresence";
import { TRANSITION_CLASSES, TRANSITION_MS } from "@/constants/transition.constants";

export interface DialogShellProps {
  open: boolean;
  /** Đóng khi bấm Esc hoặc click backdrop */
  onClose?: () => void;
  /** Class cho khung nội dung (panel) */
  className?: string;
  /** Class cho backdrop (màu nền, padding...) */
  overlayClassName?: string;
  children: React.ReactNode;
}

/**
 * Khung modal dùng chung: backdrop fade + panel fade/zoom cả khi mở lẫn khi đóng.
 * Luôn portal ra document.body: tổ tiên có transform / filter / backdrop-filter (vd. Card backdrop-blur)
 * sẽ biến `position: fixed` thành tương đối với tổ tiên đó → modal bị kẹt trong khung, không phủ màn hình.
 * Children chỉ được mount khi mở (và giữ lại tới hết exit) → state bên trong reset mỗi lần mở.
 */
export const DialogShell: React.FC<DialogShellProps> = ({
  open,
  onClose,
  className,
  overlayClassName,
  children,
}) => {
  const { isMounted, state } = usePresence(open, TRANSITION_MS.MODAL);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !onClose) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      // Popover/Select của Radix mở SAU modal này (nằm phía sau trong DOM) → Esc chỉ đóng lớp đó
      const overlay = overlayRef.current;
      const hasLayerAbove = Array.from(document.querySelectorAll("[data-radix-popper-content-wrapper]")).some(
        (el) => !!overlay && !!(overlay.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING)
      );
      if (!hasLayerAbove) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!isMounted || typeof document === "undefined") return null;

  return createPortal(
    <div
      ref={overlayRef}
      data-state={state}
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs",
        TRANSITION_CLASSES.OVERLAY,
        overlayClassName
      )}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        data-state={state}
        role="dialog"
        aria-modal="true"
        className={cn(
          "w-full rounded-xl bg-surface border border-border shadow-warm-lg text-text-primary",
          TRANSITION_CLASSES.MODAL_PANEL,
          className
        )}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};
