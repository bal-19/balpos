import { PERMISSION_CODES } from "@restaurant-pos/types";
import { type AnyRoute, createRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/auth.store";
import { ExportHistoryPage } from "../components/ExportHistoryPage";
import { ReportLayout } from "../components/ReportLayout";
import { ReportSummaryPage } from "../components/ReportSummaryPage";

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
  return createRoute({ getParentRoute: () => parentRoute, path: "/summary", component: ReportSummaryPage });
}

export function createReportExportsRoute(parentRoute: AnyRoute) {
  return createRoute({ getParentRoute: () => parentRoute, path: "/exports", component: ExportHistoryPage });
}
