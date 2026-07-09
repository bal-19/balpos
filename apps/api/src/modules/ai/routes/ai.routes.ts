import { PERMISSION_CODES } from "@restaurant-pos/types";
import { Router } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { requireAuth } from "../../../shared/middlewares/require-auth.middleware.js";
import { requirePermission } from "../../../shared/middlewares/require-permission.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import * as aiController from "../controller/ai.controller.js";
import { generateInsightSchema, listInsightsQuerySchema } from "../schema/ai.schema.js";

export const aiRoutes = Router();

aiRoutes.use(requireAuth);

aiRoutes.get(
  "/insights",
  requirePermission(PERMISSION_CODES.ANALYTICS_VIEW),
  validate(listInsightsQuerySchema, "query"),
  asyncHandler(aiController.listInsights),
);

aiRoutes.post(
  "/insights",
  requirePermission(PERMISSION_CODES.ANALYTICS_MANAGE),
  validate(generateInsightSchema),
  asyncHandler(aiController.generateInsight),
);
