import type { Category as CategoryDto } from "@restaurant-pos/types";
import type { Category } from "@prisma/client";

export function toCategoryDto(category: Category): CategoryDto {
  return {
    id: category.id,
    outletId: category.outletId,
    name: category.name,
    sortOrder: category.sortOrder,
    isActive: category.isActive,
  };
}
