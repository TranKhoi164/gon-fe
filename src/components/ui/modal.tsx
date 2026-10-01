"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="fixed inset-0 -z-10"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "w-full max-w-lg bg-surface border border-border rounded-xl shadow-2xl overflow-hidden p-6 text-text-primary animate-in zoom-in-95 duration-150",
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {title ? (
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-text-primary">{title}</h2>
              {description ? (
                <p className="text-xs text-text-secondary mt-0.5">{description}</p>
              ) : null}
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors"
              aria-label="Đóng cửa sổ"
            >
              ✕
            </button>
          </div>
        ) : null}
        <div>{children}</div>
      </div>
    </div>
  );
};
