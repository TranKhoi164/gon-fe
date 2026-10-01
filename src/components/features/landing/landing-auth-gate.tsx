"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ROUTES, STORAGE_KEYS } from "@/constants/routes.constants";

const emptySubscribe = () => () => {};

interface LandingAuthGateProps {
  children: React.ReactNode;
}

/**
 * Chỉ hiển thị Landing Page khi người dùng chưa đăng nhập / đăng ký.
 * Nếu đã xác thực (isAuthenticated hoặc có user), tự động chuyển hướng thẳng tới /dashboard.
 */
export const LandingAuthGate: React.FC<LandingAuthGateProps> = ({ children }) => {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();

  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const hasPersistedToken =
    isClient && Boolean(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN));

  const isUserLoggedIn = isAuthenticated || Boolean(user) || hasPersistedToken;

  useEffect(() => {
    if (isClient && isUserLoggedIn) {
      router.replace(ROUTES.DASHBOARD);
    }
  }, [isClient, isUserLoggedIn, router]);

  if (!isClient || loading || isUserLoggedIn) {
    return (
      <div className="min-h-screen bg-surface text-text-primary flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-primary text-on-primary flex items-center justify-center font-black text-xl animate-pulse">
            G
          </div>
          <p className="text-xs font-semibold text-text-secondary">
            Đang mở không gian làm việc Gọn...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
