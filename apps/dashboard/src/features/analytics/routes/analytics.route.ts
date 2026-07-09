import { PERMISSION_CODES } from "@restaurant-pos/types";
import { type AnyRoute, createRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/auth.store";
import { AnalyticsPage } from "../components/AnalyticsPage";

export function createAnalyticsRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/analytics",
    beforeLoad: () => {
      if (!useAuthStore.getState().hasPermission(PERMISSION_CODES.ANALYTICS_VIEW)) {
        throw redirect({ to: "/" });
      }
    },
    component: AnalyticsPage,
  });
}
