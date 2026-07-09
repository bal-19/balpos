import type { Prisma } from "@prisma/client";
import { prisma } from "../../../database/prisma.js";

export function createNotification(data: Prisma.NotificationUncheckedCreateInput) {
  return prisma.notification.create({ data });
}

export function findManyNotifications(outletId: string, page: number, pageSize: number) {
  return prisma.notification.findMany({
    where: { outletId },
    orderBy: { createdAt: "desc" },
    skip: (page - 1) * pageSize,
    take: pageSize,
  });
}

export function countNotifications(outletId: string) {
  return prisma.notification.count({ where: { outletId } });
}

export function countUnread(outletId: string) {
  return prisma.notification.count({ where: { outletId, isRead: false } });
}

export function markAsRead(id: string, outletId: string) {
  return prisma.notification.updateMany({ where: { id, outletId }, data: { isRead: true } });
}

export function markAllAsRead(outletId: string) {
  return prisma.notification.updateMany({ where: { outletId, isRead: false }, data: { isRead: true } });
}
