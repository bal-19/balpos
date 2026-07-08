import type { Request, Response } from "express";
import { ok } from "../../../shared/http/response.js";
import * as recipeService from "../service/recipe.service.js";
import type { UpsertRecipeInput } from "../schema/recipe.schema.js";

export async function getRecipe(req: Request, res: Response) {
  ok(res, await recipeService.getProductRecipe(req.params.productId as string));
}

export async function upsertRecipe(req: Request, res: Response) {
  const input = req.body as UpsertRecipeInput;
  ok(res, await recipeService.upsertProductRecipe(req.params.productId as string, req.user!.outletId, input));
}
