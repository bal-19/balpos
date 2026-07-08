import { PERMISSION_CODES } from "@restaurant-pos/types";
import { Router } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { requireAuth } from "../../../shared/middlewares/require-auth.middleware.js";
import { requirePermission } from "../../../shared/middlewares/require-permission.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import * as productController from "../controller/product.controller.js";
import {
  createProductSchema,
  listProductsQuerySchema,
  updateProductSchema,
} from "../schema/product.schema.js";

export const productRoutes = Router();

productRoutes.get(
  "/products",
  requireAuth,
  requirePermission(PERMISSION_CODES.CATALOG_VIEW),
  validate(listProductsQuerySchema, "query"),
  asyncHandler(productController.listProducts),
);

productRoutes.post(
  "/products",
  requireAuth,
  requirePermission(PERMISSION_CODES.CATALOG_MANAGE),
  validate(createProductSchema),
  asyncHandler(productController.createProduct),
);

productRoutes.patch(
  "/products/:id",
  requireAuth,
  requirePermission(PERMISSION_CODES.CATALOG_MANAGE),
  validate(updateProductSchema),
  asyncHandler(productController.updateProduct),
);

productRoutes.delete(
  "/products/:id",
  requireAuth,
  requirePermission(PERMISSION_CODES.CATALOG_MANAGE),
  asyncHandler(productController.deleteProduct),
);
