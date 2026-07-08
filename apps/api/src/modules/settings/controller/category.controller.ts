import type { Request, Response } from "express";
import { ok } from "../../../shared/http/response.js";
import * as categoryService from "../service/category.service.js";
import type { CreateCategoryInput, UpdateCategoryInput } from "../schema/category.schema.js";

export async function listCategories(req: Request, res: Response) {
  ok(res, await categoryService.listCategories(req.user!.outletId));
}

export async function createCategory(req: Request, res: Response) {
  const input = req.body as CreateCategoryInput;
  ok(res, await categoryService.createOutletCategory(req.user!.outletId, input), 201);
}

export async function updateCategory(req: Request, res: Response) {
  const input = req.body as UpdateCategoryInput;
  ok(res, await categoryService.updateOutletCategory(req.params.id as string, req.user!.outletId, input));
}

export async function deleteCategory(req: Request, res: Response) {
  await categoryService.deleteOutletCategory(req.params.id as string, req.user!.outletId);
  ok(res, { success: true });
}
