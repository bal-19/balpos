import { prisma } from "../../../database/prisma.js";

function getTodayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

export function getTodayOrderAggregate(outletId: string) {
  const { start, end } = getTodayRange();
  return prisma.order.aggregate({
    where: { outletId, status: "COMPLETED", createdAt: { gte: start, lt: end } },
    _sum: { totalAmount: true },
    _count: { _all: true },
  });
}

export async function getTodayBestSeller(outletId: string) {
  const { start, end } = getTodayRange();
  const [top] = await prisma.orderItem.groupBy({
    by: ["productNameSnapshot"],
    where: { order: { outletId, status: "COMPLETED", createdAt: { gte: start, lt: end } } },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: 1,
  });
  return top ?? null;
}

export function findOrderItemsInRange(outletId: string, start: Date, end: Date) {
  return prisma.orderItem.findMany({
    where: { order: { outletId, status: "COMPLETED", createdAt: { gte: start, lt: end } } },
    select: {
      subtotal: true,
      order: { select: { createdAt: true } },
      product: { select: { category: { select: { name: true } } } },
    },
  });
}

export function getTopItemsPerformance(outletId: string, since: Date, limit: number) {
  return prisma.orderItem.groupBy({
    by: ["productNameSnapshot"],
    where: { order: { outletId, status: "COMPLETED", createdAt: { gte: since } } },
    _sum: { quantity: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });
}

export function findRecentOrders(outletId: string, limit: number) {
  return prisma.order.findMany({
    where: { outletId, status: "COMPLETED" },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { items: true },
  });
}
