import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adjustStock,
  createStockItem,
  fetchStockItems,
  updateStockItem,
  type AdjustStockPayload,
  type StockItemPayload,
} from "../services/inventory.service";

export function useStockItems() {
  return useQuery({ queryKey: ["inventory", "stock-items"], queryFn: fetchStockItems });
}

export function useStockItemMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["inventory", "stock-items"] });

  const create = useMutation({
    mutationFn: (payload: StockItemPayload) => createStockItem(payload),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<StockItemPayload> }) =>
      updateStockItem(id, payload),
    onSuccess: invalidate,
  });
  const adjust = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: AdjustStockPayload }) => adjustStock(id, payload),
    onSuccess: invalidate,
  });

  return { create, update, adjust };
}
