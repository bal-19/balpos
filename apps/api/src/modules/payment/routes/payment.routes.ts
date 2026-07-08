import { Router } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import * as webhookController from "../controller/webhook.controller.js";

export const paymentRoutes = Router();

paymentRoutes.post("/webhook/xendit", asyncHandler(webhookController.handleXenditWebhook));
