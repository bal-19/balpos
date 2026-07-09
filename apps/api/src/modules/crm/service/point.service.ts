import type { Prisma, PrismaClient } from "@prisma/client";
import type { PointHistory as PointHistoryDto } from "@restaurant-pos/types";
import { prisma } from "../../../database/prisma.js";
import { adjustCustomerPointBalance, createPointHistory, findPointHistories } from "../repository/point.repository.js";

type Db = PrismaClient | Prisma.TransactionClient;

/**
 * Rate poin sederhana: 1 poin per Rp 10.000 dari total order, dibulatkan ke
 * bawah. Belum dikonfigurasi lewat StoreSetting — nilai tetap untuk MVP.
 */
const POINTS_PER_IDR = 10_000;

export function calculatePointsEarned(orderTotal: number): number {
  return Math.floor(orderTotal / POINTS_PER_IDR);
}

/** Dipanggil `modules/pos` (cash) & `modules/payment` (non-cash) setelah order COMPLETED. */
export async function earnPointsForOrder(
  customerId: string,
  orderId: string,
  orderTotal: number,
  db: Db = prisma,
) {
  const points = calculatePointsEarned(orderTotal);
  if (points <= 0) return;

  await createPointHistory(db, {
    customerId,
    type: "EARN",
    points,
    note: `Poin dari order ${orderId}`,
    orderId,
  });
  await adjustCustomerPointBalance(db, customerId, points);
}

function toPointHistoryDto(entry: {
  id: string;
  customerId: string;
  type: string;
  points: number;
  note: string | null;
  orderId: string | null;
  createdAt: Date;
}): PointHistoryDto {
  return {
    id: entry.id,
    customerId: entry.customerId,
    type: entry.type as PointHistoryDto["type"],
    points: entry.points,
    note: entry.note,
    orderId: entry.orderId,
    createdAt: entry.createdAt.toISOString(),
  };
}

export async function listPointHistories(customerId: string) {
  const histories = await findPointHistories(customerId);
  return histories.map(toPointHistoryDto);
}
