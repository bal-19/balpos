import { configureAuthClient, createApiClient } from "@restaurant-pos/api-client";
import { useAuthStore } from "../stores/auth.store";

export const apiClient = createApiClient(import.meta.env.VITE_API_BASE_URL);

configureAuthClient(apiClient, {
  getAccessToken: () => useAuthStore.getState().accessToken,
  setAccessToken: (token) => useAuthStore.getState().setAccessToken(token),
  onRefreshFailure: () => {
    useAuthStore.getState().clearAuth();
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  },
});
