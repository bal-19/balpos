import { prisma } from "../../../database/prisma.js";
import type { Prisma } from "@prisma/client";

export function findManyCategories(outletId: string) {
  return prisma.category.findMany({
    where: { outletId },
    orderBy: { sortOrder: "asc" },
  });
}

export function findCategoryById(id: string, outletId: string) {
  return prisma.category.findFirst({ where: { id, outletId } });
}

export function countActiveProductsInCategory(categoryId: string) {
  return prisma.product.count({ where: { categoryId, deletedAt: null } });
}

export function createCategory(data: Prisma.CategoryUncheckedCreateInput) {
  return prisma.category.create({ data });
}

export function updateCategory(id: string, data: Prisma.CategoryUpdateInput) {
  return prisma.category.update({ where: { id }, data });
}

export function deleteCategory(id: string) {
  return prisma.category.delete({ where: { id } });
}
