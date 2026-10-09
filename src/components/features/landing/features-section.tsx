import React from "react";
import { Reveal } from "@/components/features/landing/reveal";
import { SectionHeading } from "@/components/features/landing/section-heading";
import {
  CORE_FEATURES_BENTO,
  LANDING_SECTIONS_COPY,
  LANDING_REVEAL_STAGGER_MS,
} from "@/constants/landing.constants";

export const FeaturesSection: React.FC = () => {
  const copy = LANDING_SECTIONS_COPY.features;

  return (
    <section
      id="features"
      className="scroll-mt-16 py-20 lg:py-28 bg-surface-secondary/40 border-y border-border dark:border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <Reveal>
          <SectionHeading eyebrow={copy.eyebrow} title={copy.title} subtitle={copy.subtitle} />
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {CORE_FEATURES_BENTO.map((item, idx) => (
            <Reveal key={item.id} delay={idx * LANDING_REVEAL_STAGGER_MS} className="h-full">
              <article className="group relative h-full overflow-hidden rounded-2xl bg-surface border border-border dark:border-white/[0.08] p-6 lg:p-7 flex flex-col justify-between shadow-warm-sm transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-warm-lg hover:border-primary/30">
                {/* Accent line revealed on hover */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-gradient-to-r from-primary to-accent-gold transition-transform duration-500 group-hover:scale-x-100"
                />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-soft text-xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6">
                      {item.icon}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-surface-secondary text-[11px] font-mono font-medium text-text-tertiary">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-text-primary leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-sm text-text-secondary leading-relaxed">{item.desc}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-6 pt-4 border-t border-border dark:border-white/[0.08]">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-lg bg-surface-secondary text-[10px] font-mono text-text-secondary transition-colors duration-300 group-hover:bg-butter-cream group-hover:text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
