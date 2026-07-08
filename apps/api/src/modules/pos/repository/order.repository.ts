import { prisma } from "../../../database/prisma.js";
import type { Prisma } from "@prisma/client";

export function findAvailableProducts(outletId: string, ids: string[]) {
  return prisma.product.findMany({
    where: { outletId, id: { in: ids }, isAvailable: true, deletedAt: null },
  });
}

export function findStoreSettingForOutlet(outletId: string) {
  return prisma.storeSetting.findUnique({ where: { outletId } });
}

export function createOrderTransaction(data: Prisma.OrderUncheckedCreateInput) {
  return prisma.order.create({
    data,
    include: { items: true, payments: true },
  });
}
