import React from "react";
import { Reveal } from "@/components/features/landing/reveal";
import { SectionHeading } from "@/components/features/landing/section-heading";
import { COMPARISON_ROWS_DATA, LANDING_SECTIONS_COPY } from "@/constants/landing.constants";

export const ComparisonSection: React.FC = () => {
  const copy = LANDING_SECTIONS_COPY.comparison;

  return (
    <section id="comparison" className="scroll-mt-16 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <Reveal>
          <SectionHeading eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} />
        </Reveal>

        <Reveal delay={120}>
          <div className="overflow-x-auto rounded-2xl border border-border dark:border-white/[0.08] bg-surface shadow-warm">
            <table className="w-full text-left border-collapse min-w-[640px]">
              <thead>
                <tr className="border-b border-border dark:border-white/[0.08] bg-surface-secondary text-[11px] font-mono uppercase tracking-wider text-text-tertiary">
                  <th className="py-4 px-5 font-bold text-text-primary">{copy.criteriaLabel}</th>
                  <th className="py-4 px-5 font-semibold">{copy.notionObsidianLabel}</th>
                  <th className="py-4 px-5 font-semibold">{copy.todoistTickTickLabel}</th>
                  <th className="py-4 px-5 font-bold text-primary bg-butter-surface border-l-2 border-primary/30">
                    {copy.gonLabel}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border dark:divide-white/[0.08] text-xs sm:text-sm">
                {COMPARISON_ROWS_DATA.map((row) => (
                  <tr
                    key={row.feature}
                    className="group transition-colors duration-300 hover:bg-surface-secondary/50"
                  >
                    <td className="py-4 px-5 font-semibold text-text-primary">{row.feature}</td>
                    <td className="py-4 px-5 text-text-tertiary">{row.notionObsidian}</td>
                    <td className="py-4 px-5 text-text-tertiary">{row.todoistTickTick}</td>
                    <td className="py-4 px-5 font-bold text-primary bg-butter-surface/70 border-l-2 border-primary/30 transition-colors duration-300 group-hover:bg-primary-soft">
                      {row.gonApp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
