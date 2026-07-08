import type {
  ItemPerformance,
  OverviewStats,
  RecentTransaction,
  SalesStatisticPoint,
  SalesStatisticResponse,
} from "@restaurant-pos/types";
import {
  findOrderItemsInRange,
  findRecentOrders,
  getTodayBestSeller,
  getTodayOrderAggregate,
  getTopItemsPerformance,
} from "../repository/dashboard.repository.js";

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export async function getOverview(outletId: string): Promise<OverviewStats> {
  const [aggregate, bestSeller] = await Promise.all([
    getTodayOrderAggregate(outletId),
    getTodayBestSeller(outletId),
  ]);

  const totalRevenueToday = aggregate._sum.totalAmount?.toNumber() ?? 0;
  const totalOrdersToday = aggregate._count._all;
  const averageOrderValueToday = totalOrdersToday > 0 ? round2(totalRevenueToday / totalOrdersToday) : 0;

  return {
    totalRevenueToday: totalRevenueToday.toFixed(2),
    totalOrdersToday,
    averageOrderValueToday: averageOrderValueToday.toFixed(2),
    bestSellerToday: bestSeller
      ? { productName: bestSeller.productNameSnapshot, quantity: bestSeller._sum.quantity ?? 0 }
      : null,
  };
}

interface Bucket {
  start: Date;
  end: Date;
  label: string;
}

function buildBuckets(range: "day" | "month" | "year"): Bucket[] {
  const now = new Date();
  const buckets: Bucket[] = [];

  if (range === "day") {
    for (let i = 6; i >= 0; i--) {
      const day = new Date(now);
      day.setHours(0, 0, 0, 0);
      day.setDate(day.getDate() - i);
      const end = new Date(day);
      end.setDate(end.getDate() + 1);
      buckets.push({
        start: day,
        end,
        label: new Intl.DateTimeFormat("id-ID", { weekday: "short" }).format(day),
      });
    }
    return buckets;
  }

  if (range === "month") {
    const start = new Date(now.getFullYear(), now.getMonth(), 1);
    const daysInView = now.getDate();
    for (let i = 0; i < daysInView; i++) {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      const end = new Date(day);
      end.setDate(end.getDate() + 1);
      buckets.push({ start: day, end, label: String(day.getDate()) });
    }
    return buckets;
  }

  for (let month = 0; month <= now.getMonth(); month++) {
    const start = new Date(now.getFullYear(), month, 1);
    const end = new Date(now.getFullYear(), month + 1, 1);
    buckets.push({
      start,
      end,
      label: new Intl.DateTimeFormat("id-ID", { month: "short" }).format(start),
    });
  }
  return buckets;
}

export async function getSalesStatistic(
  outletId: string,
  range: "day" | "month" | "year",
): Promise<SalesStatisticResponse> {
  const buckets = buildBuckets(range);
  const overallStart = buckets[0]!.start;
  const overallEnd = buckets[buckets.length - 1]!.end;

  const items = await findOrderItemsInRange(outletId, overallStart, overallEnd);

  const categorySet = new Set<string>();
  const data: SalesStatisticPoint[] = buckets.map((bucket) => ({ label: bucket.label }));

  for (const item of items) {
    const categoryName = item.product.category?.name ?? "Lainnya";
    categorySet.add(categoryName);

    const bucketIndex = buckets.findIndex(
      (bucket) => item.order.createdAt >= bucket.start && item.order.createdAt < bucket.end,
    );
    if (bucketIndex === -1) continue;

    const point = data[bucketIndex]!;
    const current = typeof point[categoryName] === "number" ? (point[categoryName] as number) : 0;
    point[categoryName] = round2(current + item.subtotal.toNumber());
  }

  const categories = Array.from(categorySet);
  for (const point of data) {
    for (const categoryName of categories) {
      if (!(categoryName in point)) point[categoryName] = 0;
    }
  }

  return { categories, data };
}

export async function getItemsPerformance(outletId: string, limit: number): Promise<ItemPerformance[]> {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const grouped = await getTopItemsPerformance(outletId, since, limit);
  return grouped.map((row) => ({ name: row.productNameSnapshot, quantity: row._sum.quantity ?? 0 }));
}

export async function getRecentTransactions(outletId: string, limit: number): Promise<RecentTransaction[]> {
  const orders = await findRecentOrders(outletId, limit);
  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    itemsSummary: order.items.map((item) => `${item.productNameSnapshot} x${item.quantity}`).join(", "),
    totalAmount: order.totalAmount.toString(),
    createdAt: order.createdAt.toISOString(),
  }));
}
