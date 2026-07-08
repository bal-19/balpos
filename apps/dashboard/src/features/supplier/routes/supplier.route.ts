import { PERMISSION_CODES } from "@restaurant-pos/types";
import { type AnyRoute, createRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/auth.store";
import { PurchaseOrderList } from "../components/PurchaseOrderList";
import { SupplierLayout } from "../components/SupplierLayout";
import { SupplierTable } from "../components/SupplierTable";

export function createSupplierRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/supplier",
    beforeLoad: () => {
      if (!useAuthStore.getState().hasPermission(PERMISSION_CODES.SUPPLIER_VIEW)) {
        throw redirect({ to: "/" });
      }
    },
    component: SupplierLayout,
  });
}

export function createSupplierIndexRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/",
    beforeLoad: () => {
      // Sama seperti createSettingsIndexRoute — parentRoute: AnyRoute mengaburkan
      // inferensi search-params TanStack Router untuk redirect lintas-route.
      throw redirect({ to: "/supplier/suppliers" } as Parameters<typeof redirect>[0]);
    },
  });
}

export function createSupplierListRoute(parentRoute: AnyRoute) {
  return createRoute({ getParentRoute: () => parentRoute, path: "/suppliers", component: SupplierTable });
}

export function createPurchaseOrderListRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/purchase-orders",
    component: PurchaseOrderList,
  });
}
