import type { Request, Response } from "express";
import { ok } from "../../../shared/http/response.js";
import * as dashboardService from "../service/dashboard.service.js";
import type {
  ItemsPerformanceQuery,
  RecentTransactionsQuery,
  SalesStatisticQuery,
} from "../schema/dashboard.schema.js";

export async function getOverview(req: Request, res: Response) {
  ok(res, await dashboardService.getOverview(req.user!.outletId));
}

export async function getSalesStatistic(req: Request, res: Response) {
  const { range } = req.query as unknown as SalesStatisticQuery;
  ok(res, await dashboardService.getSalesStatistic(req.user!.outletId, range));
}

export async function getItemsPerformance(req: Request, res: Response) {
  const { limit } = req.query as unknown as ItemsPerformanceQuery;
  ok(res, await dashboardService.getItemsPerformance(req.user!.outletId, limit));
}

export async function getRecentTransactions(req: Request, res: Response) {
  const { limit } = req.query as unknown as RecentTransactionsQuery;
  ok(res, await dashboardService.getRecentTransactions(req.user!.outletId, limit));
}
