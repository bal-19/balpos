import { AppError, NotFoundError } from "../../../shared/errors/app-error.js";
import { toCategoryDto } from "../dto/category.dto.js";
import type { CreateCategoryInput, UpdateCategoryInput } from "../schema/category.schema.js";
import {
  countActiveProductsInCategory,
  createCategory,
  deleteCategory,
  findCategoryById,
  findManyCategories,
  updateCategory,
} from "../repository/category.repository.js";

export async function listCategories(outletId: string) {
  const categories = await findManyCategories(outletId);
  return categories.map(toCategoryDto);
}

export async function createOutletCategory(outletId: string, input: CreateCategoryInput) {
  const category = await createCategory({ ...input, outletId });
  return toCategoryDto(category);
}

export async function updateOutletCategory(id: string, outletId: string, input: UpdateCategoryInput) {
  const existing = await findCategoryById(id, outletId);
  if (!existing) throw new NotFoundError("Kategori tidak ditemukan");

  const category = await updateCategory(id, input);
  return toCategoryDto(category);
}

export async function deleteOutletCategory(id: string, outletId: string) {
  const existing = await findCategoryById(id, outletId);
  if (!existing) throw new NotFoundError("Kategori tidak ditemukan");

  const activeProductCount = await countActiveProductsInCategory(id);
  if (activeProductCount > 0) {
    throw new AppError("Kategori masih punya produk aktif, pindahkan/hapus produk dulu", 400);
  }

  await deleteCategory(id);
}
