import { Router } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import * as orderingController from "../controller/ordering.controller.js";
import { createPublicOrderSchema } from "../schema/ordering.schema.js";

export const orderingRoutes = Router();

orderingRoutes.get("/context/:tableId", asyncHandler(orderingController.getContext));
orderingRoutes.post(
  "/orders/:tableId",
  validate(createPublicOrderSchema),
  asyncHandler(orderingController.createOrder),
);
orderingRoutes.get("/orders/:orderId/status", asyncHandler(orderingController.getOrderStatus));
