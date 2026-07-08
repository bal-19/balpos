import { configureAuthClient, createApiClient } from "@restaurant-pos/api-client";
import { getAuthState, setAuthState } from "./auth";

export const apiClient = createApiClient(import.meta.env.VITE_API_BASE_URL);

configureAuthClient(apiClient, {
  getAccessToken: () => getAuthState().accessToken,
  setAccessToken: (token) => setAuthState({ accessToken: token }),
  onRefreshFailure: () => setAuthState({ user: null, accessToken: null }),
});
