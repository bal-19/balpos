import { PERMISSION_CODES } from "@restaurant-pos/types";
import { type AnyRoute, createRoute, lazyRouteComponent, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/auth.store";

export function createAnalyticsRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/analytics",
    beforeLoad: () => {
      if (!useAuthStore.getState().hasPermission(PERMISSION_CODES.ANALYTICS_VIEW)) {
        throw redirect({ to: "/" });
      }
    },
    component: lazyRouteComponent(() =>
      import("../components/AnalyticsPage").then((m) => ({ default: m.AnalyticsPage })),
    ),
  });
}
