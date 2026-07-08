import type { Request, Response } from "express";
import { ok } from "../../../shared/http/response.js";
import * as productService from "../service/product.service.js";
import type { CreateProductInput, ListProductsQuery, UpdateProductInput } from "../schema/product.schema.js";

export async function listProducts(req: Request, res: Response) {
  const { categoryId } = req.query as unknown as ListProductsQuery;
  ok(res, await productService.listProducts(req.user!.outletId, categoryId));
}

export async function createProduct(req: Request, res: Response) {
  const input = req.body as CreateProductInput;
  ok(res, await productService.createOutletProduct(req.user!.outletId, input), 201);
}

export async function updateProduct(req: Request, res: Response) {
  const input = req.body as UpdateProductInput;
  ok(res, await productService.updateOutletProduct(req.params.id as string, req.user!.outletId, input));
}

export async function deleteProduct(req: Request, res: Response) {
  await productService.deleteOutletProduct(req.params.id as string, req.user!.outletId);
  ok(res, { success: true });
}
