import type { PaymentMethod } from "@restaurant-pos/types";
import { getIO } from "../../../core/socket.js";
import { earnPointsForOrder } from "../../crm/service/point.service.js";
import {
  createPayment,
  findOrderById,
  findPaymentByReference,
  markOrderCompleted,
  markPaymentStatus,
} from "../repository/payment.repository.js";
import { createXenditInvoice } from "../utils/xendit.util.js";

interface OrderForPayment {
  id: string;
  orderNumber: string;
  totalAmount: string;
  customerName: string | null;
}

/** Dipanggil saat checkout dengan method selain CASH — bikin Xendit invoice + simpan Payment PENDING. */
export async function createPendingPayment(order: OrderForPayment, method: PaymentMethod) {
  const { invoiceId, invoiceUrl } = await createXenditInvoice({
    externalId: order.id,
    amount: Math.round(Number(order.totalAmount)),
    description: `Pembayaran order ${order.orderNumber}`,
    customerName: order.customerName,
  });

  return createPayment({
    orderId: order.id,
    method,
    status: "PENDING",
    amount: order.totalAmount,
    referenceNumber: invoiceId,
    paymentUrl: invoiceUrl,
  });
}

/** Dipanggil dari webhook Xendit — samakan status Payment & Order, lalu broadcast realtime. */
export async function settlePaymentByReference(referenceNumber: string, xenditStatus: string) {
  const payment = await findPaymentByReference(referenceNumber);
  if (!payment) return;

  const isPaid = xenditStatus === "PAID" || xenditStatus === "SETTLED";
  const newStatus = isPaid ? "PAID" : "FAILED";

  await markPaymentStatus(payment.id, newStatus, isPaid ? new Date() : null);
  if (isPaid) await markOrderCompleted(payment.orderId);

  const order = await findOrderById(payment.orderId);
  if (!order) return;

  const io = getIO();
  io.to(`outlet:${order.outletId}`).emit("payment:status.updated", {
    orderId: order.id,
    paymentStatus: newStatus,
    paymentUrl: payment.paymentUrl,
  });

  if (isPaid) {
    io.to(`outlet:${order.outletId}`).emit("order:completed", { orderId: order.id });
    if (order.customerId) {
      await earnPointsForOrder(order.customerId, order.id, order.totalAmount.toNumber());
    }
  }
}
