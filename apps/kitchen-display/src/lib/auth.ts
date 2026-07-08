import type { AuthUser } from "@restaurant-pos/types";

export interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
}

/**
 * State auth sesederhana mungkin (bukan Zustand) — app ini cuma punya 2
 * "layar" (login vs board), tidak butuh state management penuh.
 */
let state: AuthState = { user: null, accessToken: null };
const listeners = new Set<(state: AuthState) => void>();

export function getAuthState(): AuthState {
  return state;
}

export function setAuthState(next: Partial<AuthState>) {
  state = { ...state, ...next };
  listeners.forEach((listener) => listener(state));
}

export function subscribeAuthState(listener: (state: AuthState) => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
