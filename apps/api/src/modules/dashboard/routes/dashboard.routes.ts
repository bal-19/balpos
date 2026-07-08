import { PERMISSION_CODES } from "@restaurant-pos/types";
import { Router } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { requireAuth } from "../../../shared/middlewares/require-auth.middleware.js";
import { requirePermission } from "../../../shared/middlewares/require-permission.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import * as dashboardController from "../controller/dashboard.controller.js";
import {
  itemsPerformanceQuerySchema,
  recentTransactionsQuerySchema,
  salesStatisticQuerySchema,
} from "../schema/dashboard.schema.js";

export const dashboardRoutes = Router();

dashboardRoutes.use(requireAuth, requirePermission(PERMISSION_CODES.DASHBOARD_VIEW));

dashboardRoutes.get("/overview", asyncHandler(dashboardController.getOverview));

dashboardRoutes.get(
  "/sales-statistic",
  validate(salesStatisticQuerySchema, "query"),
  asyncHandler(dashboardController.getSalesStatistic),
);

dashboardRoutes.get(
  "/items-performance",
  validate(itemsPerformanceQuerySchema, "query"),
  asyncHandler(dashboardController.getItemsPerformance),
);

dashboardRoutes.get(
  "/recent-transactions",
  validate(recentTransactionsQuerySchema, "query"),
  asyncHandler(dashboardController.getRecentTransactions),
);
