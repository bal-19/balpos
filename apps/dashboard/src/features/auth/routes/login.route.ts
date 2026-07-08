import { type AnyRoute, createRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/auth.store";
import { LoginPage } from "../components/LoginPage";

export function createLoginRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/login",
    beforeLoad: () => {
      if (useAuthStore.getState().isAuthenticated) {
        throw redirect({ to: "/" });
      }
    },
    component: LoginPage,
  });
}
