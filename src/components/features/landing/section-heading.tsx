import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  align = "left",
  className,
}) => (
  <div
    className={cn(
      "max-w-2xl space-y-2.5",
      align === "center" && "mx-auto text-center",
      className
    )}
  >
    <span
      className={cn(
        "inline-flex items-center gap-2 text-xs font-mono text-primary font-bold uppercase tracking-[0.14em]",
        align === "center" && "justify-center"
      )}
    >
      <span className="h-px w-6 bg-primary/50" />
      {eyebrow}
    </span>
    <h2 className="text-2xl sm:text-4xl font-serif-display font-bold text-text-primary tracking-tight leading-tight">
      {title}
    </h2>
    {subtitle && (
      <p className="text-sm sm:text-base text-text-secondary leading-relaxed">
        {subtitle}
      </p>
    )}
  </div>
);
