import React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "gold" | "emerald" | "amber" | "slate" | "red";
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  children,
  variant = "primary",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-md transition-colors border";

  const variantStyles = {
    primary:
      "bg-primary-soft text-primary border-primary/20",
    gold:
      "bg-accent-gold-soft text-amber-900 dark:text-amber-300 border-accent-gold/40 font-bold",
    emerald:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
    amber:
      "bg-amber-500/10 text-amber-800 dark:text-amber-400 border-amber-500/20",
    slate:
      "bg-surface-tertiary text-text-secondary border-border",
    red:
      "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
  };

  return (
    <span className={cn(baseStyles, variantStyles[variant], className)} {...props}>
      {children}
    </span>
  );
};
