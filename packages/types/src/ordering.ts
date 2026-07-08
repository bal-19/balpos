import type { Category, Product, Table } from "./entities.js";

/** Response publik untuk landing page QR Table Ordering (`GET /api/ordering/context/:tableId`). */
export interface PublicOrderingContext {
  storeName: string;
  primaryColor: string;
  table: Table;
  categories: Category[];
  products: Product[];
}

export interface PublicOrderStatus {
  orderId: string;
  orderNumber: string;
  status: "OPEN" | "COMPLETED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  paymentUrl: string | null;
  totalAmount: string;
}
