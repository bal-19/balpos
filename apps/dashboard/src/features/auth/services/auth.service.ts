import type { ApiSuccessEnvelope, AuthUser } from "@restaurant-pos/types";
import { apiClient } from "../../../services/api-client";

interface SessionResponse {
  user: AuthUser;
  accessToken: string;
}

export async function login(email: string, password: string) {
  const { data } = await apiClient.post<ApiSuccessEnvelope<SessionResponse>>("/api/auth/login", {
    email,
    password,
  });
  return data.data;
}

export async function refreshSession() {
  const { data } = await apiClient.post<ApiSuccessEnvelope<SessionResponse>>("/api/auth/refresh");
  return data.data;
}

export async function logout() {
  await apiClient.post("/api/auth/logout");
}

export async function fetchMe() {
  const { data } = await apiClient.get<ApiSuccessEnvelope<AuthUser>>("/api/auth/me");
  return data.data;
}
