import { PERMISSION_CODES } from "@restaurant-pos/types";
import { Router } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { requireAuth } from "../../../shared/middlewares/require-auth.middleware.js";
import { requirePermission } from "../../../shared/middlewares/require-permission.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import * as purchaseOrderController from "../controller/purchase-order.controller.js";
import * as supplierController from "../controller/supplier.controller.js";
import { createPurchaseOrderSchema } from "../schema/purchase-order.schema.js";
import { createSupplierSchema, updateSupplierSchema } from "../schema/supplier.schema.js";

export const supplierRoutes = Router();

supplierRoutes.use(requireAuth);

supplierRoutes.get(
  "/suppliers",
  requirePermission(PERMISSION_CODES.SUPPLIER_VIEW),
  asyncHandler(supplierController.listSuppliers),
);
supplierRoutes.post(
  "/suppliers",
  requirePermission(PERMISSION_CODES.SUPPLIER_MANAGE),
  validate(createSupplierSchema),
  asyncHandler(supplierController.createSupplier),
);
supplierRoutes.patch(
  "/suppliers/:id",
  requirePermission(PERMISSION_CODES.SUPPLIER_MANAGE),
  validate(updateSupplierSchema),
  asyncHandler(supplierController.updateSupplier),
);
supplierRoutes.delete(
  "/suppliers/:id",
  requirePermission(PERMISSION_CODES.SUPPLIER_MANAGE),
  asyncHandler(supplierController.deleteSupplier),
);

supplierRoutes.get(
  "/purchase-orders",
  requirePermission(PERMISSION_CODES.SUPPLIER_VIEW),
  asyncHandler(purchaseOrderController.listPurchaseOrders),
);
supplierRoutes.get(
  "/purchase-orders/:id",
  requirePermission(PERMISSION_CODES.SUPPLIER_VIEW),
  asyncHandler(purchaseOrderController.getPurchaseOrder),
);
supplierRoutes.post(
  "/purchase-orders",
  requirePermission(PERMISSION_CODES.SUPPLIER_MANAGE),
  validate(createPurchaseOrderSchema),
  asyncHandler(purchaseOrderController.createPurchaseOrder),
);
supplierRoutes.patch(
  "/purchase-orders/:id/receive",
  requirePermission(PERMISSION_CODES.SUPPLIER_MANAGE),
  asyncHandler(purchaseOrderController.receivePurchaseOrder),
);
