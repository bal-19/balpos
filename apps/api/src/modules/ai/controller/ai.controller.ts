import type { Request, Response } from "express";
import { ok } from "../../../shared/http/response.js";
import * as aiService from "../service/ai.service.js";
import type { GenerateInsightInput, ListInsightsQuery } from "../schema/ai.schema.js";

export async function generateInsight(req: Request, res: Response) {
  const input = req.body as GenerateInsightInput;
  const result = await aiService.requestInsight(req.user!.outletId, req.user!.tenantId, req.user!.sub, input);
  if ("cached" in result) {
    ok(res, result.cached, 200);
    return;
  }
  ok(res, result, 202);
}

export async function listInsights(req: Request, res: Response) {
  const query = req.query as unknown as ListInsightsQuery;
  ok(res, await aiService.listOutletInsights(req.user!.outletId, query));
}
