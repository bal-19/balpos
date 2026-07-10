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
      quantity: true,
      productNameSnapshot: true,
      order: { select: { createdAt: true } },
      product: { select: { category: { select: { name: true } } } },
    },
  });
}

export function getOrderAggregateInRange(outletId: string, start: Date, end: Date) {
  return prisma.order.aggregate({
    where: { outletId, status: "COMPLETED", createdAt: { gte: start, lt: end } },
    _sum: { totalAmount: true },
    _count: { _all: true },
  });
}

/** Order harian (totalAmount + createdAt saja) untuk bucket sparkline di overview stat card. */
export function findOrderTotalsInRange(outletId: string, start: Date, end: Date) {
  return prisma.order.findMany({
    where: { outletId, status: "COMPLETED", createdAt: { gte: start, lt: end } },
    select: { totalAmount: true, createdAt: true },
  });
}

export async function getTopItemsPerformance(outletId: string, since: Date, limit: number) {
  const grouped = await prisma.orderItem.groupBy({
    by: ["productId", "productNameSnapshot"],
    where: { order: { outletId, status: "COMPLETED", createdAt: { gte: since } } },
    _sum: { quantity: true, subtotal: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });

  const products = await prisma.product.findMany({
    where: { id: { in: grouped.map((row) => row.productId) } },
    select: { id: true, imageUrl: true, price: true },
  });
  const productMap = new Map(products.map((product) => [product.id, product]));

  return grouped.map((row) => ({
    productId: row.productId,
    productNameSnapshot: row.productNameSnapshot,
    quantity: row._sum.quantity ?? 0,
    revenue: row._sum.subtotal?.toString() ?? "0",
    imageUrl: productMap.get(row.productId)?.imageUrl ?? null,
    price: productMap.get(row.productId)?.price.toString() ?? "0",
  }));
}

export function findRecentOrders(outletId: string, limit: number) {
  return prisma.order.findMany({
    where: { outletId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { items: true },
  });
}
