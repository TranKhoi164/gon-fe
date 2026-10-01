import React from "react";
import Link from "next/link";
import { LandingAuthGate } from "@/components/features/landing/landing-auth-gate";
import { LandingNavbar } from "@/components/features/landing/landing-navbar";
import {
  GonMascotHeroCard,
  GonMiniMascot,
} from "@/components/features/landing/gon-mascot-card";
import { InteractivePlayground } from "@/components/features/landing/interactive-playground";
import {
  LANDING_HERO_CONFIG,
  HERO_PILL_TAGS,
  CORE_FEATURES_BENTO,
  COMPARISON_ROWS_DATA,
  LANDING_FAQ_DATA,
} from "@/constants/landing.constants";
import { ROUTES } from "@/constants/routes.constants";

export default function GonLandingPage() {
  return (
    <LandingAuthGate>
      <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans selection:bg-butter-cream selection:text-primary">
        {/* Sticky Minimal Navbar */}
        <LandingNavbar />

        <main className="flex-1">
          {/* ================================================================= */}
          {/* 1. HERO SECTION: DỨT KHOÁT, ĐI THẲNG VÀO GIÁ TRỊ CỐT LÕI          */}
          {/* ================================================================= */}
          <section className="relative pt-10 pb-16 lg:pt-14 lg:pb-20 border-b border-border dark:border-white/[0.08]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                {/* Left: Punchy Copy & CTAs */}
                <div className="lg:col-span-6 space-y-4">
                  <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-surface-secondary border border-border dark:border-white/[0.08] text-primary text-xs font-mono font-semibold">
                    <span>{LANDING_HERO_CONFIG.badge}</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl tracking-tight text-text-primary leading-[1.15]">
                    <span className="font-serif-display font-bold italic text-primary block text-4xl sm:text-6xl mb-1">
                      {LANDING_HERO_CONFIG.headlineTop}
                    </span>
                    <span className="font-bold tracking-tight">{LANDING_HERO_CONFIG.headlineHighlight} </span>
                    <span className="text-text-secondary text-2xl sm:text-3xl block mt-2 font-serif-display font-bold">
                      {LANDING_HERO_CONFIG.headlineBottom}
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base text-text-secondary leading-relaxed max-w-lg">
                    {LANDING_HERO_CONFIG.subheadline}
                  </p>

                  {/* 4 Mini Benefit Tags */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {HERO_PILL_TAGS.map((pill) => (
                      <span
                        key={pill.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-secondary border border-border text-xs font-medium text-text-secondary"
                      >
                        <span>{pill.icon}</span>
                        <span>{pill.label}</span>
                      </span>
                    ))}
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="flex items-center gap-3 pt-2">
                    <Link
                      href={ROUTES.REGISTER}
                      id="hero-primary-cta"
                      className="px-6 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-medium text-sm transition-all shadow-sm"
                    >
                      {LANDING_HERO_CONFIG.primaryCtaText} →
                    </Link>

                    <Link
                      href={ROUTES.DASHBOARD}
                      id="hero-live-demo-cta"
                      className="px-5 py-2.5 rounded-xl bg-surface hover:bg-surface-secondary border border-border text-text-primary font-medium text-sm transition-all shadow-2xs"
                    >
                      {LANDING_HERO_CONFIG.secondaryCtaText}
                    </Link>
                  </div>

                  {/* Trust Points */}
                  <div className="flex items-center gap-4 text-xs font-mono text-text-tertiary pt-1">
                    {LANDING_HERO_CONFIG.trustPoints.map((point) => (
                      <span key={point} className="flex items-center gap-1">
                        <span className="text-primary font-bold">✓</span> {point}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right: Window Mockup + Peeking Mascot */}
                <div className="lg:col-span-6">
                  <GonMascotHeroCard />
                </div>
              </div>
            </div>
          </section>

          {/* ================================================================= */}
          {/* 2. 3 TÍNH NĂNG CỐT LÕI: BENTO GRID 3 Ô GỌN GÀNG                   */}
          {/* ================================================================= */}
          <section
            id="features"
            className="py-16 lg:py-20 border-b border-border dark:border-white/[0.08] bg-surface-secondary/30"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="max-w-2xl space-y-1.5">
                <span className="text-xs font-mono text-primary font-bold uppercase tracking-wider">
                  Giá trị cốt lõi
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                  Tập trung vào điều thực sự quan trọng
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {CORE_FEATURES_BENTO.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl bg-surface border border-border dark:border-white/[0.08] p-6 hover:border-primary/50 transition-colors flex flex-col justify-between shadow-xs"
                  >
                    <div className="space-y-3.5">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl">{item.icon}</span>
                        <span className="px-2.5 py-1 rounded-lg bg-surface-secondary text-[11px] font-mono font-medium text-text-tertiary">
                          {item.badge}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-text-primary">
                        {item.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                        {item.desc}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mt-6 pt-4 border-t border-border dark:border-white/[0.08]">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg bg-surface-secondary text-[10px] font-mono text-text-secondary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ================================================================= */}
          {/* 3. SO SÁNH NHANH (QUICK COMPARISON)                               */}
          {/* ================================================================= */}
          <section
            id="comparison"
            className="py-16 lg:py-20 border-b border-border dark:border-white/[0.08]"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
              <div className="max-w-2xl space-y-1.5">
                <span className="text-xs font-mono text-primary font-bold uppercase tracking-wider">
                  Khác biệt
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                  Tại sao dùng Gọn thay vì mở 3–4 app?
                </h2>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-border dark:border-white/[0.08] bg-surface shadow-xs">
                <table className="w-full text-left border-collapse min-w-[640px]">
                  <thead>
                    <tr className="border-b border-border dark:border-white/[0.08] bg-surface-secondary text-[11px] font-mono uppercase text-text-tertiary">
                      <th className="py-3.5 px-5 font-bold text-text-primary">
                        Tiêu chí
                      </th>
                      <th className="py-3.5 px-5 font-semibold">Notion / Obsidian</th>
                      <th className="py-3.5 px-5 font-semibold">Todoist / TickTick</th>
                      <th className="py-3.5 px-5 font-bold text-primary bg-butter-surface border-l border-border dark:border-white/[0.08]">
                        🌿 Gọn Web
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border dark:divide-white/[0.08] text-xs sm:text-sm">
                    {COMPARISON_ROWS_DATA.map((row, idx) => (
                      <tr key={idx} className="hover:bg-surface-secondary/40 transition-colors">
                        <td className="py-3.5 px-5 font-semibold text-text-primary">
                          {row.feature}
                        </td>
                        <td className="py-3.5 px-5 text-text-secondary">
                          {row.notionObsidian}
                        </td>
                        <td className="py-3.5 px-5 text-text-secondary">
                          {row.todoistTickTick}
                        </td>
                        <td className="py-3.5 px-5 font-bold text-primary bg-butter-surface/60 border-l border-border dark:border-white/[0.08]">
                          {row.gonApp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* ================================================================= */}
          {/* 4. DÙNG THỬ TRỰC TIẾP (SANDBOX)                                   */}
          {/* ================================================================= */}
          <section
            id="playground"
            className="py-16 lg:py-20 border-b border-border dark:border-white/[0.08] bg-surface-secondary/20"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <InteractivePlayground />
            </div>
          </section>

          {/* ================================================================= */}
          {/* 5. HỎI ĐÁP & KẾT TRANG DỨT KHOÁT                                  */}
          {/* ================================================================= */}
          <section id="faq" className="py-16 lg:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
              {/* 3 Quick FAQs */}
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary">
                  Câu hỏi thường gặp
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {LANDING_FAQ_DATA.map((faq) => (
                    <div
                      key={faq.id}
                      className="rounded-xl bg-surface-secondary border border-border dark:border-white/[0.08] p-5 space-y-1.5 shadow-xs"
                    >
                      <h4 className="text-xs sm:text-sm font-bold text-text-primary">
                        {faq.question}
                      </h4>
                      <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Compact CTA Card with moderate rounded corners */}
              <div className="relative pt-6">
                <div className="absolute top-0 right-6 z-10 flex items-end gap-2 pointer-events-none">
                  <span className="mb-2 px-2.5 py-1 rounded-lg bg-surface-secondary border border-border dark:border-white/[0.08] text-[10px] font-mono text-primary font-bold">
                    LOCK IN NGAY
                  </span>
                  <GonMiniMascot mood="cheering" className="w-10 h-10" />
                </div>

                <div className="rounded-2xl bg-surface-secondary border border-border dark:border-white/[0.08] p-6 sm:p-8 text-center space-y-4 shadow-sm">
                  <h2 className="text-xl sm:text-2xl font-bold text-text-primary max-w-xl mx-auto">
                    Làm mọi thứ <span className="text-primary font-bold">Gọn gàng</span> và
                    bắt đầu tập trung vào điều thực sự quan trọng.
                  </h2>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                      href={ROUTES.REGISTER}
                      id="footer-primary-cta"
                      className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover text-on-primary font-semibold text-sm transition-colors"
                    >
                      Bắt đầu dùng thử miễn phí →
                    </Link>
                    <Link
                      href={ROUTES.DASHBOARD}
                      id="footer-live-dashboard-cta"
                      className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-surface hover:bg-surface-tertiary border border-border dark:border-white/[0.08] text-text-primary font-semibold text-sm transition-colors"
                    >
                      Mở Trang Làm Việc ↗
                    </Link>
                  </div>

                  <p className="text-[11px] font-mono text-text-tertiary">
                    Không cần thẻ tín dụng • Mở trình duyệt dùng ngay • 0ms đồng bộ
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>

        {/* Minimal Footer */}
        <footer className="border-t border-border dark:border-white/[0.08] bg-surface-secondary py-5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-tertiary">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-primary text-on-primary font-mono font-bold flex items-center justify-center text-[11px]">
                G
              </span>
              <span className="font-semibold text-text-primary">Gọn Web OS</span>
              <span>— Tối ưu thời gian, tập trung việc quan trọng.</span>
            </div>
            <div className="flex items-center gap-4 font-mono text-[11px]">
              <Link href={ROUTES.DASHBOARD} className="hover:text-primary transition-colors">
                /dashboard
              </Link>
              <Link href={ROUTES.LOGIN} className="hover:text-primary transition-colors">
                /login
              </Link>
              <Link href={ROUTES.REGISTER} className="hover:text-primary transition-colors">
                /register
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </LandingAuthGate>
  );
}
