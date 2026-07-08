import { PERMISSION_CODES } from "@restaurant-pos/types";
import { Router } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { requireAuth } from "../../../shared/middlewares/require-auth.middleware.js";
import { requirePermission } from "../../../shared/middlewares/require-permission.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import * as stockItemController from "../controller/stock-item.controller.js";
import { adjustStockSchema, createStockItemSchema, updateStockItemSchema } from "../schema/stock-item.schema.js";

export const inventoryRoutes = Router();

inventoryRoutes.get(
  "/stock-items",
  requireAuth,
  requirePermission(PERMISSION_CODES.INVENTORY_VIEW),
  asyncHandler(stockItemController.listStockItems),
);

inventoryRoutes.post(
  "/stock-items",
  requireAuth,
  requirePermission(PERMISSION_CODES.INVENTORY_MANAGE),
  validate(createStockItemSchema),
  asyncHandler(stockItemController.createStockItem),
);

inventoryRoutes.patch(
  "/stock-items/:id",
  requireAuth,
  requirePermission(PERMISSION_CODES.INVENTORY_MANAGE),
  validate(updateStockItemSchema),
  asyncHandler(stockItemController.updateStockItem),
);

inventoryRoutes.post(
  "/stock-items/:id/adjust",
  requireAuth,
  requirePermission(PERMISSION_CODES.INVENTORY_MANAGE),
  validate(adjustStockSchema),
  asyncHandler(stockItemController.adjustStock),
);
