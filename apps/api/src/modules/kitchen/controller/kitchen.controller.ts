import type { Request, Response } from "express";
import { ok } from "../../../shared/http/response.js";
import * as kitchenService from "../service/kitchen.service.js";
import type { UpdateItemStatusInput } from "../schema/kitchen.schema.js";

export async function listOrders(req: Request, res: Response) {
  ok(res, await kitchenService.listActiveOrders(req.user!.outletId));
}

export async function updateItemStatus(req: Request, res: Response) {
  const { status } = req.body as UpdateItemStatusInput;
  ok(res, await kitchenService.updateItemStatus(req.params.id as string, status));
}
