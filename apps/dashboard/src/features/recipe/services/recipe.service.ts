import type { ApiSuccessEnvelope, Recipe, StockItem } from "@restaurant-pos/types";
import { apiClient } from "../../../services/api-client";

export async function fetchProductRecipe(productId: string) {
  const { data } = await apiClient.get<ApiSuccessEnvelope<Recipe>>(`/api/recipe/products/${productId}`);
  return data.data;
}

export interface RecipeIngredientPayload {
  stockItemId: string;
  quantity: string;
}

export async function saveProductRecipe(productId: string, ingredients: RecipeIngredientPayload[]) {
  const { data } = await apiClient.put<ApiSuccessEnvelope<Recipe>>(`/api/recipe/products/${productId}`, {
    ingredients,
  });
  return data.data;
}

export async function fetchStockItemsForRecipe() {
  const { data } = await apiClient.get<ApiSuccessEnvelope<StockItem[]>>("/api/inventory/stock-items");
  return data.data;
}
