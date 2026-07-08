import type { Request, Response } from "express";
import { ok } from "../../../shared/http/response.js";
import * as orderService from "../service/order.service.js";
import type { CreateOrderInput } from "../schema/order.schema.js";

export async function createOrder(req: Request, res: Response) {
  const input = req.body as CreateOrderInput;
  const order = await orderService.createOrder(req.user!.outletId, req.user!.sub, input);
  ok(res, order, 201);
}
