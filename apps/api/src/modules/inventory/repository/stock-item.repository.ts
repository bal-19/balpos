import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../../database/prisma.js";

type Db = PrismaClient | Prisma.TransactionClient;

export function findManyStockItems(outletId: string) {
  return prisma.stockItem.findMany({ where: { outletId }, orderBy: { name: "asc" } });
}

export function findStockItemById(id: string, outletId: string, db: Db = prisma) {
  return db.stockItem.findFirst({ where: { id, outletId } });
}

export function createStockItem(data: Prisma.StockItemUncheckedCreateInput) {
  return prisma.stockItem.create({ data });
}

export function updateStockItem(id: string, data: Prisma.StockItemUpdateInput) {
  return prisma.stockItem.update({ where: { id }, data });
}

export function incrementStock(db: Db, id: string, amount: string) {
  return db.stockItem.update({ where: { id }, data: { currentStock: { increment: amount } } });
}

export function decrementStock(db: Db, id: string, amount: string) {
  return db.stockItem.update({ where: { id }, data: { currentStock: { decrement: amount } } });
}

export function createMovement(db: Db, data: Prisma.StockMovementUncheckedCreateInput) {
  return db.stockMovement.create({ data });
}
