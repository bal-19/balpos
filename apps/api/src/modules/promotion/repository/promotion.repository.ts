import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../../database/prisma.js";

type Db = PrismaClient | Prisma.TransactionClient;

export function findManyPromotions(outletId: string) {
  return prisma.promotion.findMany({ where: { outletId }, orderBy: { createdAt: "desc" } });
}

export function findPromotionById(id: string, outletId: string) {
  return prisma.promotion.findFirst({ where: { id, outletId } });
}

export function findPromotionByCode(outletId: string, code: string) {
  return prisma.promotion.findFirst({ where: { outletId, code, isActive: true } });
}

/** Kandidat promo yang bisa auto-apply tanpa kode (HAPPY_HOUR / BUY_X_GET_Y). */
export function findActiveAutoApplyPromotions(outletId: string) {
  return prisma.promotion.findMany({
    where: { outletId, isActive: true, type: { in: ["HAPPY_HOUR", "BUY_X_GET_Y"] } },
  });
}

export function createPromotion(data: Prisma.PromotionUncheckedCreateInput) {
  return prisma.promotion.create({ data });
}

export function updatePromotion(id: string, data: Prisma.PromotionUpdateInput) {
  return prisma.promotion.update({ where: { id }, data });
}

export function deletePromotion(id: string) {
  return prisma.promotion.delete({ where: { id } });
}

/** Dipanggil di dalam transaksi order `modules/pos` saat promo berhasil diterapkan. */
export function recordPromotionUsage(db: Db, orderId: string, promotionId: string, discountAmount: string) {
  return db.orderPromotion.create({ data: { orderId, promotionId, discountAmount } });
}
