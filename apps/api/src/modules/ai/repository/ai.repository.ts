import type { AiInsightType, Prisma } from "@prisma/client";
import { prisma } from "../../../database/prisma.js";

export function createAiInsight(data: Prisma.AiInsightUncheckedCreateInput) {
  return prisma.aiInsight.create({ data });
}

export function findLatestInsight(outletId: string, type: AiInsightType) {
  return prisma.aiInsight.findFirst({
    where: { outletId, type },
    orderBy: { createdAt: "desc" },
  });
}

export function findManyInsights(outletId: string, type: AiInsightType | undefined, limit: number) {
  return prisma.aiInsight.findMany({
    where: { outletId, ...(type ? { type } : {}) },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

// --- Data gathering untuk 6 tipe insight ---

export function getBestSellingItems(outletId: string, from: Date, to: Date, limit = 10) {
  return prisma.orderItem.groupBy({
    by: ["productNameSnapshot"],
    where: { order: { outletId, status: "COMPLETED", createdAt: { gte: from, lt: to } } },
    _sum: { quantity: true, subtotal: true },
    orderBy: { _sum: { quantity: "desc" } },
    take: limit,
  });
}

export function findOrderTimestamps(outletId: string, from: Date, to: Date) {
  return prisma.order.findMany({
    where: { outletId, status: "COMPLETED", createdAt: { gte: from, lt: to } },
    select: { createdAt: true },
  });
}

export function getStockUsageSince(outletId: string, since: Date) {
  return prisma.stockMovement.groupBy({
    by: ["stockItemId"],
    where: { outletId, type: "OUT", createdAt: { gte: since } },
    _sum: { quantity: true },
  });
}

export function findAllStockItems(outletId: string) {
  return prisma.stockItem.findMany({ where: { outletId } });
}

export function getProductQuantitySold(outletId: string, from: Date, to: Date) {
  return prisma.orderItem.groupBy({
    by: ["productNameSnapshot"],
    where: { order: { outletId, status: "COMPLETED", createdAt: { gte: from, lt: to } } },
    _sum: { quantity: true },
  });
}
