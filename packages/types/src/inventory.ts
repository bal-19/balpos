import type { StockMovementType } from "./enums.js";

export interface StockItem {
  id: string;
  outletId: string;
  name: string;
  unit: string;
  currentStock: string;
  minStockThreshold: string;
  isLowStock: boolean;
}

export interface StockMovement {
  id: string;
  stockItemId: string;
  type: StockMovementType;
  quantity: string;
  note: string | null;
  referenceType: string | null;
  referenceId: string | null;
  createdAt: string;
}
