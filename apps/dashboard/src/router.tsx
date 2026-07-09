import { Outlet, createRootRoute, createRoute, createRouter, redirect } from "@tanstack/react-router";
import { createAnalyticsRoute } from "./features/analytics/routes/analytics.route";
import { createAuditLogRoute } from "./features/audit-log/routes/audit-log.route";
import { createLoginRoute } from "./features/auth/routes/login.route";
import {
  createCrmIndexRoute,
  createCrmRoute,
  createCustomerListRoute,
  createMembershipTierListRoute,
} from "./features/crm/routes/crm.route";
import { createDashboardRoute } from "./features/dashboard/routes/dashboard.route";
import { createInventoryRoute } from "./features/inventory/routes/inventory.route";
import { createPosRoute } from "./features/pos/routes/pos.route";
import { createPromotionRoute } from "./features/promotion/routes/promotion.route";
import {
  createReportExportsRoute,
  createReportIndexRoute,
  createReportRoute,
  createReportSummaryRoute,
} from "./features/report/routes/report.route";
import { createReservationRoute } from "./features/reservation/routes/reservation.route";
import {
  createSettingsCategoriesRoute,
  createSettingsGeneralRoute,
  createSettingsIndexRoute,
  createSettingsProductsRoute,
  createSettingsRoute,
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
const settingsCategoriesRoute = createSettingsCategoriesRoute(settingsRoute);
const settingsProductsRoute = createSettingsProductsRoute(settingsRoute);

const supplierRoute = createSupplierRoute(appLayoutRoute);
const supplierIndexRoute = createSupplierIndexRoute(supplierRoute);
const supplierListRoute = createSupplierListRoute(supplierRoute);
const purchaseOrderListRoute = createPurchaseOrderListRoute(supplierRoute);

const crmRoute = createCrmRoute(appLayoutRoute);
const crmIndexRoute = createCrmIndexRoute(crmRoute);
const customerListRoute = createCustomerListRoute(crmRoute);
const membershipTierListRoute = createMembershipTierListRoute(crmRoute);

const promotionRoute = createPromotionRoute(appLayoutRoute);
const reservationRoute = createReservationRoute(appLayoutRoute);

const reportRoute = createReportRoute(appLayoutRoute);
const reportIndexRoute = createReportIndexRoute(reportRoute);
const reportSummaryRoute = createReportSummaryRoute(reportRoute);
const reportExportsRoute = createReportExportsRoute(reportRoute);

const auditLogRoute = createAuditLogRoute(appLayoutRoute);
const analyticsRoute = createAnalyticsRoute(appLayoutRoute);

const routeTree = rootRoute.addChildren([
  loginRoute,
  appLayoutRoute.addChildren([
    dashboardRoute,
    posRoute,
    inventoryRoute,
    settingsRoute.addChildren([
      settingsIndexRoute,
      settingsGeneralRoute,
      settingsCategoriesRoute,
      settingsProductsRoute,
    ]),
    supplierRoute.addChildren([supplierIndexRoute, supplierListRoute, purchaseOrderListRoute]),
    crmRoute.addChildren([crmIndexRoute, customerListRoute, membershipTierListRoute]),
    promotionRoute,
    reservationRoute,
    reportRoute.addChildren([reportIndexRoute, reportSummaryRoute, reportExportsRoute]),
    auditLogRoute,
    analyticsRoute,
  ]),
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
