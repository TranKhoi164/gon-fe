import axios, { AxiosInstance, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";
import { SITE_CONFIG } from "@/config/site.config";
import { useAuthStore } from "@/stores/useAuthStore";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * Axios instance configured for Gon Web frontend with HttpOnly Cookie & Bearer Token Refresh Interceptor
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: SITE_CONFIG.apiUrl,
  timeout: 10000,
  withCredentials: true, // MANDATORY: Sends & receives HttpOnly refreshToken cookies
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request Interceptor: Attach Access Token if available from Zustand or localStorage
apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = useAuthStore.getState().accessToken || localStorage.getItem("access_token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Envelope Unwrapping & Automatic Token Refreshing
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // If backend returns enveloped format { data: ..., message: ... }
    if (response.data && typeof response.data === "object" && "data" in response.data) {
      return response.data.data;
    }
    return response.data;
  },
  async (error: AxiosError<{ message?: string; statusCode?: number }>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Check if error is 401 Unauthorized and not already retried
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/login") &&
      !originalRequest.url?.includes("/auth/register") &&
      !originalRequest.url?.includes("/auth/refresh")
    ) {
      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Call refresh token endpoint (HttpOnly cookie sent automatically via withCredentials: true)
        const refreshResponse = await axios.post<{ data?: { accessToken: string }; accessToken?: string }>(
          `${SITE_CONFIG.apiUrl}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Extract new accessToken from enveloped or direct response
        const newAccessToken =
          refreshResponse.data?.data?.accessToken ||
          refreshResponse.data?.accessToken;

        if (!newAccessToken) {
          throw new Error("No access token returned from refresh endpoint");
        }

        // Store new access token in Zustand store & localStorage
        useAuthStore.getState().setAccessToken(newAccessToken);

        // Update Authorization header for original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        // Process any queued requests with new token
        processQueue(null, newAccessToken);
        isRefreshing = false;

        // Retry original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;

        // Clear stored auth on refresh failure
        useAuthStore.getState().clearAuth();
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("auth:unauthorized"));
        }

        return Promise.reject(refreshError);
      }
    }

    const errorMsg =
      error.response?.data?.message ||
      error.message ||
      "Lỗi kết nối tới máy chủ";

    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[Axios Notice] Request to ${error.config?.url} failed: ${errorMsg}`
      );
    }

    return Promise.reject(error);
  }
);

export default apiClient;
