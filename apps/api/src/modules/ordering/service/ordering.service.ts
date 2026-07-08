import type { PublicOrderingContext, PublicOrderStatus } from "@restaurant-pos/types";
import { toCategoryDto } from "../../settings/dto/category.dto.js";
import { toProductDto } from "../../settings/dto/product.dto.js";
// `ordering` bukan pemilik entity Order (itu tetap domain `pos`) — module ini cuma
// channel lain untuk membuat Order yang sama (customer self-service via QR), jadi
// reuse langsung service `pos` daripada duplikasi logic validasi+kalkulasi+transaksi.
import { createOrder as createOrderForOutlet } from "../../pos/service/order.service.js";
import { NotFoundError } from "../../../shared/errors/app-error.js";
import type { CreatePublicOrderInput } from "../schema/ordering.schema.js";
import { findMenu, findOrderWithPayment, findTableById } from "../repository/ordering.repository.js";

export async function getOrderingContext(tableId: string): Promise<PublicOrderingContext> {
  const table = await findTableById(tableId);
  if (!table || !table.isActive) throw new NotFoundError("Meja tidak ditemukan");

  const [categories, products] = await findMenu(table.outletId);

  return {
    storeName: table.outlet.setting?.storeName ?? "Restaurant POS",
    primaryColor: table.outlet.setting?.primaryColor ?? "#2C4A3B",
    table: {
      id: table.id,
      outletId: table.outletId,
      name: table.name,
      capacity: table.capacity,
      isActive: table.isActive,
    },
    categories: categories.map(toCategoryDto),
    products: products.map(toProductDto),
  };
}

export async function createPublicOrder(tableId: string, input: CreatePublicOrderInput) {
  const table = await findTableById(tableId);
  if (!table || !table.isActive) throw new NotFoundError("Meja tidak ditemukan");

  return createOrderForOutlet(table.outletId, null, {
    orderType: "ORDER_ONLINE",
    tableId: table.id,
    customerName: input.customerName,
    paymentMethod: input.paymentMethod,
    items: input.items,
  });
}

export async function getPublicOrderStatus(orderId: string): Promise<PublicOrderStatus> {
  const order = await findOrderWithPayment(orderId);
  if (!order) throw new NotFoundError("Order tidak ditemukan");

  const latestPayment = order.payments[order.payments.length - 1];

  return {
    orderId: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: latestPayment?.status ?? "PENDING",
    paymentUrl: latestPayment?.paymentUrl ?? null,
    totalAmount: order.totalAmount.toString(),
  };
}
