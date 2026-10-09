"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { LANDING_FAQ_DATA } from "@/constants/landing.constants";

export const FaqAccordion: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>(LANDING_FAQ_DATA[0]?.id ?? null);

  return (
    <div className="space-y-3">
      {LANDING_FAQ_DATA.map((faq) => {
        const isOpen = openId === faq.id;
        const panelId = `${faq.id}-panel`;

        return (
          <div
            key={faq.id}
            className={cn(
              "rounded-xl border bg-surface transition-all duration-300",
              isOpen
                ? "border-primary/30 shadow-warm"
                : "border-border dark:border-white/[0.08] shadow-warm-xs hover:border-primary/20"
            )}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer transition-colors duration-150"
            >
              <span className="text-sm sm:text-base font-semibold text-text-primary">
                {faq.question}
              </span>
              <span
                aria-hidden
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-surface-secondary text-primary text-lg leading-none transition-transform duration-300",
                  isOpen && "rotate-45 bg-primary-soft"
                )}
              >
                +
              </span>
            </button>

            {/* grid-rows trick: animates height from 0 to auto smoothly */}
            <div
              id={panelId}
              role="region"
              className={cn(
                "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-sm text-text-secondary leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
