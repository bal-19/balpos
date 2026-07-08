import { PERMISSION_CODES } from "@restaurant-pos/types";
import { Router } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { requireAuth } from "../../../shared/middlewares/require-auth.middleware.js";
import { requirePermission } from "../../../shared/middlewares/require-permission.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import * as kitchenController from "../controller/kitchen.controller.js";
import { updateItemStatusSchema } from "../schema/kitchen.schema.js";

export const kitchenRoutes = Router();

kitchenRoutes.get(
  "/orders",
  requireAuth,
  requirePermission(PERMISSION_CODES.KITCHEN_VIEW),
  asyncHandler(kitchenController.listOrders),
);

kitchenRoutes.patch(
  "/order-items/:id/status",
  requireAuth,
  requirePermission(PERMISSION_CODES.KITCHEN_MANAGE),
  validate(updateItemStatusSchema),
  asyncHandler(kitchenController.updateItemStatus),
);
