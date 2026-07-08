import { PERMISSION_CODES } from "@restaurant-pos/types";
import { type AnyRoute, createRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/auth.store";
import { StockItemTable } from "../components/StockItemTable";

export function createInventoryRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/inventory",
    beforeLoad: () => {
      if (!useAuthStore.getState().hasPermission(PERMISSION_CODES.INVENTORY_VIEW)) {
        throw redirect({ to: "/" });
      }
    },
    component: StockItemTable,
  });
}
