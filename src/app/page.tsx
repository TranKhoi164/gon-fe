import React from "react";
import { LandingAuthGate } from "@/components/features/landing/landing-auth-gate";
import { LandingNavbar } from "@/components/features/landing/landing-navbar";
import { HeroSection } from "@/components/features/landing/hero-section";
import { FeaturesSection } from "@/components/features/landing/features-section";
import { ComparisonSection } from "@/components/features/landing/comparison-section";
import { FaqCtaSection } from "@/components/features/landing/faq-cta-section";
import { LandingFooter } from "@/components/features/landing/landing-footer";
import { Reveal } from "@/components/features/landing/reveal";
import { InteractivePlayground } from "@/components/features/landing/interactive-playground";

export default function GonLandingPage() {
  return (
    <LandingAuthGate>
      <div className="min-h-screen bg-background text-text-primary flex flex-col font-sans selection:bg-butter-cream selection:text-primary">
        <LandingNavbar />

        <main className="flex-1">
          {/* 1. Hero: đi thẳng vào giá trị cốt lõi */}
          <HeroSection />

          {/* 2. 3 tính năng cốt lõi */}
          <FeaturesSection />

          {/* 3. So sánh nhanh */}
          <ComparisonSection />

          {/* 4. Dùng thử trực tiếp (sandbox) */}
          <section
            id="playground"
            className="scroll-mt-16 py-20 lg:py-28 bg-surface-secondary/40 border-y border-border dark:border-white/[0.06]"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Reveal>
                <InteractivePlayground />
              </Reveal>
            </div>
          </section>

          {/* 5. Hỏi đáp & CTA kết trang */}
          <FaqCtaSection />
        </main>

        <LandingFooter />
      </div>
    </LandingAuthGate>
  );
}
