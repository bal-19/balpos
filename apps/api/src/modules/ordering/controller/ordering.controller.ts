import type { Request, Response } from "express";
import { ok } from "../../../shared/http/response.js";
import * as orderingService from "../service/ordering.service.js";
import type { CreatePublicOrderInput } from "../schema/ordering.schema.js";

export async function getContext(req: Request, res: Response) {
  ok(res, await orderingService.getOrderingContext(req.params.tableId as string));
}

export async function createOrder(req: Request, res: Response) {
  const input = req.body as CreatePublicOrderInput;
  const order = await orderingService.createPublicOrder(req.params.tableId as string, input);
  ok(res, order, 201);
}

export async function getOrderStatus(req: Request, res: Response) {
  ok(res, await orderingService.getPublicOrderStatus(req.params.orderId as string));
}
