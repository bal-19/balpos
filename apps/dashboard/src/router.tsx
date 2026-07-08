import { Outlet, createRootRoute, createRoute, createRouter, redirect } from "@tanstack/react-router";
import { createLoginRoute } from "./features/auth/routes/login.route";
import { createDashboardRoute } from "./features/dashboard/routes/dashboard.route";
import { createPosRoute } from "./features/pos/routes/pos.route";
import {
  createSettingsCategoriesRoute,
  createSettingsGeneralRoute,
  createSettingsIndexRoute,
  createSettingsProductsRoute,
  createSettingsRoute,
  createSettingsThemeRoute,
} from "./features/settings/routes/settings.route";
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

const settingsRoute = createSettingsRoute(appLayoutRoute);
const settingsIndexRoute = createSettingsIndexRoute(settingsRoute);
const settingsGeneralRoute = createSettingsGeneralRoute(settingsRoute);
const settingsThemeRoute = createSettingsThemeRoute(settingsRoute);
const settingsCategoriesRoute = createSettingsCategoriesRoute(settingsRoute);
const settingsProductsRoute = createSettingsProductsRoute(settingsRoute);

const routeTree = rootRoute.addChildren([
  loginRoute,
  appLayoutRoute.addChildren([
    dashboardRoute,
    posRoute,
    settingsRoute.addChildren([
      settingsIndexRoute,
      settingsGeneralRoute,
      settingsThemeRoute,
      settingsCategoriesRoute,
      settingsProductsRoute,
    ]),
  ]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
