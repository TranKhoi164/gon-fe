"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { DialogShell } from "@/components/ui/dialog-shell";

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
  return (
    <DialogShell
      open={isOpen}
      onClose={onClose}
      overlayClassName="bg-slate-950/60 backdrop-blur-sm"
      className={cn("max-w-lg shadow-2xl overflow-hidden p-6", className)}
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
            className="p-1.5 rounded-full text-text-tertiary hover:text-text-primary hover:bg-surface-secondary transition-colors duration-150"
            aria-label="Đóng cửa sổ"
          >
            ✕
          </button>
        </div>
      ) : null}
      <div>{children}</div>
    </DialogShell>
  );
};
