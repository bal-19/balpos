import type { Prisma } from "@prisma/client";
import { prisma } from "../../../database/prisma.js";

const withRelations = {
  supplier: true,
  items: { include: { stockItem: true } },
} as const;

export function findManyPurchaseOrders(outletId: string) {
  return prisma.purchaseOrder.findMany({
    where: { outletId },
    include: withRelations,
    orderBy: { createdAt: "desc" },
  });
}

export function findPurchaseOrderById(id: string, outletId: string) {
  return prisma.purchaseOrder.findFirst({
    where: { id, outletId },
    include: withRelations,
  });
}

export function createPurchaseOrder(data: Prisma.PurchaseOrderUncheckedCreateInput) {
  return prisma.purchaseOrder.create({ data, include: withRelations });
}

export function markPurchaseOrderReceived(tx: Prisma.TransactionClient, id: string) {
  return tx.purchaseOrder.update({
    where: { id },
    data: { status: "RECEIVED", receivedAt: new Date() },
    include: withRelations,
  });
}
