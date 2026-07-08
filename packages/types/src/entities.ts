import type { KitchenItemStatus, OrderStatus, OrderType, PaymentMethod, PaymentStatus } from "./enums.js";
import type { PermissionCode } from "./permission.js";

/**
 * Field uang selalu `string` (bukan `number`) karena Prisma `Decimal`
 * diserialize sebagai string di layer `dto/` backend — menghindari
 * floating-point drift end-to-end (lihat docs/12-development-principles.md).
 */

export interface AuthUser {
  id: string;
  tenantId: string;
  outletId: string;
  roleId: string;
  roleCode: string;
  name: string;
  email: string;
  permissions: PermissionCode[];
}

export interface StoreSetting {
  id: string;
  outletId: string;
  storeName: string;
  logoUrl: string | null;
  primaryColor: string;
  taxPercent: string;
  serviceChargePercent: string;
  currency: string;
  address: string | null;
  phone: string | null;
}

export interface PublicTheme {
  storeName: string;
  logoUrl: string | null;
  primaryColor: string;
}

export interface PublicOutletInfo extends PublicTheme {
  outletId: string;
}

export interface Category {
  id: string;
  outletId: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
}

export interface Product {
  id: string;
  outletId: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  isAvailable: boolean;
  sortOrder: number;
}

export interface Table {
  id: string;
  outletId: string;
  name: string;
  capacity: number | null;
  isActive: boolean;
}

export interface OrderItem {
  id: string;
  productId: string;
  productNameSnapshot: string;
  unitPrice: string;
  quantity: number;
  notes: string | null;
  subtotal: string;
  kitchenStatus: KitchenItemStatus;
}

export interface Payment {
  id: string;
  method: PaymentMethod;
  status: PaymentStatus;
  amount: string;
  paymentUrl: string | null;
  paidAt: string | null;
}

export interface Order {
  id: string;
  outletId: string;
  orderNumber: string;
  orderType: OrderType;
  status: OrderStatus;
  tableId: string | null;
  customerName: string | null;
  cashierId: string | null;
  subtotal: string;
  taxAmount: string;
  serviceChargeAmount: string;
  discountAmount: string;
  totalAmount: string;
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
  payments: Payment[];
}
