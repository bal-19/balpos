import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  fetchProducts,
  updateProduct,
  type ProductPayload,
} from "../services/settings.service";

export function useProducts(categoryId?: string) {
  return useQuery({
    queryKey: ["settings", "products", categoryId ?? "all"],
    queryFn: () => fetchProducts(categoryId),
  });
}

export function useProductMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["settings", "products"] });

  const create = useMutation({
    mutationFn: (payload: ProductPayload) => createProduct(payload),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<ProductPayload> }) =>
      updateProduct(id, payload),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
