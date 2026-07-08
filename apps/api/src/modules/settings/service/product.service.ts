import { AppError, NotFoundError } from "../../../shared/errors/app-error.js";
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

export async function listProducts(outletId: string, categoryId?: string) {
  const products = await findManyProducts(outletId, categoryId);
  return products.map(toProductDto);
}

async function assertCategoryBelongsToOutlet(categoryId: string, outletId: string) {
  const category = await findCategoryByIdForOutlet(categoryId, outletId);
  if (!category) throw new AppError("Kategori tidak ditemukan di outlet ini", 400);
}

export async function createOutletProduct(outletId: string, input: CreateProductInput) {
  await assertCategoryBelongsToOutlet(input.categoryId, outletId);
  const product = await createProduct({ ...input, outletId });
  return toProductDto(product);
}

export async function updateOutletProduct(id: string, outletId: string, input: UpdateProductInput) {
  const existing = await findProductById(id, outletId);
  if (!existing) throw new NotFoundError("Produk tidak ditemukan");

  if (input.categoryId) {
    await assertCategoryBelongsToOutlet(input.categoryId, outletId);
  }

  const product = await updateProduct(id, input);
  return toProductDto(product);
}

export async function deleteOutletProduct(id: string, outletId: string) {
  const existing = await findProductById(id, outletId);
  if (!existing) throw new NotFoundError("Produk tidak ditemukan");

  await softDeleteProduct(id);
}
