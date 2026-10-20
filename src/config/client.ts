/**
 * @file client.ts
 * @description Configured Axios HTTP client with silent token refresh queue using HttpOnly cookies (withCredentials).
 */

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import { useUserStore } from "@/store/user.store"
import type { ApiResponse } from "@/types/auth"

import { ApiRoute, AppRoute } from "@/routes"

export const API_BASE_URL = process.env.BACKEND_INTERNAL_URL ||"http://localhost:5000/api/v1"
// || "https://meeo-server.onrender.com/api/v1"

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
  timeout: 30000,
});

// Protected routes that require redirecting to login on 401
const PROTECTED_ROUTES = [AppRoute.ACCOUNT, AppRoute.ORDERS, '/admin'];

const isProtectedRoute = (pathname: string): boolean => {
  return PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
};

// Variables for managing in-flight token refresh and request queue
let isRefreshing = false
let failedQueue: Array<{
  resolve: () => void
  reject: (error: unknown) => void
}> = []

const processQueue = (error: unknown) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve()
    }
  })
  failedQueue = []
}

/**
 * Executes a token refresh attempt against POST /auth/refresh via HttpOnly cookies.
 */
export async function executeSilentRefresh(): Promise<{ success: boolean }> {
  // Directly hit the backend refresh route
  const response = await axios.post<ApiResponse<{ accessToken: string }>>(
    `${API_BASE_URL}${ApiRoute.AUTH.REFRESH}`,
    {},
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  )

  if (response.status >= 200 && response.status < 300 && response.data?.data?.accessToken) {
    const newAccessToken = response.data.data.accessToken;
    useUserStore.getState().setAccessToken(newAccessToken);
    return { success: true };
  }

  throw new Error("Invalid response received from refresh endpoint")
}

import { getStoredCsrfToken } from "@/lib/csrf"

// Request Interceptor: Attach Access Token, CSRF Token & Handle FormData
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useUserStore.getState().accessToken;

    if (token && config.headers) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    const url = config.url || "";
    const method = (config.method || "get").toLowerCase();
    const isMutating = ["post", "put", "patch", "delete"].includes(method);

    // Attach CSRF token only for mutating requests (POST, PUT, PATCH, DELETE)
    const csrfToken = getStoredCsrfToken();
    if (isMutating && csrfToken && config.headers && !config.headers["X-CSRF-Token"]) {
      config.headers["X-CSRF-Token"] = csrfToken;
    }

    // When payload is FormData, delete Content-Type so browser/Axios sets multipart/form-data with boundary
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      if (config.headers && typeof (config.headers as any).delete === "function") {
        config.headers.delete("Content-Type");
      } else if (config.headers) {
        delete config.headers["Content-Type"];
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 & Silent Refresh via HttpOnly cookies
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean
    }

    if (!originalRequest) {
      return Promise.reject(error)
    }

    const isAuthEndpoint =
      originalRequest.url?.includes(ApiRoute.AUTH.LOGIN) ||
      originalRequest.url?.includes(ApiRoute.AUTH.REGISTER) ||
      originalRequest.url?.includes(ApiRoute.AUTH.REFRESH) ||
      originalRequest.url?.includes(ApiRoute.AUTH.OTP_VERIFICATION) ||
      originalRequest.url?.includes(ApiRoute.AUTH.RESET_PASSWORD)

    // Handle 401 Unauthorized for non-auth requests
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        // Queue the request until token refresh completes
        return new Promise<void>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then(() => {
            originalRequest._retry = true
            return apiClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        await executeSilentRefresh()
        processQueue(null)
        
        const updatedToken = useUserStore.getState().accessToken;
        if (updatedToken && originalRequest.headers) {
          originalRequest.headers["Authorization"] = `Bearer ${updatedToken}`;
        }

        return apiClient(originalRequest)
      } catch (refreshError: any) {
        processQueue(refreshError)

        useUserStore.getState().logout()

        if (
          typeof window !== "undefined" &&
          isProtectedRoute(window.location.pathname)
        ) {
          window.location.href = AppRoute.AUTH.LOGIN_WITH_REDIRECT(
            window.location.pathname + window.location.search
          )
        }

        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // If request already retried after refresh and still got 401
    if (error.response?.status === 401 && !isAuthEndpoint) {
      useUserStore.getState().logout()
      if (
        typeof window !== "undefined" &&
        isProtectedRoute(window.location.pathname)
      ) {
        window.location.href = AppRoute.AUTH.LOGIN_WITH_REDIRECT(
          window.location.pathname + window.location.search
        )
      }
    }

    return Promise.reject(error)
  }
)
