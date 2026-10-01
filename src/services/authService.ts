import apiClient from "@/lib/axios";
import {
  LoginDto,
  RegisterDto,
  AuthResponse,
  UserProfile,
  TokenPairResponse,
  LogoutResponse,
} from "@/types/auth";

export const authService = {
  /**
   * Register new user account. Sets HttpOnly RefreshToken cookie on backend.
   */
  async register(dto: RegisterDto): Promise<AuthResponse> {
    const res = await apiClient.post<any, AuthResponse>("/auth/register", dto);
    if (res?.accessToken && typeof window !== "undefined") {
      localStorage.setItem("access_token", res.accessToken);
    }
    return res;
  },

  /**
   * Login user. Sets HttpOnly RefreshToken cookie on backend.
   */
  async login(dto: LoginDto): Promise<AuthResponse> {
    const res = await apiClient.post<any, AuthResponse>("/auth/login", dto);
    if (res?.accessToken && typeof window !== "undefined") {
      localStorage.setItem("access_token", res.accessToken);
    }
    return res;
  },

  /**
   * Refresh Access Token using HttpOnly Cookie.
   */
  async refresh(): Promise<TokenPairResponse> {
    const res = await apiClient.post<any, TokenPairResponse>("/auth/refresh", {});
    if (res?.accessToken && typeof window !== "undefined") {
      localStorage.setItem("access_token", res.accessToken);
    }
    return res;
  },

  /**
   * Logout user, clear HttpOnly Cookie on backend & clear local access token.
   */
  async logout(): Promise<LogoutResponse> {
    try {
      const res = await apiClient.post<any, LogoutResponse>("/auth/logout", {});
      return res;
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("access_token");
      }
    }
  },

  /**
   * Fetch current user profile using Access Token.
   */
  async getProfile(): Promise<UserProfile> {
    return apiClient.get<any, UserProfile>("/auth/me");
  },
};
