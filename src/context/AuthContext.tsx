"use client";

import React, { useEffect, ReactNode } from "react";
import { useAuthStore } from "@/stores/useAuthStore";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const fetchProfile = useAuthStore((s) => s.fetchProfile);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  useEffect(() => {
    // Initial profile hydration on mount
    fetchProfile();

    const handleUnauthorized = () => {
      clearAuth();
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, [fetchProfile, clearAuth]);

  return <>{children}</>;
};

// Hook delegating to Zustand store for convenience & full backward compatibility
export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const logout = useAuthStore((s) => s.logout);
  const refreshProfile = useAuthStore((s) => s.fetchProfile);

  return {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshProfile,
  };
};
