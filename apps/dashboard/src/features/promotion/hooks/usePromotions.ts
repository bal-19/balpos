import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createPromotion,
  deletePromotion,
  fetchPromotions,
  updatePromotion,
  type PromotionPayload,
} from "../services/promotion.service";

export function usePromotions() {
  return useQuery({ queryKey: ["promotion", "promotions"], queryFn: fetchPromotions });
}

export function usePromotionMutations() {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["promotion", "promotions"] });

  const create = useMutation({
    mutationFn: (payload: PromotionPayload) => createPromotion(payload),
    onSuccess: invalidate,
  });
  const update = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<PromotionPayload> }) =>
      updatePromotion(id, payload),
    onSuccess: invalidate,
  });
  const remove = useMutation({
    mutationFn: (id: string) => deletePromotion(id),
    onSuccess: invalidate,
  });

  return { create, update, remove };
}
