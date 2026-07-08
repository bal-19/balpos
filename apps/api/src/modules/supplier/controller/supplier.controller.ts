import type { Request, Response } from "express";
import { ok } from "../../../shared/http/response.js";
import * as supplierService from "../service/supplier.service.js";
import type { CreateSupplierInput, UpdateSupplierInput } from "../schema/supplier.schema.js";

export async function listSuppliers(req: Request, res: Response) {
  ok(res, await supplierService.listSuppliers(req.user!.outletId));
}

export async function createSupplier(req: Request, res: Response) {
  const input = req.body as CreateSupplierInput;
  ok(res, await supplierService.createOutletSupplier(req.user!.outletId, input), 201);
}

export async function updateSupplier(req: Request, res: Response) {
  const input = req.body as UpdateSupplierInput;
  ok(res, await supplierService.updateOutletSupplier(req.params.id as string, req.user!.outletId, input));
}

export async function deleteSupplier(req: Request, res: Response) {
  await supplierService.deleteOutletSupplier(req.params.id as string, req.user!.outletId);
  ok(res, { success: true });
}
