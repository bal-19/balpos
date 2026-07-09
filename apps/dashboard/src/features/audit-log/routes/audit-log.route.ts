import { PERMISSION_CODES } from "@restaurant-pos/types";
import { type AnyRoute, createRoute, lazyRouteComponent, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/auth.store";

export function createAuditLogRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/audit-log",
    beforeLoad: () => {
      if (!useAuthStore.getState().hasPermission(PERMISSION_CODES.AUDIT_LOG_VIEW)) {
        throw redirect({ to: "/" });
      }
    },
    component: lazyRouteComponent(() =>
      import("../components/AuditLogPage").then((m) => ({ default: m.AuditLogPage })),
    ),
  });
}
