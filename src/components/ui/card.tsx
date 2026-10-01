import React from "react";
import { cn } from "@/lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "goldZone" | "secondary";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, variant = "default", ...props }, ref) => {
    const baseStyles =
      "rounded-xl transition-all duration-200 p-5 backdrop-blur-sm";

    const variantStyles = {
      default:
        "bg-surface text-text-primary shadow-warm hover:shadow-warm-lg border-0",
      secondary:
        "bg-surface-secondary text-text-primary shadow-warm-xs border-0",
      goldZone:
        "bg-surface text-text-primary shadow-warm-lg border-0 ring-1 ring-accent-gold/30",
    };

    return (
      <div ref={ref} className={cn(baseStyles, variantStyles[variant], className)} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
