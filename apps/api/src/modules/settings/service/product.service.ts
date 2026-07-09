import { AppError, NotFoundError } from "../../../shared/errors/app-error.js";
import { getOrSetCache, invalidateCache } from "../../../core/cache.js";
import { toProductDto } from "../dto/product.dto.js";
import type { CreateProductInput, UpdateProductInput } from "../schema/product.schema.js";
import {
  createProduct,
  findCategoryByIdForOutlet,
  findManyProducts,
  findProductById,
  softDeleteProduct,
  updateProduct,
} from "../repository/product.repository.js";

const CACHE_TTL_SECONDS = 300;

function productsCacheKey(outletId: string, categoryId?: string): string {
  return `settings:${outletId}:products:${categoryId ?? "all"}`;
}

async function invalidateProductCaches(outletId: string, categoryIds: (string | undefined)[]) {
  await invalidateCache(productsCacheKey(outletId));
  for (const categoryId of categoryIds) {
    if (categoryId) await invalidateCache(productsCacheKey(outletId, categoryId));
  }
}

export async function listProducts(outletId: string, categoryId?: string) {
  return getOrSetCache(productsCacheKey(outletId, categoryId), CACHE_TTL_SECONDS, async () => {
    const products = await findManyProducts(outletId, categoryId);
    return products.map(toProductDto);
  });
}

async function assertCategoryBelongsToOutlet(categoryId: string, outletId: string) {
  const category = await findCategoryByIdForOutlet(categoryId, outletId);
  if (!category) throw new AppError("Kategori tidak ditemukan di outlet ini", 400);
}

export async function createOutletProduct(outletId: string, input: CreateProductInput) {
  await assertCategoryBelongsToOutlet(input.categoryId, outletId);
  const product = await createProduct({ ...input, outletId });
  await invalidateProductCaches(outletId, [input.categoryId]);
  return toProductDto(product);
}

export async function updateOutletProduct(id: string, outletId: string, input: UpdateProductInput) {
  const existing = await findProductById(id, outletId);
  if (!existing) throw new NotFoundError("Produk tidak ditemukan");

  if (input.categoryId) {
    await assertCategoryBelongsToOutlet(input.categoryId, outletId);
  }

  const product = await updateProduct(id, input);
  await invalidateProductCaches(outletId, [existing.categoryId, input.categoryId]);
  return toProductDto(product);
}

export async function deleteOutletProduct(id: string, outletId: string) {
  const existing = await findProductById(id, outletId);
  if (!existing) throw new NotFoundError("Produk tidak ditemukan");

  await softDeleteProduct(id);
  await invalidateProductCaches(outletId, [existing.categoryId]);
}
