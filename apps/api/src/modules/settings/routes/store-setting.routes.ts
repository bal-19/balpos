import { PERMISSION_CODES } from "@restaurant-pos/types";
import { Router } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { requireAuth } from "../../../shared/middlewares/require-auth.middleware.js";
import { requirePermission } from "../../../shared/middlewares/require-permission.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import * as storeSettingController from "../controller/store-setting.controller.js";
import { updateStoreSettingSchema } from "../schema/store-setting.schema.js";

export const storeSettingRoutes = Router();

storeSettingRoutes.get("/theme", asyncHandler(storeSettingController.getPublicTheme));
storeSettingRoutes.get("/public", asyncHandler(storeSettingController.getPublicOutletInfo));

storeSettingRoutes.get(
  "/store",
  requireAuth,
  requirePermission(PERMISSION_CODES.SETTINGS_VIEW),
  asyncHandler(storeSettingController.getStoreSetting),
);

storeSettingRoutes.put(
  "/store",
  requireAuth,
  requirePermission(PERMISSION_CODES.SETTINGS_MANAGE),
  validate(updateStoreSettingSchema),
  asyncHandler(storeSettingController.updateStoreSetting),
);
