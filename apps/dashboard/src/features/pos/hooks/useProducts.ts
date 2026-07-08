import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../services/pos.service";

export function useProducts(categoryId?: string) {
  return useQuery({
    queryKey: ["pos", "products", categoryId ?? "all"],
    queryFn: () => fetchProducts(categoryId),
    enabled: Boolean(categoryId),
  });
}
