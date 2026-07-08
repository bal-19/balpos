import { useMutation } from "@tanstack/react-query";
import { usePosCartStore } from "../../../stores/pos-cart.store";
import { createOrder } from "../services/pos.service";

export function useCreateOrder() {
  const clearCart = usePosCartStore((state) => state.clear);

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      clearCart();
    },
  });
}
