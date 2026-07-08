import { PERMISSION_CODES } from "@restaurant-pos/types";
import { Router } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { requireAuth } from "../../../shared/middlewares/require-auth.middleware.js";
import { requirePermission } from "../../../shared/middlewares/require-permission.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import * as recipeController from "../controller/recipe.controller.js";
import { upsertRecipeSchema } from "../schema/recipe.schema.js";

export const recipeRoutes = Router();

recipeRoutes.get(
  "/products/:productId",
  requireAuth,
  requirePermission(PERMISSION_CODES.RECIPE_VIEW),
  asyncHandler(recipeController.getRecipe),
);

recipeRoutes.put(
  "/products/:productId",
  requireAuth,
  requirePermission(PERMISSION_CODES.RECIPE_MANAGE),
  validate(upsertRecipeSchema),
  asyncHandler(recipeController.upsertRecipe),
);
