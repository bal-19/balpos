import type { ApiSuccessEnvelope, AuthUser, PublicTheme } from "@restaurant-pos/types";
import { applyBrandColor } from "@restaurant-pos/ui";
import { useEffect, useState } from "react";
import { KitchenBoard } from "./components/KitchenBoard";
import { LoginForm } from "./components/LoginForm";
import { apiClient } from "./lib/api-client";
import { getAuthState, setAuthState, subscribeAuthState } from "./lib/auth";

interface SessionResponse {
  user: AuthUser;
  accessToken: string;
}

export function App() {
  const [authState, setLocalAuthState] = useState(getAuthState());
  const [bootstrapped, setBootstrapped] = useState(false);

  useEffect(() => {
    const unsubscribe = subscribeAuthState(setLocalAuthState);

    (async () => {
      try {
        const { data } = await apiClient.get<ApiSuccessEnvelope<PublicTheme>>("/api/settings/theme");
        applyBrandColor(data.data.primaryColor);
      } catch {
        applyBrandColor("#2C4A3B");
      }

      try {
        const { data } = await apiClient.post<ApiSuccessEnvelope<SessionResponse>>("/api/auth/refresh");
        setAuthState({ user: data.data.user, accessToken: data.data.accessToken });
      } catch {
        // Belum login — tampilkan LoginForm.
      } finally {
        setBootstrapped(true);
      }
    })();

    return unsubscribe;
  }, []);

  if (!bootstrapped) return null;
  return authState.accessToken ? <KitchenBoard /> : <LoginForm />;
}
