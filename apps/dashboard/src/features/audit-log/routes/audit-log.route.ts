import { PERMISSION_CODES } from "@restaurant-pos/types";
import { type AnyRoute, createRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/auth.store";
import { AuditLogPage } from "../components/AuditLogPage";

export function createAuditLogRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/audit-log",
    beforeLoad: () => {
      if (!useAuthStore.getState().hasPermission(PERMISSION_CODES.AUDIT_LOG_VIEW)) {
        throw redirect({ to: "/" });
      }
    },
    component: AuditLogPage,
  });
}
