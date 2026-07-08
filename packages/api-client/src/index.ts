import axios, { type AxiosInstance } from "axios";

export function createApiClient(baseURL: string): AxiosInstance {
  return axios.create({ baseURL, withCredentials: true });
}

export interface ConfigureAuthClientOptions {
  getAccessToken: () => string | null;
  setAccessToken: (token: string | null) => void;
  onRefreshFailure: () => void;
  refreshEndpoint?: string;
}

/**
 * Wiring generik untuk auth flow (Bearer access token + httpOnly refresh
 * cookie) — package ini sengaja TIDAK depend ke Zustand/store manapun,
 * getter/setter di-wire dari app-level (lihat apps/dashboard/src/services/api-client.ts).
 */
export function configureAuthClient(client: AxiosInstance, options: ConfigureAuthClientOptions) {
  const refreshEndpoint = options.refreshEndpoint ?? "/api/auth/refresh";
  let refreshPromise: Promise<string | null> | null = null;

  client.interceptors.request.use((config) => {
    const token = options.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config as (typeof error.config & { _retry?: boolean }) | undefined;

      const isRefreshCall = originalRequest?.url?.includes(refreshEndpoint);

      if (error.response?.status !== 401 || !originalRequest || originalRequest._retry || isRefreshCall) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = client
          .post(refreshEndpoint)
          .then((res) => {
            const newToken = res.data?.data?.accessToken ?? null;
            options.setAccessToken(newToken);
            return newToken;
          })
          .catch(() => {
            options.setAccessToken(null);
            options.onRefreshFailure();
            return null;
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      const newToken = await refreshPromise;
      if (!newToken) return Promise.reject(error);

      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return client(originalRequest);
    },
  );
}
