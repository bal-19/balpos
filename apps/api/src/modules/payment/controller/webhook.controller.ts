import type { Request, Response } from "express";
import { env } from "../../../config/env.js";
import { UnauthorizedError } from "../../../shared/errors/app-error.js";
import { ok } from "../../../shared/http/response.js";
import * as paymentService from "../service/payment.service.js";

export async function handleXenditWebhook(req: Request, res: Response) {
  const token = req.headers["x-callback-token"];
  if (!env.XENDIT_WEBHOOK_TOKEN || token !== env.XENDIT_WEBHOOK_TOKEN) {
    throw new UnauthorizedError("Webhook token tidak valid");
  }

  const { id, status } = req.body as { id: string; status: string };
  await paymentService.settlePaymentByReference(id, status);

  ok(res, { received: true });
}
