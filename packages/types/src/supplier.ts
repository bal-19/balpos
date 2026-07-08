import type { PurchaseOrderStatus } from "./enums.js";

export interface Supplier {
  id: string;
  outletId: string;
  name: string;
  phone: string | null;
  address: string | null;
}

export interface PurchaseOrderItem {
  id: string;
  stockItemId: string;
  stockItemName: string;
  unit: string;
  quantity: string;
  unitCost: string;
  subtotal: string;
}

export interface PurchaseOrder {
  id: string;
  outletId: string;
  supplierId: string;
  supplierName: string;
  orderNumber: string;
  status: PurchaseOrderStatus;
  totalAmount: string;
  notes: string | null;
  receivedAt: string | null;
  createdAt: string;
  items: PurchaseOrderItem[];
}
