import type { OrderType } from "@restaurant-pos/types";
import { usePosCartStore } from "../../../stores/pos-cart.store";

const OPTIONS: { value: OrderType; label: string }[] = [
  { value: "DINE_IN", label: "Dine In" },
  { value: "TAKE_AWAY", label: "Take Away" },
  { value: "ORDER_ONLINE", label: "Order Online" },
];

export function OrderTypeTabs() {
  const orderType = usePosCartStore((state) => state.orderType);
  const setOrderType = usePosCartStore((state) => state.setOrderType);

  return (
    <div className="flex gap-1 rounded-full bg-black/5 p-1">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setOrderType(option.value)}
          className={`flex-1 rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
            orderType === option.value ? "bg-primary text-primary-foreground" : "text-black/60"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
