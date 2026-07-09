import type { Prisma, PrismaClient, PointHistoryType } from "@prisma/client";
import { prisma } from "../../../database/prisma.js";

type Db = PrismaClient | Prisma.TransactionClient;

export function findPointHistories(customerId: string) {
  return prisma.pointHistory.findMany({ where: { customerId }, orderBy: { createdAt: "desc" } });
}

export function createPointHistory(
  db: Db,
  data: { customerId: string; type: PointHistoryType; points: number; note: string | null; orderId: string | null },
) {
  return db.pointHistory.create({ data });
}

export function adjustCustomerPointBalance(db: Db, customerId: string, delta: number) {
  return db.customer.update({ where: { id: customerId }, data: { pointBalance: { increment: delta } } });
}
