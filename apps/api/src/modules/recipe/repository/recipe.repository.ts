import type { Prisma, PrismaClient } from "@prisma/client";
import { prisma } from "../../../database/prisma.js";

type Db = PrismaClient | Prisma.TransactionClient;

export function findRecipeByProduct(productId: string) {
  return prisma.recipe.findUnique({
    where: { productId },
    include: { ingredients: { include: { stockItem: true } } },
  });
}

/** Dipakai `modules/inventory` (pre-check & consume) — bisa jalan di dalam/luar transaksi. */
export function getIngredientsForProduct(productId: string, db: Db = prisma) {
  return db.recipeIngredient.findMany({
    where: { recipe: { productId } },
    include: { stockItem: true },
  });
}

export function deleteIngredientsForRecipe(recipeId: string) {
  return prisma.recipeIngredient.deleteMany({ where: { recipeId } });
}

export function upsertRecipe(productId: string, outletId: string) {
  return prisma.recipe.upsert({
    where: { productId },
    update: {},
    create: { productId, outletId },
  });
}

export function createIngredients(data: Prisma.RecipeIngredientCreateManyInput[]) {
  return prisma.recipeIngredient.createMany({ data });
}
