import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchProductRecipe,
  fetchStockItemsForRecipe,
  saveProductRecipe,
  type RecipeIngredientPayload,
} from "../services/recipe.service";

export function useProductRecipe(productId: string | null) {
  return useQuery({
    queryKey: ["recipe", productId],
    queryFn: () => fetchProductRecipe(productId!),
    enabled: Boolean(productId),
  });
}

export function useStockItemsForRecipe() {
  return useQuery({ queryKey: ["recipe", "stock-items"], queryFn: fetchStockItemsForRecipe });
}

export function useSaveProductRecipe(productId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (ingredients: RecipeIngredientPayload[]) => saveProductRecipe(productId!, ingredients),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", productId] });
    },
  });
}
