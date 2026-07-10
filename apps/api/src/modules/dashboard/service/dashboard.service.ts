import type {
  ItemPerformance,
  OverviewStats,
  RecentTransaction,
  SalesStatisticPoint,
  SalesStatisticResponse,
} from "@restaurant-pos/types";
import { getOrSetCache } from "../../../core/cache.js";
import {
  findOrderItemsInRange,
  findOrderTotalsInRange,
  findRecentOrders,
  getOrderAggregateInRange,
  getTodayBestSeller,
  getTodayOrderAggregate,
  getTopItemsPerformance,
} from "../repository/dashboard.repository.js";

const CACHE_TTL_SECONDS = 30;

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/** Persentase perubahan vs periode sebelumnya. `previous === 0` diperlakukan sebagai 100% naik kalau ada nilai baru, 0% kalau tetap kosong. */
function trendPercent(current: number, previous: number): string {
  if (previous === 0) return (current > 0 ? 100 : 0).toFixed(2);
  return (((current - previous) / previous) * 100).toFixed(2);
}

export async function getOverview(outletId: string): Promise<OverviewStats> {
  return getOrSetCache(`dashboard:${outletId}:overview`, CACHE_TTL_SECONDS, async () => {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const sevenDaysAgoStart = new Date(todayStart);
    sevenDaysAgoStart.setDate(sevenDaysAgoStart.getDate() - 6);

    const [aggregate, bestSeller, yesterdayAggregate, sevenDayOrders] = await Promise.all([
      getTodayOrderAggregate(outletId),
      getTodayBestSeller(outletId),
      getOrderAggregateInRange(outletId, yesterdayStart, todayStart),
      findOrderTotalsInRange(outletId, sevenDaysAgoStart, tomorrowStart),
    ]);

    const totalRevenueToday = aggregate._sum.totalAmount?.toNumber() ?? 0;
    const totalOrdersToday = aggregate._count._all;
    const averageOrderValueToday = totalOrdersToday > 0 ? round2(totalRevenueToday / totalOrdersToday) : 0;

    const yesterdayRevenue = yesterdayAggregate._sum.totalAmount?.toNumber() ?? 0;
    const yesterdayOrders = yesterdayAggregate._count._all;
    const yesterdayAvgOrderValue = yesterdayOrders > 0 ? yesterdayRevenue / yesterdayOrders : 0;

    const dayBuckets: { start: Date; end: Date }[] = [];
    for (let i = 6; i >= 0; i--) {
      const start = new Date(todayStart);
      start.setDate(start.getDate() - i);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      dayBuckets.push({ start, end });
    }

    const revenueSparkline = dayBuckets.map((bucket) =>
      round2(
        sevenDayOrders
          .filter((order) => order.createdAt >= bucket.start && order.createdAt < bucket.end)
          .reduce((sum, order) => sum + order.totalAmount.toNumber(), 0),
      ),
    );
    const ordersSparkline = dayBuckets.map(
      (bucket) => sevenDayOrders.filter((order) => order.createdAt >= bucket.start && order.createdAt < bucket.end).length,
    );
    const avgOrderValueSparkline = revenueSparkline.map((revenue, index) => {
      const count = ordersSparkline[index]!;
      return count > 0 ? round2(revenue / count) : 0;
    });

    return {
      totalRevenueToday: totalRevenueToday.toFixed(2),
      totalRevenueTrendPercent: trendPercent(totalRevenueToday, yesterdayRevenue),
      totalRevenueSparkline: revenueSparkline,
      totalOrdersToday,
      totalOrdersTrendPercent: trendPercent(totalOrdersToday, yesterdayOrders),
      totalOrdersSparkline: ordersSparkline,
      averageOrderValueToday: averageOrderValueToday.toFixed(2),
      averageOrderValueTrendPercent: trendPercent(averageOrderValueToday, yesterdayAvgOrderValue),
      averageOrderValueSparkline: avgOrderValueSparkline,
      bestSellerToday: bestSeller
        ? { productName: bestSeller.productNameSnapshot, quantity: bestSeller._sum.quantity ?? 0 }
        : null,
    };
  });
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
  return getOrSetCache(`dashboard:${outletId}:sales-statistic:${range}`, CACHE_TTL_SECONDS, async () => {
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
  });
}

export async function getItemsPerformance(outletId: string, limit: number): Promise<ItemPerformance[]> {
  return getOrSetCache(`dashboard:${outletId}:items-performance:${limit}`, CACHE_TTL_SECONDS, async () => {
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const grouped = await getTopItemsPerformance(outletId, since, limit);
    return grouped.map((row) => ({
      productId: row.productId,
      name: row.productNameSnapshot,
      quantity: row.quantity,
      revenue: row.revenue,
      price: row.price,
      imageUrl: row.imageUrl,
    }));
  });
}

export async function getRecentTransactions(outletId: string, limit: number): Promise<RecentTransaction[]> {
  const orders = await findRecentOrders(outletId, limit);
  return orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    customerName: order.customerName,
    itemsSummary: order.items.map((item) => `${item.productNameSnapshot} x${item.quantity}`).join(", "),
    totalAmount: order.totalAmount.toString(),
    status: order.status,
    createdAt: order.createdAt.toISOString(),
  }));
}
