import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../../database/prisma.js";

type Db = PrismaClient | Prisma.TransactionClient;

export function findManyCustomers(outletId: string) {
  return prisma.customer.findMany({
    where: { outletId, deletedAt: null },
    include: { membershipTier: true },
    orderBy: { name: "asc" },
  });
}

export function findCustomerById(id: string, outletId: string, db: Db = prisma) {
  return db.customer.findFirst({
    where: { id, outletId, deletedAt: null },
    include: { membershipTier: true },
  });
}

export function createCustomer(data: Prisma.CustomerUncheckedCreateInput) {
  return prisma.customer.create({ data, include: { membershipTier: true } });
}

export function updateCustomer(id: string, data: Prisma.CustomerUpdateInput) {
  return prisma.customer.update({ where: { id }, data, include: { membershipTier: true } });
}

export function softDeleteCustomer(id: string) {
  return prisma.customer.update({ where: { id }, data: { deletedAt: new Date() } });
}
