import { PERMISSION_CODES } from "@restaurant-pos/types";
import { Router } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { requireAuth } from "../../../shared/middlewares/require-auth.middleware.js";
import { requirePermission } from "../../../shared/middlewares/require-permission.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import * as orderController from "../controller/order.controller.js";
import { createOrderSchema } from "../schema/order.schema.js";

export const orderRoutes = Router();

orderRoutes.post(
  "/orders",
  requireAuth,
  requirePermission(PERMISSION_CODES.POS_ORDER_CREATE),
  validate(createOrderSchema),
  asyncHandler(orderController.createOrder),
);
