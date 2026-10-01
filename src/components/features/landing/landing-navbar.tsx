"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SITE_CONFIG } from "@/config/site.config";
import { LANDING_NAV_LINKS } from "@/constants/landing.constants";
import { ROUTES, STORAGE_KEYS } from "@/constants/routes.constants";

export const LandingNavbar: React.FC = () => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME_MODE) as
        | "light"
        | "dark"
        | null;
      if (savedTheme) return savedTheme;
    }
    return "light";
  });

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(themeMode);
  }, [themeMode]);

  const handleToggleTheme = () => {
    const nextTheme = themeMode === "light" ? "dark" : "light";
    setThemeMode(nextTheme);
    localStorage.setItem(STORAGE_KEYS.THEME_MODE, nextTheme);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-surface/90 backdrop-blur-md border-b border-border dark:border-white/[0.08]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
        {/* Brand Logo + Monospace Tag */}
        <Link href={ROUTES.LANDING} className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-md bg-primary text-on-primary flex items-center justify-center font-mono font-black text-sm">
            G
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-base tracking-tight text-text-primary">
              {SITE_CONFIG.name}
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-surface-secondary border border-border dark:border-white/[0.08] text-[10px] font-mono text-text-secondary">
              v1.0 • OS
            </span>
          </div>
        </Link>

        {/* Anchor Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-text-secondary">
          {LANDING_NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="hover:text-text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Actions: Theme Switcher, Live Demo & Auth CTAs */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleTheme}
            className="px-2.5 py-1.5 rounded-md bg-surface-secondary border border-border dark:border-white/[0.08] text-xs font-mono text-text-primary hover:bg-surface-tertiary transition-colors cursor-pointer"
            title="Chuyển đổi giao diện Sáng / Tối"
          >
            {themeMode === "light" ? "☀️ Light" : "🌙 Dark"}
          </button>

          <Link
            href={ROUTES.DASHBOARD}
            className="hidden sm:inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-surface-secondary hover:bg-surface-tertiary border border-border dark:border-white/[0.08] text-xs font-semibold text-text-primary transition-colors"
          >
            <span>Bản Live ↗</span>
          </Link>

          <Link
            href={ROUTES.LOGIN}
            className="hidden md:inline-flex px-3 py-1.5 rounded-md border border-border dark:border-white/[0.08] hover:bg-surface-secondary text-xs font-semibold text-text-secondary hover:text-text-primary transition-colors"
          >
            Đăng nhập
          </Link>

          <Link
            href={ROUTES.REGISTER}
            className="px-3.5 py-1.5 rounded-md bg-primary hover:bg-primary-hover text-on-primary text-xs font-semibold transition-colors"
          >
            Bắt đầu miễn phí
          </Link>
        </div>
      </div>
    </header>
  );
};
