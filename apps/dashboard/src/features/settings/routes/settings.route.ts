import { PERMISSION_CODES } from "@restaurant-pos/types";
import { type AnyRoute, createRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/auth.store";
import { CategoryTable } from "../components/CategoryTable";
import { GeneralSettingsForm } from "../components/GeneralSettingsForm";
import { ProductTable } from "../components/ProductTable";
import { SettingsLayout } from "../components/SettingsLayout";

export function createSettingsRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/settings",
    beforeLoad: () => {
      if (!useAuthStore.getState().hasPermission(PERMISSION_CODES.SETTINGS_VIEW)) {
        throw redirect({ to: "/" });
      }
    },
    component: SettingsLayout,
  });
}

export function createSettingsIndexRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/",
    beforeLoad: () => {
      // `parentRoute: AnyRoute` di factory ini mengaburkan inferensi search-params
      // TanStack Router untuk redirect lintas-route — cast dibutuhkan di titik ini saja.
      throw redirect({ to: "/settings/general" } as Parameters<typeof redirect>[0]);
    },
  });
}

export function createSettingsGeneralRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/general",
    component: GeneralSettingsForm,
  });
}

export function createCategoriesRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/categories",
    beforeLoad: () => {
      if (!useAuthStore.getState().hasPermission(PERMISSION_CODES.CATALOG_VIEW)) {
        throw redirect({ to: "/" });
      }
    },
    component: CategoryTable,
  });
}

export function createProductsRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/products",
    beforeLoad: () => {
      if (!useAuthStore.getState().hasPermission(PERMISSION_CODES.CATALOG_VIEW)) {
        throw redirect({ to: "/" });
      }
    },
    component: ProductTable,
  });
}
