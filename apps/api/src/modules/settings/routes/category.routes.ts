import { PERMISSION_CODES } from "@restaurant-pos/types";
import { Router } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { requireAuth } from "../../../shared/middlewares/require-auth.middleware.js";
import { requirePermission } from "../../../shared/middlewares/require-permission.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import * as categoryController from "../controller/category.controller.js";
import { createCategorySchema, updateCategorySchema } from "../schema/category.schema.js";

export const categoryRoutes = Router();

categoryRoutes.get(
  "/categories",
  requireAuth,
  requirePermission(PERMISSION_CODES.CATALOG_VIEW),
  asyncHandler(categoryController.listCategories),
);

categoryRoutes.post(
  "/categories",
  requireAuth,
  requirePermission(PERMISSION_CODES.CATALOG_MANAGE),
  validate(createCategorySchema),
  asyncHandler(categoryController.createCategory),
);

categoryRoutes.patch(
  "/categories/:id",
  requireAuth,
  requirePermission(PERMISSION_CODES.CATALOG_MANAGE),
  validate(updateCategorySchema),
  asyncHandler(categoryController.updateCategory),
);

categoryRoutes.delete(
  "/categories/:id",
  requireAuth,
  requirePermission(PERMISSION_CODES.CATALOG_MANAGE),
  asyncHandler(categoryController.deleteCategory),
);
