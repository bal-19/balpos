import type { OrderType as PrismaOrderType } from "@prisma/client";
import { getIO } from "../../../core/socket.js";
import { createPendingPayment } from "../../payment/service/payment.service.js";
import { toOrderDto, toPaymentDto } from "../dto/order.dto.js";
import { emitOrderCreated } from "../events/order-created.event.js";
import { createOrderTransaction, findStoreSettingForOutlet } from "../repository/order.repository.js";
import type { CreateOrderInput } from "../schema/order.schema.js";
import { assertDineInHasTable, assertProductsAvailable, assertTableIsValid } from "../validators/order.validator.js";

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export async function createOrder(outletId: string, cashierId: string | null, input: CreateOrderInput) {
  assertDineInHasTable(input);
  if (input.tableId) {
    await assertTableIsValid(outletId, input.tableId);
  }

  const productIds = input.items.map((item) => item.productId);
  const products = await assertProductsAvailable(outletId, productIds);
  const productMap = new Map(products.map((product) => [product.id, product]));

  let subtotal = 0;
  const orderItems = input.items.map((item) => {
    const product = productMap.get(item.productId)!;
    const unitPrice = product.price.toNumber();
    const itemSubtotal = round2(unitPrice * item.quantity);
    subtotal += itemSubtotal;

    return {
      productId: product.id,
      productNameSnapshot: product.name,
      unitPrice: unitPrice.toFixed(2),
      quantity: item.quantity,
      notes: item.notes ?? null,
      subtotal: itemSubtotal.toFixed(2),
    };
  });

  subtotal = round2(subtotal);

  const storeSetting = await findStoreSettingForOutlet(outletId);
  const taxPercent = storeSetting ? storeSetting.taxPercent.toNumber() : 0;
  const serviceChargePercent = storeSetting ? storeSetting.serviceChargePercent.toNumber() : 0;

  const taxAmount = round2(subtotal * (taxPercent / 100));
  const serviceChargeAmount = round2(subtotal * (serviceChargePercent / 100));
  const totalAmount = round2(subtotal + taxAmount + serviceChargeAmount);

  const isCash = input.paymentMethod === "CASH";

  const order = await createOrderTransaction({
    outletId,
    orderNumber: generateOrderNumber(),
    orderType: input.orderType as PrismaOrderType,
    status: isCash ? "COMPLETED" : "OPEN",
    tableId: input.tableId ?? null,
    customerName: input.customerName ?? null,
    cashierId: cashierId ?? undefined,
    subtotal: subtotal.toFixed(2),
    taxAmount: taxAmount.toFixed(2),
    serviceChargeAmount: serviceChargeAmount.toFixed(2),
    totalAmount: totalAmount.toFixed(2),
    completedAt: isCash ? new Date() : null,
    items: { create: orderItems },
    ...(isCash
      ? {
          payments: {
            create: {
              method: "CASH",
              status: "PAID",
              amount: totalAmount.toFixed(2),
              paidAt: new Date(),
            },
          },
        }
      : {}),
  });

  const dto = toOrderDto(order);
  emitOrderCreated(getIO(), outletId, dto);

  if (isCash) return dto;

  const payment = await createPendingPayment(
    {
      id: order.id,
      orderNumber: order.orderNumber,
      totalAmount: order.totalAmount.toString(),
      customerName: order.customerName,
    },
    input.paymentMethod,
  );

  return { ...dto, payments: [...dto.payments, toPaymentDto(payment)] };
}
