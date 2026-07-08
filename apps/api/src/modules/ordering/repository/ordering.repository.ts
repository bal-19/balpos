import { prisma } from "../../../database/prisma.js";

export function findTableById(tableId: string) {
  return prisma.table.findUnique({
    where: { id: tableId },
    include: { outlet: { include: { setting: true } } },
  });
}

export function findMenu(outletId: string) {
  return Promise.all([
    prisma.category.findMany({ where: { outletId, isActive: true }, orderBy: { sortOrder: "asc" } }),
    prisma.product.findMany({
      where: { outletId, isAvailable: true, deletedAt: null },
      orderBy: { sortOrder: "asc" },
    }),
  ]);
}

export function findOrderWithPayment(orderId: string) {
  return prisma.order.findUnique({ where: { id: orderId }, include: { payments: true } });
}
