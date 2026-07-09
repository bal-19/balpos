import { PERMISSION_CODES } from "@restaurant-pos/types";
import { Router } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { requireAuth } from "../../../shared/middlewares/require-auth.middleware.js";
import { requirePermission } from "../../../shared/middlewares/require-permission.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import * as auditLogController from "../controller/audit-log.controller.js";
import { listAuditLogQuerySchema } from "../schema/audit-log.schema.js";

export const auditLogRoutes = Router();

auditLogRoutes.use(requireAuth, requirePermission(PERMISSION_CODES.AUDIT_LOG_VIEW));

auditLogRoutes.get("/", validate(listAuditLogQuerySchema, "query"), asyncHandler(auditLogController.listAuditLogs));
