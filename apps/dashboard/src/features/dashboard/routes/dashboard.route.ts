import { type AnyRoute, createRoute } from "@tanstack/react-router";
import { DashboardOverviewPage } from "../components/DashboardOverviewPage";

export function createDashboardRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/",
    component: DashboardOverviewPage,
  });
}
