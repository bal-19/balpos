import type { Request, Response } from "express";
import { ok } from "../../../shared/http/response.js";
import * as purchaseOrderService from "../service/purchase-order.service.js";
import type { CreatePurchaseOrderInput } from "../schema/purchase-order.schema.js";

export async function listPurchaseOrders(req: Request, res: Response) {
  ok(res, await purchaseOrderService.listPurchaseOrders(req.user!.outletId));
}

export async function getPurchaseOrder(req: Request, res: Response) {
  ok(res, await purchaseOrderService.getPurchaseOrder(req.params.id as string, req.user!.outletId));
}

export async function createPurchaseOrder(req: Request, res: Response) {
  const input = req.body as CreatePurchaseOrderInput;
  ok(res, await purchaseOrderService.createOutletPurchaseOrder(req.user!.outletId, input), 201);
}

export async function receivePurchaseOrder(req: Request, res: Response) {
  ok(res, await purchaseOrderService.receivePurchaseOrder(req.params.id as string, req.user!.outletId));
}
