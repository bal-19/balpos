import { PERMISSION_CODES } from "@restaurant-pos/types";
import { type AnyRoute, createRoute, redirect } from "@tanstack/react-router";
import { useAuthStore } from "../../../stores/auth.store";
import { ReservationTable } from "../components/ReservationTable";

export function createReservationRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/reservation",
    beforeLoad: () => {
      if (!useAuthStore.getState().hasPermission(PERMISSION_CODES.RESERVATION_VIEW)) {
        throw redirect({ to: "/" });
      }
    },
    component: ReservationTable,
  });
}
