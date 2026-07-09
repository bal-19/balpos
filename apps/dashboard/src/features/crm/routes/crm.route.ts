import { PERMISSION_CODES } from "@restaurant-pos/types";
import { type AnyRoute, createRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/auth.store";
import { CrmLayout } from "../components/CrmLayout";
import { CustomerTable } from "../components/CustomerTable";
import { MembershipTierTable } from "../components/MembershipTierTable";

export function createCrmRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/crm",
    beforeLoad: () => {
      if (!useAuthStore.getState().hasPermission(PERMISSION_CODES.CRM_VIEW)) {
        throw redirect({ to: "/" });
      }
    },
    component: CrmLayout,
  });
}

export function createCrmIndexRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/",
    beforeLoad: () => {
      throw redirect({ to: "/crm/customers" } as Parameters<typeof redirect>[0]);
    },
  });
}

export function createCustomerListRoute(parentRoute: AnyRoute) {
  return createRoute({ getParentRoute: () => parentRoute, path: "/customers", component: CustomerTable });
}

export function createMembershipTierListRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/membership-tiers",
    component: MembershipTierTable,
  });
}
