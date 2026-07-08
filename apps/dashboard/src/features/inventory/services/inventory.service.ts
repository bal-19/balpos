import type { ApiSuccessEnvelope, StockItem } from "@restaurant-pos/types";
import { apiClient } from "../../../services/api-client";

export async function fetchStockItems() {
  const { data } = await apiClient.get<ApiSuccessEnvelope<StockItem[]>>("/api/inventory/stock-items");
  return data.data;
}

export interface StockItemPayload {
  name: string;
  unit: string;
  currentStock?: string;
  minStockThreshold?: string;
}

export async function createStockItem(payload: StockItemPayload) {
  const { data } = await apiClient.post<ApiSuccessEnvelope<StockItem>>("/api/inventory/stock-items", payload);
  return data.data;
}

export async function updateStockItem(id: string, payload: Partial<StockItemPayload>) {
  const { data } = await apiClient.patch<ApiSuccessEnvelope<StockItem>>(
    `/api/inventory/stock-items/${id}`,
    payload,
  );
  return data.data;
}

export interface AdjustStockPayload {
  type: "IN" | "OUT" | "ADJUSTMENT";
  quantity: string;
  note?: string | null;
}

export async function adjustStock(id: string, payload: AdjustStockPayload) {
  const { data } = await apiClient.post<ApiSuccessEnvelope<StockItem>>(
    `/api/inventory/stock-items/${id}/adjust`,
    payload,
  );
  return data.data;
}
