import { PERMISSION_CODES } from "@restaurant-pos/types";
import { Router } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { requireAuth } from "../../../shared/middlewares/require-auth.middleware.js";
import { requirePermission } from "../../../shared/middlewares/require-permission.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import * as reportController from "../controller/report.controller.js";
import { createExportSchema, listExportsQuerySchema, reportSummaryQuerySchema } from "../schema/report.schema.js";

export const reportRoutes = Router();

reportRoutes.use(requireAuth);

reportRoutes.get(
  "/summary",
  requirePermission(PERMISSION_CODES.REPORT_VIEW),
  validate(reportSummaryQuerySchema, "query"),
  asyncHandler(reportController.getSummary),
);

reportRoutes.post(
  "/export",
  requirePermission(PERMISSION_CODES.REPORT_MANAGE),
  validate(createExportSchema),
  asyncHandler(reportController.createExport),
);

reportRoutes.get(
  "/exports",
  requirePermission(PERMISSION_CODES.REPORT_VIEW),
  validate(listExportsQuerySchema, "query"),
  asyncHandler(reportController.listExports),
);

reportRoutes.get(
  "/exports/:id",
  requirePermission(PERMISSION_CODES.REPORT_VIEW),
  asyncHandler(reportController.getExport),
);
