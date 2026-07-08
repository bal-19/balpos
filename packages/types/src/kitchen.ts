import type { KitchenItemStatus, OrderType } from "./enums.js";

export interface KitchenOrderItem {
  id: string;
  productNameSnapshot: string;
  quantity: number;
  notes: string | null;
  kitchenStatus: KitchenItemStatus;
}

export interface KitchenOrder {
  id: string;
  orderNumber: string;
  orderType: OrderType;
  tableName: string | null;
  customerName: string | null;
  createdAt: string;
  items: KitchenOrderItem[];
}
