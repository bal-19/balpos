import type { ApiSuccessEnvelope, PurchaseOrder, StockItem, Supplier } from "@restaurant-pos/types";
import { apiClient } from "../../../services/api-client";

export async function fetchSuppliers() {
  const { data } = await apiClient.get<ApiSuccessEnvelope<Supplier[]>>("/api/supplier/suppliers");
  return data.data;
}

export interface SupplierPayload {
  name: string;
  phone?: string | null;
  address?: string | null;
}

export async function createSupplier(payload: SupplierPayload) {
  const { data } = await apiClient.post<ApiSuccessEnvelope<Supplier>>("/api/supplier/suppliers", payload);
  return data.data;
}

export async function updateSupplier(id: string, payload: Partial<SupplierPayload>) {
  const { data } = await apiClient.patch<ApiSuccessEnvelope<Supplier>>(`/api/supplier/suppliers/${id}`, payload);
  return data.data;
}

export async function deleteSupplier(id: string) {
  await apiClient.delete(`/api/supplier/suppliers/${id}`);
}

export async function fetchPurchaseOrders() {
  const { data } = await apiClient.get<ApiSuccessEnvelope<PurchaseOrder[]>>("/api/supplier/purchase-orders");
  return data.data;
}

export interface CreatePurchaseOrderPayload {
  supplierId: string;
  notes?: string | null;
  items: { stockItemId: string; quantity: string; unitCost: string }[];
}

export async function createPurchaseOrder(payload: CreatePurchaseOrderPayload) {
  const { data } = await apiClient.post<ApiSuccessEnvelope<PurchaseOrder>>(
    "/api/supplier/purchase-orders",
    payload,
  );
  return data.data;
}

export async function receivePurchaseOrder(id: string) {
  const { data } = await apiClient.patch<ApiSuccessEnvelope<PurchaseOrder>>(
    `/api/supplier/purchase-orders/${id}/receive`,
  );
  return data.data;
}

export async function fetchStockItemsForPurchase() {
  const { data } = await apiClient.get<ApiSuccessEnvelope<StockItem[]>>("/api/inventory/stock-items");
  return data.data;
}
