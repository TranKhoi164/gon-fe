import React from "react";
import Link from "next/link";
import { Reveal } from "@/components/features/landing/reveal";
import { SectionHeading } from "@/components/features/landing/section-heading";
import { FaqAccordion } from "@/components/features/landing/faq-accordion";
import { GonMiniMascot } from "@/components/features/landing/gon-mascot-card";
import { LANDING_SECTIONS_COPY } from "@/constants/landing.constants";
import { ROUTES } from "@/constants/routes.constants";

export const FaqCtaSection: React.FC = () => {
  const { faq, finalCta } = LANDING_SECTIONS_COPY;

  return (
    <section id="faq" className="scroll-mt-16 py-20 lg:py-28">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        <div className="space-y-8">
          <Reveal>
            <SectionHeading eyebrow={faq.eyebrow} title={faq.title} align="center" />
          </Reveal>
          <Reveal delay={100}>
            <FaqAccordion />
          </Reveal>
        </div>

        {/* Final CTA */}
        <Reveal>
          <div className="relative pt-8">
            <div className="absolute top-0 right-6 z-10 flex items-end gap-2 pointer-events-none">
              <span className="mb-2 px-2.5 py-1 rounded-lg bg-surface border border-border dark:border-white/[0.08] text-[10px] font-mono text-primary font-bold shadow-warm-xs">
                {finalCta.badge}
              </span>
              <div className="animate-float">
                <GonMiniMascot mood="cheering" className="w-12 h-12" />
              </div>
            </div>

            <div className="relative isolate overflow-hidden rounded-3xl border border-border dark:border-white/[0.08] bg-surface p-8 sm:p-12 text-center space-y-6 shadow-warm-lg">
              <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-accent-gold-soft blur-3xl animate-glow" />
                <div
                  className="absolute -top-24 -right-16 h-64 w-64 rounded-full bg-primary-soft blur-3xl animate-glow"
                  style={{ animationDelay: "-4s" }}
                />
              </div>

              <h2 className="text-2xl sm:text-4xl font-serif-display font-bold text-text-primary max-w-2xl mx-auto leading-tight">
                {finalCta.titleBefore}{" "}
                <span className="italic text-primary">{finalCta.titleHighlight}</span>{" "}
                {finalCta.titleAfter}
              </h2>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={ROUTES.REGISTER}
                  id="footer-primary-cta"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-semibold text-sm shadow-warm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-warm-lg"
                >
                  {finalCta.primaryText}
                </Link>
                <Link
                  href={ROUTES.DASHBOARD}
                  id="footer-live-dashboard-cta"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-surface-secondary hover:bg-surface-tertiary border border-border dark:border-white/[0.08] text-text-primary font-semibold text-sm transition-all duration-300 hover:-translate-y-0.5"
                >
                  {finalCta.secondaryText}
                </Link>
              </div>

              <p className="text-[11px] font-mono text-text-tertiary">{finalCta.footnote}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
