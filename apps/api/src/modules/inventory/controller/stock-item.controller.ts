import type { Request, Response } from "express";
import { ok } from "../../../shared/http/response.js";
import * as stockService from "../service/stock.service.js";
import type { AdjustStockInput, CreateStockItemInput, UpdateStockItemInput } from "../schema/stock-item.schema.js";

export async function listStockItems(req: Request, res: Response) {
  ok(res, await stockService.listStockItems(req.user!.outletId));
}

export async function createStockItem(req: Request, res: Response) {
  const input = req.body as CreateStockItemInput;
  ok(res, await stockService.createOutletStockItem(req.user!.outletId, input), 201);
}

export async function updateStockItem(req: Request, res: Response) {
  const input = req.body as UpdateStockItemInput;
  ok(res, await stockService.updateOutletStockItem(req.params.id as string, req.user!.outletId, input));
}

export async function adjustStock(req: Request, res: Response) {
  const input = req.body as AdjustStockInput;
  ok(res, await stockService.adjustOutletStock(req.params.id as string, req.user!.outletId, input));
}
