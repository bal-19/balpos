import type { AuthUser, PermissionCode } from "@restaurant-pos/types";
import { create } from "zustand";

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isBootstrapping: boolean;
  setAuth: (user: AuthUser, accessToken: string) => void;
  setAccessToken: (token: string | null) => void;
  clearAuth: () => void;
  setBootstrapped: () => void;
  hasPermission: (code: PermissionCode) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isBootstrapping: true,
  setAuth: (user, accessToken) => set({ user, accessToken, isAuthenticated: true }),
  setAccessToken: (accessToken) =>
    set((state) => ({
      accessToken,
      isAuthenticated: accessToken != null && state.user != null,
    })),
  clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false }),
  setBootstrapped: () => set({ isBootstrapping: false }),
  hasPermission: (code) => get().user?.permissions.includes(code) ?? false,
}));
