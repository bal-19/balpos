import type { Product as ProductDto } from "@restaurant-pos/types";
import type { Product } from "@prisma/client";

export function toProductDto(product: Product): ProductDto {
  return {
    id: product.id,
    outletId: product.outletId,
    categoryId: product.categoryId,
    name: product.name,
    description: product.description,
    price: product.price.toString(),
    imageUrl: product.imageUrl,
    isAvailable: product.isAvailable,
    sortOrder: product.sortOrder,
  };
}
