import { formatCurrencyIDR } from "@restaurant-pos/utils";
import { Minus, Plus, X } from "lucide-react";
import type { CartItem } from "../../../stores/pos-cart.store";
import { usePosCartStore } from "../../../stores/pos-cart.store";

export function CartItemRow({ item }: { item: CartItem }) {
  const updateQuantity = usePosCartStore((state) => state.updateQuantity);
  const removeItem = usePosCartStore((state) => state.removeItem);

  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="text-sm font-medium">{item.name}</div>
        <div className="text-xs text-black/50">
          {formatCurrencyIDR(item.price)} x{item.quantity}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
          className="rounded-full border border-black/10 p-1"
          aria-label="Kurangi"
        >
          <Minus size={12} />
        </button>
        <span className="w-4 text-center text-sm">{item.quantity}</span>
        <button
          type="button"
          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
          className="rounded-full border border-black/10 p-1"
          aria-label="Tambah"
        >
          <Plus size={12} />
        </button>
        <button
          type="button"
          onClick={() => removeItem(item.productId)}
          className="ml-1 text-black/30 hover:text-red-600"
          aria-label="Hapus"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
}
