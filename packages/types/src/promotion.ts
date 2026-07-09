import type { DiscountType, PromotionType } from "./enums.js";

export interface Promotion {
  id: string;
  outletId: string;
  type: PromotionType;
  code: string | null;
  name: string;
  discountType: DiscountType;
  discountValue: string;
  minPurchase: string;
  buyProductId: string | null;
  buyQuantity: number | null;
  getProductId: string | null;
  getQuantity: number | null;
  startAt: string | null;
  endAt: string | null;
  startTime: string | null;
  endTime: string | null;
  isActive: boolean;
}

export interface OrderPromotion {
  id: string;
  orderId: string;
  promotionId: string;
  promotionName: string;
  discountAmount: string;
}
