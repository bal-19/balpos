import { prisma } from "../../../database/prisma.js";
import type { Prisma } from "@prisma/client";

export function findManyProducts(outletId: string, categoryId?: string) {
  return prisma.product.findMany({
    where: { outletId, categoryId, deletedAt: null },
    orderBy: { sortOrder: "asc" },
  });
}

export function findProductById(id: string, outletId: string) {
  return prisma.product.findFirst({ where: { id, outletId, deletedAt: null } });
}

export function findCategoryByIdForOutlet(categoryId: string, outletId: string) {
  return prisma.category.findFirst({ where: { id: categoryId, outletId } });
}

export function createProduct(data: Prisma.ProductUncheckedCreateInput) {
  return prisma.product.create({ data });
}

export function updateProduct(id: string, data: Prisma.ProductUpdateInput) {
  return prisma.product.update({ where: { id }, data });
}

export function softDeleteProduct(id: string) {
  return prisma.product.update({
    where: { id },
    data: { deletedAt: new Date(), isAvailable: false },
  });
}
