import { type AnyRoute, createRoute } from "@tanstack/react-router";
import { PosPage } from "../components/PosPage";

export function createPosRoute(parentRoute: AnyRoute) {
  return createRoute({
    getParentRoute: () => parentRoute,
    path: "/pos",
    component: PosPage,
  });
}
