import React from "react";
import Link from "next/link";
import { LANDING_SECTIONS_COPY } from "@/constants/landing.constants";
import { ROUTES } from "@/constants/routes.constants";

const FOOTER_LINKS = [ROUTES.DASHBOARD, ROUTES.LOGIN, ROUTES.REGISTER] as const;

export const LandingFooter: React.FC = () => {
  const copy = LANDING_SECTIONS_COPY.footer;

  return (
    <footer className="border-t border-border dark:border-white/[0.08] bg-surface-secondary py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-tertiary">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="w-6 h-6 rounded-md bg-primary text-on-primary font-mono font-bold flex items-center justify-center text-[11px]">
            G
          </span>
          <span className="font-semibold text-text-primary">{copy.brand}</span>
          <span>— {copy.tagline}</span>
        </div>
        <div className="flex items-center gap-4 font-mono text-[11px]">
          {FOOTER_LINKS.map((href) => (
            <Link
              key={href}
              href={href}
              className="relative hover:text-primary transition-colors after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 hover:after:scale-x-100"
            >
              {href}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
};
