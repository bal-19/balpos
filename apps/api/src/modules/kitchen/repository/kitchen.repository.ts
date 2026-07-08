import { prisma } from "../../../database/prisma.js";

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

export function findActiveOrders(outletId: string) {
  const { start, end } = getTodayRange();
  return prisma.order.findMany({
    where: {
      outletId,
      createdAt: { gte: start, lt: end },
      status: { not: "CANCELLED" },
      items: { some: { kitchenStatus: { not: "READY" } } },
    },
    include: { items: true, table: true },
    orderBy: { createdAt: "asc" },
  });
}

export function findOrderItemById(id: string) {
  return prisma.orderItem.findUnique({ where: { id }, include: { order: true } });
}

export function updateOrderItemStatus(id: string, status: "NEW" | "PREPARING" | "READY") {
  return prisma.orderItem.update({ where: { id }, data: { kitchenStatus: status } });
}

export function countNonReadyItems(orderId: string) {
  return prisma.orderItem.count({ where: { orderId, kitchenStatus: { not: "READY" } } });
}
