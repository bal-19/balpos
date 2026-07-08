import { prisma } from "../../../database/prisma.js";

export function findManyTables(outletId: string) {
  return prisma.table.findMany({
    where: { outletId, isActive: true },
    orderBy: { name: "asc" },
  });
}

export function findTableForOutlet(id: string, outletId: string) {
  return prisma.table.findFirst({ where: { id, outletId, isActive: true } });
}
