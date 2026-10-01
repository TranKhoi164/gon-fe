import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { UserProfile, LoginDto, RegisterDto } from "@/types/auth";
import { authService } from "@/services/authService";

interface AuthState {
  user: UserProfile | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;

  setUser: (user: UserProfile | null) => void;
  setAccessToken: (token: string | null) => void;
  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
        }),

      setAccessToken: (token) => {
        if (typeof window !== "undefined") {
          if (token) {
            localStorage.setItem("access_token", token);
          } else {
            localStorage.removeItem("access_token");
          }
        }
        set({ accessToken: token });
      },

      login: async (dto) => {
        set({ loading: true });
        try {
          const res = await authService.login(dto);
          if (res?.accessToken) {
            get().setAccessToken(res.accessToken);
          }
          set({
            user: res.user,
            isAuthenticated: true,
          });
        } finally {
          set({ loading: false });
        }
      },

      register: async (dto) => {
        set({ loading: true });
        try {
          const res = await authService.register(dto);
          if (res?.accessToken) {
            get().setAccessToken(res.accessToken);
          }
          set({
            user: res.user,
            isAuthenticated: true,
          });
        } finally {
          set({ loading: false });
        }
      },

      logout: async () => {
        set({ loading: true });
        try {
          await authService.logout();
        } finally {
          get().clearAuth();
          set({ loading: false });
        }
      },

      fetchProfile: async () => {
        const token = get().accessToken || (typeof window !== "undefined" ? localStorage.getItem("access_token") : null);
        if (!token) {
          get().clearAuth();
          return;
        }

        set({ loading: true });
        try {
          const profile = await authService.getProfile();
          set({
            user: profile,
            isAuthenticated: true,
          });
        } catch {
          get().clearAuth();
        } finally {
          set({ loading: false });
        }
      },

      clearAuth: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
        }
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "gon_auth_storage", // key in localStorage
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
