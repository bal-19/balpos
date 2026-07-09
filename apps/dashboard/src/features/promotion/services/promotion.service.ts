import type { ApiSuccessEnvelope, Promotion } from "@restaurant-pos/types";
import { apiClient } from "../../../services/api-client";

export interface PromotionPayload {
  type: "VOUCHER" | "DISCOUNT" | "HAPPY_HOUR" | "BUY_X_GET_Y";
  code?: string | null;
  name: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: string;
  minPurchase?: string;
  buyProductId?: string | null;
  buyQuantity?: number | null;
  getProductId?: string | null;
  getQuantity?: number | null;
  startAt?: string | null;
  endAt?: string | null;
  startTime?: string | null;
  endTime?: string | null;
  isActive?: boolean;
}

export async function fetchPromotions() {
  const { data } = await apiClient.get<ApiSuccessEnvelope<Promotion[]>>("/api/promotion/promotions");
  return data.data;
}

export async function createPromotion(payload: PromotionPayload) {
  const { data } = await apiClient.post<ApiSuccessEnvelope<Promotion>>("/api/promotion/promotions", payload);
  return data.data;
}

export async function updatePromotion(id: string, payload: Partial<PromotionPayload>) {
  const { data } = await apiClient.patch<ApiSuccessEnvelope<Promotion>>(`/api/promotion/promotions/${id}`, payload);
  return data.data;
}

export async function deletePromotion(id: string) {
  await apiClient.delete(`/api/promotion/promotions/${id}`);
}
