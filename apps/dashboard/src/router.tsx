import { Outlet, createRootRoute, createRoute, createRouter, redirect } from "@tanstack/react-router";
import { createLoginRoute } from "./features/auth/routes/login.route";
import { createDashboardRoute } from "./features/dashboard/routes/dashboard.route";
import { createInventoryRoute } from "./features/inventory/routes/inventory.route";
import { createPosRoute } from "./features/pos/routes/pos.route";
import {
  createSettingsCategoriesRoute,
  createSettingsGeneralRoute,
  createSettingsIndexRoute,
  createSettingsProductsRoute,
  createSettingsRoute,
  createSettingsThemeRoute,
} from "./features/settings/routes/settings.route";
import {
  createPurchaseOrderListRoute,
  createSupplierIndexRoute,
  createSupplierListRoute,
  createSupplierRoute,
} from "./features/supplier/routes/supplier.route";
import { AuthenticatedLayout } from "./layouts/AuthenticatedLayout";
import { useAuthStore } from "./stores/auth.store";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const loginRoute = createLoginRoute(rootRoute);

const appLayoutRoute = createRoute({
  id: "app-layout",
  getParentRoute: () => rootRoute,
  beforeLoad: () => {
    if (!useAuthStore.getState().isAuthenticated) {
      throw redirect({ to: "/login" });
    }
  },
  component: AuthenticatedLayout,
});

const dashboardRoute = createDashboardRoute(appLayoutRoute);
const posRoute = createPosRoute(appLayoutRoute);
const inventoryRoute = createInventoryRoute(appLayoutRoute);

const settingsRoute = createSettingsRoute(appLayoutRoute);
const settingsIndexRoute = createSettingsIndexRoute(settingsRoute);
const settingsGeneralRoute = createSettingsGeneralRoute(settingsRoute);
const settingsThemeRoute = createSettingsThemeRoute(settingsRoute);
const settingsCategoriesRoute = createSettingsCategoriesRoute(settingsRoute);
const settingsProductsRoute = createSettingsProductsRoute(settingsRoute);

const supplierRoute = createSupplierRoute(appLayoutRoute);
const supplierIndexRoute = createSupplierIndexRoute(supplierRoute);
const supplierListRoute = createSupplierListRoute(supplierRoute);
const purchaseOrderListRoute = createPurchaseOrderListRoute(supplierRoute);

const routeTree = rootRoute.addChildren([
  loginRoute,
  appLayoutRoute.addChildren([
    dashboardRoute,
    posRoute,
    inventoryRoute,
    settingsRoute.addChildren([
      settingsIndexRoute,
      settingsGeneralRoute,
      settingsThemeRoute,
      settingsCategoriesRoute,
      settingsProductsRoute,
    ]),
    supplierRoute.addChildren([supplierIndexRoute, supplierListRoute, purchaseOrderListRoute]),
  ]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
