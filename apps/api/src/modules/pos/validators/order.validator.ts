import { AppError } from "../../../shared/errors/app-error.js";
import { findTableForOutlet } from "../repository/table.repository.js";
import { findAvailableProducts } from "../repository/order.repository.js";
import type { CreateOrderInput } from "../schema/order.schema.js";

export function assertDineInHasTable(input: Pick<CreateOrderInput, "orderType" | "tableId">) {
  if (input.orderType === "DINE_IN" && !input.tableId) {
    throw new AppError("Order dine-in wajib memilih meja", 400);
  }
}

export async function assertTableIsValid(outletId: string, tableId: string) {
  const table = await findTableForOutlet(tableId, outletId);
  if (!table) throw new AppError("Meja tidak ditemukan/tidak aktif", 400);
}

export async function assertProductsAvailable(outletId: string, productIds: string[]) {
  const products = await findAvailableProducts(outletId, productIds);
  if (products.length !== new Set(productIds).size) {
    throw new AppError("Ada produk yang tidak tersedia/tidak ditemukan", 400);
  }
  return products;
}
