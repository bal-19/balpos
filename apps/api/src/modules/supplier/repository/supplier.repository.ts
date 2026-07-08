import type { Prisma } from "@prisma/client";
import { prisma } from "../../../database/prisma.js";

export function findManySuppliers(outletId: string) {
  return prisma.supplier.findMany({ where: { outletId }, orderBy: { name: "asc" } });
}

export function findSupplierById(id: string, outletId: string) {
  return prisma.supplier.findFirst({ where: { id, outletId } });
}

export function createSupplier(data: Prisma.SupplierUncheckedCreateInput) {
  return prisma.supplier.create({ data });
}

export function updateSupplier(id: string, data: Prisma.SupplierUpdateInput) {
  return prisma.supplier.update({ where: { id }, data });
}

export function deleteSupplier(id: string) {
  return prisma.supplier.delete({ where: { id } });
}
