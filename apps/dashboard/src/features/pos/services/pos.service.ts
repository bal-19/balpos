import type { ApiSuccessEnvelope, Category, Order, OrderType, Product, Shift, Table } from "@restaurant-pos/types";
import { apiClient } from "../../../services/api-client";

export async function fetchCategories() {
  const { data } = await apiClient.get<ApiSuccessEnvelope<Category[]>>("/api/settings/categories");
  return data.data;
}

export async function fetchProducts(categoryId?: string) {
  const { data } = await apiClient.get<ApiSuccessEnvelope<Product[]>>("/api/settings/products", {
    params: categoryId ? { categoryId } : undefined,
  });
  return data.data;
}

export async function fetchTables() {
  const { data } = await apiClient.get<ApiSuccessEnvelope<Table[]>>("/api/pos/tables");
  return data.data;
}

export interface CreateOrderPayload {
  orderType: OrderType;
  tableId?: string | null;
  customerName?: string | null;
  items: { productId: string; quantity: number; notes?: string | null }[];
}

export async function createOrder(payload: CreateOrderPayload) {
  const { data } = await apiClient.post<ApiSuccessEnvelope<Order>>("/api/pos/orders", payload);
  return data.data;
}

export async function fetchCurrentShift() {
  const { data } = await apiClient.get<ApiSuccessEnvelope<Shift | null>>("/api/pos/shifts/current");
  return data.data;
}

export async function openShift(payload: { openingBalance: string }) {
  const { data } = await apiClient.post<ApiSuccessEnvelope<Shift>>("/api/pos/shifts/open", payload);
  return data.data;
}

export async function closeShift(payload: { closingBalance: string; notes?: string | null }) {
  const { data } = await apiClient.post<ApiSuccessEnvelope<Shift>>("/api/pos/shifts/close", payload);
  return data.data;
}
