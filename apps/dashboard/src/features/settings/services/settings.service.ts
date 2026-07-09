import type { ApiSuccessEnvelope, Category, Product, StoreSetting } from "@restaurant-pos/types";
import { apiClient } from "../../../services/api-client";

export async function fetchStoreSetting() {
  const { data } = await apiClient.get<ApiSuccessEnvelope<StoreSetting>>("/api/settings/store");
  return data.data;
}

export interface UpdateStoreSettingPayload {
  storeName: string;
  logoUrl?: string | null;
  primaryColor: string;
  taxPercent: string;
  serviceChargePercent: string;
  currency: string;
  address?: string | null;
  phone?: string | null;
  receiptFooterNote?: string | null;
}

export async function updateStoreSetting(payload: UpdateStoreSettingPayload) {
  const { data } = await apiClient.put<ApiSuccessEnvelope<StoreSetting>>("/api/settings/store", payload);
  return data.data;
}

export async function fetchCategories() {
  const { data } = await apiClient.get<ApiSuccessEnvelope<Category[]>>("/api/settings/categories");
  return data.data;
}

export interface CategoryPayload {
  name: string;
  sortOrder?: number;
  isActive?: boolean;
}

export async function createCategory(payload: CategoryPayload) {
  const { data } = await apiClient.post<ApiSuccessEnvelope<Category>>(
    "/api/settings/categories",
    payload,
  );
  return data.data;
}

export async function updateCategory(id: string, payload: Partial<CategoryPayload>) {
  const { data } = await apiClient.patch<ApiSuccessEnvelope<Category>>(
    `/api/settings/categories/${id}`,
    payload,
  );
  return data.data;
}

export async function deleteCategory(id: string) {
  await apiClient.delete(`/api/settings/categories/${id}`);
}

export async function fetchProducts(categoryId?: string) {
  const { data } = await apiClient.get<ApiSuccessEnvelope<Product[]>>("/api/settings/products", {
    params: categoryId ? { categoryId } : undefined,
  });
  return data.data;
}

export interface ProductPayload {
  categoryId: string;
  name: string;
  description?: string | null;
  price: string;
  imageUrl?: string | null;
  isAvailable?: boolean;
  sortOrder?: number;
}

export async function createProduct(payload: ProductPayload) {
  const { data } = await apiClient.post<ApiSuccessEnvelope<Product>>("/api/settings/products", payload);
  return data.data;
}

export async function updateProduct(id: string, payload: Partial<ProductPayload>) {
  const { data } = await apiClient.patch<ApiSuccessEnvelope<Product>>(
    `/api/settings/products/${id}`,
    payload,
  );
  return data.data;
}

export async function deleteProduct(id: string) {
  await apiClient.delete(`/api/settings/products/${id}`);
}
