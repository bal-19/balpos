import type { Request, Response } from "express";
import { ok } from "../../../shared/http/response.js";
import * as notificationService from "../service/notification.service.js";
import type { ListNotificationQuery } from "../schema/notification.schema.js";

export async function listNotifications(req: Request, res: Response) {
  const query = req.query as unknown as ListNotificationQuery;
  ok(res, await notificationService.listNotifications(req.user!.outletId, query));
}

export async function markRead(req: Request, res: Response) {
  await notificationService.markRead(req.params.id as string, req.user!.outletId);
  ok(res, { success: true });
}

export async function markAllRead(req: Request, res: Response) {
  await notificationService.markAllRead(req.user!.outletId);
  ok(res, { success: true });
}
