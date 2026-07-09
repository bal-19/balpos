import type { OrderType as PrismaOrderType } from "@prisma/client";
import { getIO } from "../../../core/socket.js";
import { AppError } from "../../../shared/errors/app-error.js";
import { findCustomerById } from "../../crm/repository/customer.repository.js";
import { earnPointsForOrder } from "../../crm/service/point.service.js";
import { assertStockAvailableForOrder } from "../../inventory/service/stock.service.js";
import { createPendingPayment } from "../../payment/service/payment.service.js";
import { resolvePromotionForOrder } from "../../promotion/service/promotion.service.js";
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
  if (input.customerId) {
    const customer = await findCustomerById(input.customerId, outletId);
    if (!customer) throw new AppError("Pelanggan tidak ditemukan", 400);
  }

  const productIds = input.items.map((item) => item.productId);
  const products = await assertProductsAvailable(outletId, productIds);
  const productMap = new Map(products.map((product) => [product.id, product]));

  await assertStockAvailableForOrder(
    input.items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
  );

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

  const resolvedPromotion = await resolvePromotionForOrder(outletId, {
    code: input.promoCode,
    subtotal,
    items: input.items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: productMap.get(item.productId)!.price.toNumber(),
    })),
  });
  const discountAmount = resolvedPromotion?.discountAmount ?? 0;

  const storeSetting = await findStoreSettingForOutlet(outletId);
  const taxPercent = storeSetting ? storeSetting.taxPercent.toNumber() : 0;
  const serviceChargePercent = storeSetting ? storeSetting.serviceChargePercent.toNumber() : 0;

  const taxableAmount = round2(subtotal - discountAmount);
  const taxAmount = round2(taxableAmount * (taxPercent / 100));
  const serviceChargeAmount = round2(taxableAmount * (serviceChargePercent / 100));
  const totalAmount = round2(taxableAmount + taxAmount + serviceChargeAmount);

  const isCash = input.paymentMethod === "CASH";

  const order = await createOrderTransaction(
    {
      outletId,
      orderNumber: generateOrderNumber(),
      orderType: input.orderType as PrismaOrderType,
      status: isCash ? "COMPLETED" : "OPEN",
      tableId: input.tableId ?? null,
      customerId: input.customerId ?? null,
      customerName: input.customerName ?? null,
      cashierId: cashierId ?? undefined,
      subtotal: subtotal.toFixed(2),
      taxAmount: taxAmount.toFixed(2),
      serviceChargeAmount: serviceChargeAmount.toFixed(2),
      discountAmount: discountAmount.toFixed(2),
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
    },
    outletId,
    input.items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
    resolvedPromotion
      ? { promotionId: resolvedPromotion.promotionId, discountAmount: discountAmount.toFixed(2) }
      : undefined,
  );

  const dto = toOrderDto(order);
  emitOrderCreated(getIO(), outletId, dto);

  if (isCash) {
    if (input.customerId) await earnPointsForOrder(input.customerId, order.id, totalAmount);
    return dto;
  }

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
