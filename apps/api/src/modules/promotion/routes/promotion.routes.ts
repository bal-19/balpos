import { PERMISSION_CODES } from "@restaurant-pos/types";
import { Router } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { requireAuth } from "../../../shared/middlewares/require-auth.middleware.js";
import { requirePermission } from "../../../shared/middlewares/require-permission.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import * as promotionController from "../controller/promotion.controller.js";
import { createPromotionSchema, updatePromotionSchema } from "../schema/promotion.schema.js";

export const promotionRoutes = Router();

promotionRoutes.use(requireAuth);

promotionRoutes.get(
  "/promotions",
  requirePermission(PERMISSION_CODES.PROMOTION_VIEW),
  asyncHandler(promotionController.listPromotions),
);
promotionRoutes.post(
  "/promotions",
  requirePermission(PERMISSION_CODES.PROMOTION_MANAGE),
  validate(createPromotionSchema),
  asyncHandler(promotionController.createPromotion),
);
promotionRoutes.patch(
  "/promotions/:id",
  requirePermission(PERMISSION_CODES.PROMOTION_MANAGE),
  validate(updatePromotionSchema),
  asyncHandler(promotionController.updatePromotion),
);
promotionRoutes.delete(
  "/promotions/:id",
  requirePermission(PERMISSION_CODES.PROMOTION_MANAGE),
  asyncHandler(promotionController.deletePromotion),
);
