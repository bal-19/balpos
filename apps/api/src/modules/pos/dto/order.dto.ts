import type { Order as OrderDto, OrderItem as OrderItemDto, Payment as PaymentDto } from "@restaurant-pos/types";
import type { Order, OrderItem, Payment } from "@prisma/client";

export type OrderWithRelations = Order & { items: OrderItem[]; payments: Payment[] };

export function toOrderItemDto(item: OrderItem): OrderItemDto {
  return {
    id: item.id,
    productId: item.productId,
    productNameSnapshot: item.productNameSnapshot,
    unitPrice: item.unitPrice.toString(),
    quantity: item.quantity,
    notes: item.notes,
    subtotal: item.subtotal.toString(),
    kitchenStatus: item.kitchenStatus,
  };
}

export function toPaymentDto(payment: Payment): PaymentDto {
  return {
    id: payment.id,
    method: payment.method,
    status: payment.status,
    amount: payment.amount.toString(),
    paymentUrl: payment.paymentUrl,
    paidAt: payment.paidAt ? payment.paidAt.toISOString() : null,
  };
}

export function toOrderDto(order: OrderWithRelations): OrderDto {
  return {
    id: order.id,
    outletId: order.outletId,
    orderNumber: order.orderNumber,
    orderType: order.orderType,
    status: order.status,
    tableId: order.tableId,
    customerId: order.customerId,
    customerName: order.customerName,
    cashierId: order.cashierId,
    subtotal: order.subtotal.toString(),
    taxAmount: order.taxAmount.toString(),
    serviceChargeAmount: order.serviceChargeAmount.toString(),
    discountAmount: order.discountAmount.toString(),
    totalAmount: order.totalAmount.toString(),
    notes: order.notes,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map(toOrderItemDto),
    payments: order.payments.map(toPaymentDto),
  };
}
