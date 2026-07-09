import { PERMISSION_CODES } from "@restaurant-pos/types";
import { type AnyRoute, createRoute, lazyRouteComponent, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/auth.store";
import { ReportLayout } from "../components/ReportLayout";

export function createReportRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/report",
    beforeLoad: () => {
      if (!useAuthStore.getState().hasPermission(PERMISSION_CODES.REPORT_VIEW)) {
        throw redirect({ to: "/" });
      }
    },
    component: ReportLayout,
  });
}

export function createReportIndexRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/",
    beforeLoad: () => {
      throw redirect({ to: "/report/summary" } as Parameters<typeof redirect>[0]);
    },
  });
}

export function createReportSummaryRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/summary",
    component: lazyRouteComponent(() =>
      import("../components/ReportSummaryPage").then((m) => ({ default: m.ReportSummaryPage })),
    ),
  });
}

export function createReportExportsRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/exports",
    component: lazyRouteComponent(() =>
      import("../components/ExportHistoryPage").then((m) => ({ default: m.ExportHistoryPage })),
    ),
  });
}
