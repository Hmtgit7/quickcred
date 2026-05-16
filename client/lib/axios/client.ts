import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://quickcred-api.onrender.com";

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
  timeout: 15_000,
});

/**
 * Request interceptor — attach Bearer token from localStorage (set by authStore).
 * We read directly from localStorage here to avoid a circular import with the Zustand store.
 */
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem("quickcred-auth");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as { state?: { accessToken?: string } };
        const token = parsed?.state?.accessToken;
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        // ignore malformed storage
      }
    }
  }
  return config;
});

/** Track whether we are already refreshing to prevent infinite loops */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

/**
 * Response interceptor — on 401, attempt silent refresh.
 * If refresh succeeds, retry the original request.
 * If refresh fails, clear auth and redirect to /login.
 */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Only attempt refresh for 401 on non-auth endpoints
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes("/auth/")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${token}`;
              }
              resolve(apiClient(originalRequest));
            },
            reject,
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const raw = typeof window !== "undefined" ? localStorage.getItem("quickcred-auth") : null;
        const parsed = raw ? (JSON.parse(raw) as { state?: { refreshToken?: string } }) : null;
        const refreshToken = parsed?.state?.refreshToken;

        if (!refreshToken) throw new Error("No refresh token");

        const { data } = await axios.post<{
          data: { accessToken: string; refreshToken: string };
        }>(`${BASE_URL}/api/auth/refresh`, { refreshToken });

        const newAccess = data.data.accessToken;
        const newRefresh = data.data.refreshToken;

        // Update persisted Zustand store directly
        if (raw && typeof window !== "undefined") {
          const updated = JSON.parse(raw) as { state?: Record<string, unknown> };
          if (updated.state) {
            updated.state.accessToken = newAccess;
            updated.state.refreshToken = newRefresh;
            localStorage.setItem("quickcred-auth", JSON.stringify(updated));
          }
        }

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        }
        processQueue(null, newAccess);
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Hard logout — clear storage and redirect
        if (typeof window !== "undefined") {
          localStorage.removeItem("quickcred-auth");
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
