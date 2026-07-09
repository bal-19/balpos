import { PERMISSION_CODES } from "@restaurant-pos/types";
import { Router } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { requireAuth } from "../../../shared/middlewares/require-auth.middleware.js";
import { requirePermission } from "../../../shared/middlewares/require-permission.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import * as notificationController from "../controller/notification.controller.js";
import { listNotificationQuerySchema } from "../schema/notification.schema.js";

export const notificationRoutes = Router();

notificationRoutes.use(requireAuth, requirePermission(PERMISSION_CODES.NOTIFICATION_VIEW));

notificationRoutes.get(
  "/",
  validate(listNotificationQuerySchema, "query"),
  asyncHandler(notificationController.listNotifications),
);

notificationRoutes.patch("/:id/read", asyncHandler(notificationController.markRead));

notificationRoutes.patch("/read-all", asyncHandler(notificationController.markAllRead));
