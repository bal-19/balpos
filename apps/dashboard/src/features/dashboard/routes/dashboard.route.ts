import { type AnyRoute, createRoute, lazyRouteComponent } from "@tanstack/react-router";

export function createDashboardRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/",
    component: lazyRouteComponent(() =>
      import("../components/DashboardOverviewPage").then((m) => ({ default: m.DashboardOverviewPage })),
    ),
  });
}
