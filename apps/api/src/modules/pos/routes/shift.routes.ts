import { PERMISSION_CODES } from "@restaurant-pos/types";
import { Router } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { requireAuth } from "../../../shared/middlewares/require-auth.middleware.js";
import { requirePermission } from "../../../shared/middlewares/require-permission.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import * as shiftController from "../controller/shift.controller.js";
import { closeShiftSchema, openShiftSchema } from "../schema/shift.schema.js";

export const shiftRoutes = Router();

shiftRoutes.use(requireAuth);

shiftRoutes.get(
    "/shifts/current",
    requirePermission(PERMISSION_CODES.POS_SHIFT_VIEW),
    asyncHandler(shiftController.getCurrentShift),
);

shiftRoutes.get(
    "/shifts/history",
    requirePermission(PERMISSION_CODES.POS_SHIFT_VIEW),
    asyncHandler(shiftController.getShiftHistory),
);

shiftRoutes.get(
    "/shifts/:id",
    requirePermission(PERMISSION_CODES.POS_SHIFT_VIEW),
    asyncHandler(shiftController.getShiftById),
);

shiftRoutes.post(
    "/shifts/open",
    requirePermission(PERMISSION_CODES.POS_SHIFT_MANAGE),
    validate(openShiftSchema),
    asyncHandler(shiftController.openShift),
);

shiftRoutes.post(
    "/shifts/close",
    requirePermission(PERMISSION_CODES.POS_SHIFT_MANAGE),
    validate(closeShiftSchema),
    asyncHandler(shiftController.closeShift),
);
