"use client";

import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ROUTES } from "@/constants/routes.constants";

export default function AuthPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, login, register, logout, loading: authLoading } = useAuth();

  const [mode, setMode] = useState<"login" | "register">(
    pathname === ROUTES.REGISTER ? "register" : "login"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password || (mode === "register" && !name)) {
      setErrorMessage("Vui lòng điền đầy đủ các thông tin yêu cầu.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "login") {
        await login({ email, password });
        setSuccessMessage("Đăng nhập thành công! Đang chuyển hướng...");
        setTimeout(() => router.push(ROUTES.DASHBOARD), 1000);
      } else {
        await register({ email, password, name });
        setSuccessMessage("Đăng ký tài khoản thành công! Đang chuyển hướng...");
        setTimeout(() => router.push(ROUTES.DASHBOARD), 1000);
      }
    } catch (err: unknown) {
      const errorObj = err as {
        response?: { data?: { message?: string } };
        message?: string;
      };
      const msg =
        errorObj?.response?.data?.message ||
        errorObj?.message ||
        "Đã có lỗi xảy ra. Vui lòng thử lại.";
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center p-4 bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden">
      {/* Decorative ambient lighting elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[var(--primary)] opacity-20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[var(--accent-gold)] opacity-15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-[var(--surface-secondary)] border border-[var(--border)] rounded-2xl p-8 shadow-2xl backdrop-blur-xl relative z-10 transition-all duration-300">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[var(--primary-soft)] text-[var(--primary)] mb-4 shadow-sm text-2xl font-bold">
            GON
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            {user ? "Tài khoản của bạn" : mode === "login" ? "Chào mừng trở lại" : "Tạo tài khoản mới"}
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            {user
              ? "Bạn đã đăng nhập vào hệ thống Gọn Web"
              : mode === "login"
              ? "Giải phóng tâm trí khỏi sự hỗn độn cùng Gọn Web"
              : "Bắt đầu hành trình phát triển bản thân thông minh"}
          </p>
        </div>

        {/* Authenticated State Display */}
        {user ? (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-[var(--surface-tertiary)] border border-[var(--border-subtle)] space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--text-tertiary)] uppercase font-semibold">Tên hiển thị</span>
                <span className="text-sm font-medium text-[var(--text-primary)]">{user.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--text-tertiary)] uppercase font-semibold">Email</span>
                <span className="text-sm font-medium text-[var(--text-primary)]">{user.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-[var(--text-tertiary)] uppercase font-semibold">Vai trò</span>
                <span className="text-xs px-2 py-0.5 rounded bg-[var(--primary-soft)] text-[var(--primary)] font-semibold">
                  {user.role}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[var(--border-subtle)]">
                <span className="text-xs text-[var(--text-tertiary)] uppercase font-semibold">Cấp độ / XP</span>
                <span className="text-sm font-bold text-[var(--accent-gold)]">
                  Lv.{user.level} • {user.xp} XP
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full py-3 px-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold transition shadow-md"
              >
                Vào Trang Chủ Action
              </button>
              <button
                onClick={logout}
                disabled={authLoading}
                className="w-full py-3 px-4 rounded-xl border border-[var(--border)] hover:bg-[var(--surface-tertiary)] text-[var(--text-secondary)] font-medium transition"
              >
                {authLoading ? "Đang đăng xuất..." : "Đăng xuất"}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Mode Switcher Tabs */}
            <div className="flex p-1 bg-[var(--surface-tertiary)] rounded-xl mb-6 border border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === "login"
                    ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setErrorMessage(null);
                  setSuccessMessage(null);
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  mode === "register"
                    ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-sm"
                    : "text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]"
                }`}
              >
                Đăng ký
              </button>
            </div>

            {/* Error & Success Messages */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-xs font-medium">
                ⚠️ {errorMessage}
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-medium">
                ✅ {successMessage}
              </div>
            )}

            {/* Auth Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "register" && (
                <div>
                  <label className="block text-xs font-semibold uppercase text-[var(--text-tertiary)] mb-1.5">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Nguyễn Văn A"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--primary)] text-sm outline-none transition"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase text-[var(--text-tertiary)] mb-1.5">
                  Địa chỉ Email
                </label>
                <input
                  type="email"
                  required
                  placeholder="user@gon.vn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--primary)] text-sm outline-none transition"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-[var(--text-tertiary)] mb-1.5">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] focus:border-[var(--primary)] text-sm outline-none transition pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-tertiary)] hover:text-[var(--text-primary)]"
                  >
                    {showPassword ? "Ẩn" : "Hiện"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || authLoading}
                className="w-full py-3 px-4 mt-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-semibold text-sm transition-all shadow-md disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {(isSubmitting || authLoading) && (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {mode === "login" ? "Đăng nhập" : "Đăng ký tài khoản"}
              </button>
            </form>

            {/* Footer note */}
            <div className="mt-6 text-center text-xs text-[var(--text-tertiary)]">
              {mode === "login" ? (
                <>
                  Chưa có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("register")}
                    className="text-[var(--primary)] font-semibold hover:underline"
                  >
                    Tạo tài khoản ngay
                  </button>
                </>
              ) : (
                <>
                  Đã có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => setMode("login")}
                    className="text-[var(--primary)] font-semibold hover:underline"
                  >
                    Đăng nhập tại đây
                  </button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
