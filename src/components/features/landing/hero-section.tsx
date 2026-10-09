import React from "react";
import Link from "next/link";
import { GonMascotHeroCard } from "@/components/features/landing/gon-mascot-card";
import { LANDING_HERO_CONFIG, HERO_PILL_TAGS } from "@/constants/landing.constants";
import { ROUTES } from "@/constants/routes.constants";

/** Mỗi phần tử của hero xuất hiện nối tiếp nhau khi tải trang */
const stagger = (step: number) => ({ animationDelay: `${step * 80}ms` });

export const HeroSection: React.FC = () => (
  <section className="relative isolate overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
    {/* Ambient warm glows + dot grid */}
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full bg-accent-gold-soft blur-3xl animate-glow" />
      <div
        className="absolute top-20 -right-32 h-[460px] w-[460px] rounded-full bg-primary-soft blur-3xl animate-glow"
        style={{ animationDelay: "-4s" }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black_35%,transparent_75%)]" />
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-10 items-center">
        {/* Left: Copy & CTAs */}
        <div className="lg:col-span-6 space-y-6">
          <div
            className="animate-fade-up inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/80 backdrop-blur border border-border dark:border-white/[0.08] text-primary text-xs font-mono font-semibold shadow-warm-xs"
            style={stagger(0)}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent-gold opacity-60 animate-ping" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-gold" />
            </span>
            {LANDING_HERO_CONFIG.badge}
          </div>

          <h1
            className="animate-fade-up text-3xl sm:text-5xl tracking-tight text-text-primary leading-[1.1]"
            style={stagger(1)}
          >
            <span className="font-serif-display font-bold italic block text-5xl sm:text-7xl mb-2 bg-gradient-to-r from-primary via-accent-gold to-primary bg-clip-text text-transparent">
              {LANDING_HERO_CONFIG.headlineTop}
            </span>
            <span className="font-bold tracking-tight">
              {LANDING_HERO_CONFIG.headlineHighlight}
            </span>
            <span className="text-text-secondary text-2xl sm:text-3xl block mt-3 font-serif-display font-semibold">
              {LANDING_HERO_CONFIG.headlineBottom}
            </span>
          </h1>

          <p
            className="animate-fade-up text-sm sm:text-base text-text-secondary leading-relaxed max-w-lg"
            style={stagger(2)}
          >
            {LANDING_HERO_CONFIG.subheadline}
          </p>

          <div className="animate-fade-up flex flex-wrap gap-2" style={stagger(3)}>
            {HERO_PILL_TAGS.map((pill) => (
              <span
                key={pill.id}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface/70 border border-border dark:border-white/[0.08] text-xs font-medium text-text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:text-text-primary"
              >
                <span>{pill.icon}</span>
                <span>{pill.label}</span>
              </span>
            ))}
          </div>

          <div
            className="animate-fade-up flex flex-col sm:flex-row sm:items-center gap-3 pt-1"
            style={stagger(4)}
          >
            <Link
              href={ROUTES.REGISTER}
              id="hero-primary-cta"
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-semibold text-sm shadow-warm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-warm-lg"
            >
              {LANDING_HERO_CONFIG.primaryCtaText}
              <span className="transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </Link>

            <Link
              href={ROUTES.DASHBOARD}
              id="hero-live-demo-cta"
              className="inline-flex items-center justify-center px-5 py-3 rounded-xl bg-surface hover:bg-surface-secondary border border-border dark:border-white/[0.08] text-text-primary font-medium text-sm shadow-warm-xs transition-all duration-300 hover:-translate-y-0.5"
            >
              {LANDING_HERO_CONFIG.secondaryCtaText}
            </Link>
          </div>

          <div
            className="animate-fade-up flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-mono text-text-tertiary"
            style={stagger(5)}
          >
            {LANDING_HERO_CONFIG.trustPoints.map((point) => (
              <span key={point} className="flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success-soft text-success text-[10px] font-bold">
                  ✓
                </span>
                {point}
              </span>
            ))}
          </div>
        </div>

        {/* Right: Mascot card, gently floating */}
        <div className="lg:col-span-6 animate-fade-up" style={stagger(3)}>
          <div className="animate-float">
            <GonMascotHeroCard />
          </div>
        </div>
      </div>
    </div>
  </section>
);
