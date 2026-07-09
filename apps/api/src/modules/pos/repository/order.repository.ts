import type { Prisma } from "@prisma/client";
import { prisma } from "../../../database/prisma.js";
import { consumeStockForOrder } from "../../inventory/service/stock.service.js";
import { recordPromotionUsage } from "../../promotion/repository/promotion.repository.js";

export function findAvailableProducts(outletId: string, ids: string[]) {
  return prisma.product.findMany({
    where: { outletId, id: { in: ids }, isAvailable: true, deletedAt: null },
  });
}

export function findStoreSettingForOutlet(outletId: string) {
  return prisma.storeSetting.findUnique({ where: { outletId } });
}

/**
 * Order + pengurangan stok bahan baku (sesuai resep) dijalankan dalam satu
 * transaksi atomik — kalau salah satu gagal, keduanya rollback.
 */
export function createOrderTransaction(
  data: Prisma.OrderUncheckedCreateInput,
  outletId: string,
  stockItems: { productId: string; quantity: number }[],
  promotionUsage?: { promotionId: string; discountAmount: string },
) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data,
      include: { items: true, payments: true },
    });

    const lowStockAlerts = await consumeStockForOrder(tx, outletId, order.id, stockItems);

    if (promotionUsage) {
      await recordPromotionUsage(tx, order.id, promotionUsage.promotionId, promotionUsage.discountAmount);
    }

    return { order, lowStockAlerts };
  });
}
