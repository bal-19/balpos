import type { OrderType } from "@restaurant-pos/types";
import { create } from "zustand";

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}

interface PosCartState {
  items: CartItem[];
  orderType: OrderType;
  tableId: string | null;
  customerName: string;
  addItem: (item: Omit<CartItem, "quantity">) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  setOrderType: (type: OrderType) => void;
  setTableId: (id: string | null) => void;
  setCustomerName: (name: string) => void;
  clear: () => void;
}

export const usePosCartStore = create<PosCartState>((set) => ({
  items: [],
  orderType: "DINE_IN",
  tableId: null,
  customerName: "",
  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),
  updateQuantity: (productId, quantity) =>
    set((state) => ({
      items:
        quantity <= 0
          ? state.items.filter((i) => i.productId !== productId)
          : state.items.map((i) => (i.productId === productId ? { ...i, quantity } : i)),
    })),
  removeItem: (productId) =>
    set((state) => ({ items: state.items.filter((i) => i.productId !== productId) })),
  setOrderType: (orderType) => set({ orderType, tableId: null }),
  setTableId: (tableId) => set({ tableId }),
  setCustomerName: (customerName) => set({ customerName }),
  clear: () => set({ items: [], tableId: null, customerName: "" }),
}));
