import type { Product } from "@restaurant-pos/types";
import { formatCurrencyIDR } from "@restaurant-pos/utils";
import { Plus } from "lucide-react";
import { usePosCartStore } from "../../../stores/pos-cart.store";

export function ProductCard({ product }: { product: Product }) {
  const addItem = usePosCartStore((state) => state.addItem);

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-black/10 bg-white p-3">
      <div className="mb-3 aspect-square w-full overflow-hidden rounded-xl bg-black/5">
        {product.imageUrl && (
          <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
        )}
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">{product.name}</div>
          <div className="text-xs text-black/50">{formatCurrencyIDR(product.price)}</div>
        </div>
        <button
          type="button"
          onClick={() =>
            addItem({ productId: product.id, name: product.name, price: Number(product.price) })
          }
          className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground"
          aria-label={`Tambah ${product.name}`}
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
