import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPurchaseOrder,
  fetchPurchaseOrders,
  fetchStockItemsForPurchase,
  receivePurchaseOrder,
  type CreatePurchaseOrderPayload,
} from "../services/supplier.service";

export function usePurchaseOrders() {
  return useQuery({ queryKey: ["supplier", "purchase-orders"], queryFn: fetchPurchaseOrders });
}

export function useStockItemsForPurchase() {
  return useQuery({ queryKey: ["supplier", "stock-items"], queryFn: fetchStockItemsForPurchase });
}

export function usePurchaseOrderMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["supplier", "purchase-orders"] });
  const invalidateStock = () => queryClient.invalidateQueries({ queryKey: ["inventory", "stock-items"] });

  const create = useMutation({
    mutationFn: (payload: CreatePurchaseOrderPayload) => createPurchaseOrder(payload),
    onSuccess: invalidate,
  });
  const receive = useMutation({
    mutationFn: (id: string) => receivePurchaseOrder(id),
    onSuccess: () => {
      invalidate();
      invalidateStock();
    },
  });

  return { create, receive };
}
