import { PERMISSION_CODES } from "@restaurant-pos/types";
import { type AnyRoute, createRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/auth.store";
import { PromotionTable } from "../components/PromotionTable";

export function createPromotionRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/promotion",
    beforeLoad: () => {
      if (!useAuthStore.getState().hasPermission(PERMISSION_CODES.PROMOTION_VIEW)) {
        throw redirect({ to: "/" });
      }
    },
    component: PromotionTable,
  });
}
