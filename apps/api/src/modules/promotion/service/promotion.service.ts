import type { Promotion } from "@prisma/client";
import type { Promotion as PromotionDto } from "@restaurant-pos/types";
import { AppError, NotFoundError } from "../../../shared/errors/app-error.js";
import {
  createPromotion,
  deletePromotion,
  findActiveAutoApplyPromotions,
  findManyPromotions,
  findPromotionByCode,
  findPromotionById,
  updatePromotion,
} from "../repository/promotion.repository.js";
import type { CreatePromotionInput, UpdatePromotionInput } from "../schema/promotion.schema.js";

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function toPromotionDto(promo: Promotion): PromotionDto {
  return {
    id: promo.id,
    outletId: promo.outletId,
    type: promo.type,
    code: promo.code,
    name: promo.name,
    discountType: promo.discountType,
    discountValue: promo.discountValue.toString(),
    minPurchase: promo.minPurchase.toString(),
    buyProductId: promo.buyProductId,
    buyQuantity: promo.buyQuantity,
    getProductId: promo.getProductId,
    getQuantity: promo.getQuantity,
    startAt: promo.startAt ? promo.startAt.toISOString() : null,
    endAt: promo.endAt ? promo.endAt.toISOString() : null,
    startTime: promo.startTime,
    endTime: promo.endTime,
    isActive: promo.isActive,
  };
}

export async function listPromotions(outletId: string) {
  const promotions = await findManyPromotions(outletId);
  return promotions.map(toPromotionDto);
}

export async function createOutletPromotion(outletId: string, input: CreatePromotionInput) {
  const promotion = await createPromotion({ ...input, code: input.code ?? null, outletId });
  return toPromotionDto(promotion);
}

export async function updateOutletPromotion(id: string, outletId: string, input: UpdatePromotionInput) {
  const existing = await findPromotionById(id, outletId);
  if (!existing) throw new NotFoundError("Promo tidak ditemukan");
  const promotion = await updatePromotion(id, input);
  return toPromotionDto(promotion);
}

export async function deleteOutletPromotion(id: string, outletId: string) {
  const existing = await findPromotionById(id, outletId);
  if (!existing) throw new NotFoundError("Promo tidak ditemukan");
  await deletePromotion(id);
}

function isWithinTimeWindow(now: Date, startTime: string, endTime: string): boolean {
  const current = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
  return current >= startTime && current <= endTime;
}

function isPromotionValidNow(promo: Promotion, now: Date): boolean {
  if (promo.startAt && now < promo.startAt) return false;
  if (promo.endAt && now > promo.endAt) return false;
  if (promo.type === "HAPPY_HOUR" && promo.startTime && promo.endTime) {
    if (!isWithinTimeWindow(now, promo.startTime, promo.endTime)) return false;
  }
  return true;
}

interface OrderItemForPromo {
  productId: string;
  quantity: number;
  unitPrice: number;
}

function computeDiscount(promo: Promotion, subtotal: number, items: OrderItemForPromo[]): number {
  if (promo.type === "BUY_X_GET_Y") {
    if (!promo.buyProductId || !promo.buyQuantity || !promo.getProductId || !promo.getQuantity) return 0;

    const buyItem = items.find((item) => item.productId === promo.buyProductId);
    if (!buyItem || buyItem.quantity < promo.buyQuantity) return 0;

    const getItem = items.find((item) => item.productId === promo.getProductId);
    if (!getItem) return 0;

    const eligibleQty = Math.min(promo.getQuantity, getItem.quantity);
    const discountValue = promo.discountValue.toNumber();
    const perUnitDiscount =
      promo.discountType === "PERCENTAGE"
        ? getItem.unitPrice * (discountValue / 100)
        : Math.min(discountValue, getItem.unitPrice);

    return round2(perUnitDiscount * eligibleQty);
  }

  const discountValue = promo.discountValue.toNumber();
  const discount =
    promo.discountType === "PERCENTAGE" ? subtotal * (discountValue / 100) : Math.min(discountValue, subtotal);
  return round2(discount);
}

export interface ResolvedPromotion {
  promotionId: string;
  discountAmount: number;
}

/**
 * Dipanggil `modules/pos` sebelum total order dihitung. Kalau `code` diisi
 * eksplisit dan tidak valid → throw (cashier salah input). Kalau kosong,
 * cari 1 promo auto-apply (HAPPY_HOUR/BUY_X_GET_Y) yang aktif saat ini —
 * tidak ada stacking, promo pertama yang cocok dipakai.
 */
export async function resolvePromotionForOrder(
  outletId: string,
  input: { code?: string | null; subtotal: number; items: OrderItemForPromo[] },
): Promise<ResolvedPromotion | null> {
  const now = new Date();

  if (input.code) {
    const promo = await findPromotionByCode(outletId, input.code);
    if (!promo) throw new AppError("Kode promo tidak ditemukan atau tidak aktif", 400);
    if (!isPromotionValidNow(promo, now)) throw new AppError("Promo sudah tidak berlaku", 400);
    if (input.subtotal < promo.minPurchase.toNumber()) {
      throw new AppError(`Minimal pembelian Rp${promo.minPurchase.toString()} untuk promo ini`, 400);
    }
    const discountAmount = computeDiscount(promo, input.subtotal, input.items);
    return discountAmount > 0 ? { promotionId: promo.id, discountAmount } : null;
  }

  const candidates = await findActiveAutoApplyPromotions(outletId);
  for (const promo of candidates) {
    if (!isPromotionValidNow(promo, now)) continue;
    if (input.subtotal < promo.minPurchase.toNumber()) continue;
    const discountAmount = computeDiscount(promo, input.subtotal, input.items);
    if (discountAmount > 0) return { promotionId: promo.id, discountAmount };
  }

  return null;
}
