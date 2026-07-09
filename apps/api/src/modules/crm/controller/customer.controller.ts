import type { Request, Response } from "express";
import { ok } from "../../../shared/http/response.js";
import * as customerService from "../service/customer.service.js";
import { listPointHistories } from "../service/point.service.js";
import type { CreateCustomerInput, UpdateCustomerInput } from "../schema/customer.schema.js";

export async function listCustomers(req: Request, res: Response) {
  ok(res, await customerService.listCustomers(req.user!.outletId));
}

export async function getCustomer(req: Request, res: Response) {
  ok(res, await customerService.getCustomer(req.params.id as string, req.user!.outletId));
}

export async function createCustomer(req: Request, res: Response) {
  const input = req.body as CreateCustomerInput;
  ok(res, await customerService.createOutletCustomer(req.user!.outletId, input), 201);
}

export async function updateCustomer(req: Request, res: Response) {
  const input = req.body as UpdateCustomerInput;
  ok(res, await customerService.updateOutletCustomer(req.params.id as string, req.user!.outletId, input));
}

export async function deleteCustomer(req: Request, res: Response) {
  await customerService.deleteOutletCustomer(req.params.id as string, req.user!.outletId);
  ok(res, { success: true });
}

export async function getCustomerPoints(req: Request, res: Response) {
  await customerService.getCustomer(req.params.id as string, req.user!.outletId);
  ok(res, await listPointHistories(req.params.id as string));
}
