import { PERMISSION_CODES } from "@restaurant-pos/types";
import { type AnyRoute, createRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/auth.store";
import { CategoryTable } from "../components/CategoryTable";
import { GeneralSettingsForm } from "../components/GeneralSettingsForm";
import { ProductTable } from "../components/ProductTable";
import { SettingsLayout } from "../components/SettingsLayout";
import { ThemeColorPicker } from "../components/ThemeColorPicker";

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

export function createSettingsThemeRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/theme",
    component: ThemeColorPicker,
  });
}

export function createSettingsCategoriesRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/categories",
    component: CategoryTable,
  });
}

export function createSettingsProductsRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/products",
    component: ProductTable,
  });
}
