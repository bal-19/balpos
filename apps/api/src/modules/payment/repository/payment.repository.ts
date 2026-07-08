import type { Prisma } from "@prisma/client";
import { prisma } from "../../../database/prisma.js";

export function createPayment(data: Prisma.PaymentUncheckedCreateInput) {
  return prisma.payment.create({ data });
}

export function findPaymentByReference(referenceNumber: string) {
  return prisma.payment.findFirst({ where: { referenceNumber } });
}

export function markPaymentStatus(id: string, status: "PAID" | "FAILED", paidAt: Date | null) {
  return prisma.payment.update({ where: { id }, data: { status, paidAt } });
}

export function markOrderCompleted(orderId: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status: "COMPLETED", completedAt: new Date() },
  });
}

export function findOrderById(orderId: string) {
  return prisma.order.findUnique({ where: { id: orderId }, include: { items: true, payments: true } });
}
