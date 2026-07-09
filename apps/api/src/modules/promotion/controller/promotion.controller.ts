import type { Request, Response } from "express";
import { ok } from "../../../shared/http/response.js";
import * as promotionService from "../service/promotion.service.js";
import type { CreatePromotionInput, UpdatePromotionInput } from "../schema/promotion.schema.js";

export async function listPromotions(req: Request, res: Response) {
  ok(res, await promotionService.listPromotions(req.user!.outletId));
}

export async function createPromotion(req: Request, res: Response) {
  const input = req.body as CreatePromotionInput;
  ok(res, await promotionService.createOutletPromotion(req.user!.outletId, input), 201);
}

export async function updatePromotion(req: Request, res: Response) {
  const input = req.body as UpdatePromotionInput;
  ok(res, await promotionService.updateOutletPromotion(req.params.id as string, req.user!.outletId, input));
}

export async function deletePromotion(req: Request, res: Response) {
  await promotionService.deleteOutletPromotion(req.params.id as string, req.user!.outletId);
  ok(res, { success: true });
}
