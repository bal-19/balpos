import type { Notification } from "@prisma/client";
import type {
  Notification as NotificationDto,
  NotificationListResponse,
  NotificationType,
} from "@restaurant-pos/types";
import { getIO } from "../../../core/socket.js";
import {
  countNotifications,
  countUnread,
  createNotification,
  findManyNotifications,
  markAllAsRead,
  markAsRead,
} from "../repository/notification.repository.js";
import type { ListNotificationQuery } from "../schema/notification.schema.js";

function toDto(notification: Notification): NotificationDto {
  return {
    id: notification.id,
    outletId: notification.outletId,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    referenceType: notification.referenceType,
    referenceId: notification.referenceId,
    isRead: notification.isRead,
    createdAt: notification.createdAt.toISOString(),
  };
}

export async function listNotifications(
  outletId: string,
  query: ListNotificationQuery,
): Promise<NotificationListResponse> {
  const [items, total, unreadCount] = await Promise.all([
    findManyNotifications(outletId, query.page, query.pageSize),
    countNotifications(outletId),
    countUnread(outletId),
  ]);
  return { items: items.map(toDto), total, unreadCount, page: query.page, pageSize: query.pageSize };
}

export async function markRead(id: string, outletId: string): Promise<void> {
  await markAsRead(id, outletId);
}

export async function markAllRead(outletId: string): Promise<void> {
  await markAllAsRead(outletId);
}

/**
 * Titik terpusat pemicu notifikasi — dipanggil dari order.service.ts (ORDER_CREATED),
 * kitchen.service.ts (ORDER_READY), stock.service.ts (LOW_STOCK). Sengaja sinkron
 * (bukan BullMQ) karena hanya insert 1 row + emit Socket.IO, bukan proses berat.
 * Kalau nanti butuh channel eksternal (email/push), ganti isi fungsi ini jadi
 * enqueue job tanpa mengubah call-site di 3 tempat tsb.
 */
export async function publishNotification(
  outletId: string,
  type: NotificationType,
  title: string,
  message: string,
  ref?: { referenceType: string; referenceId: string },
): Promise<void> {
  const notification = await createNotification({
    outletId,
    type,
    title,
    message,
    referenceType: ref?.referenceType ?? null,
    referenceId: ref?.referenceId ?? null,
  });

  getIO().to(`outlet:${outletId}`).emit("notification:new", toDto(notification));
}
