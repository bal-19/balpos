import { PERMISSION_CODES } from "@restaurant-pos/types";
import { Router } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { requireAuth } from "../../../shared/middlewares/require-auth.middleware.js";
import { requirePermission } from "../../../shared/middlewares/require-permission.middleware.js";
import * as tableController from "../controller/table.controller.js";

export const tableRoutes = Router();

tableRoutes.get(
  "/tables",
  requireAuth,
  requirePermission(PERMISSION_CODES.POS_TABLE_VIEW),
  asyncHandler(tableController.listTables),
);
