import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { refreshSession } from "./features/auth/services/auth.service";
import { router } from "./router";
import { bootstrapTheme } from "./shared/theme/bootstrap-theme";
import { useAuthStore } from "./stores/auth.store";
import "./styles.css";

const queryClient = new QueryClient();

async function bootstrap() {
  await bootstrapTheme();

  try {
    const { user, accessToken } = await refreshSession();
    useAuthStore.getState().setAuth(user, accessToken);
  } catch {
    // Belum login / refresh token tidak valid — biarkan, route guard akan redirect ke /login.
  } finally {
    useAuthStore.getState().setBootstrapped();
  }

  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Root element not found");

  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  );
}

bootstrap();
