import type { StockItem as StockItemDto } from "@restaurant-pos/types";
import type { Prisma, StockItem } from "@prisma/client";
import { prisma } from "../../../database/prisma.js";
import { AppError, NotFoundError } from "../../../shared/errors/app-error.js";
import { getIngredientsForProduct } from "../../recipe/repository/recipe.repository.js";
import {
  createMovement,
  createStockItem,
  decrementStock,
  findManyStockItems,
  findStockItemById,
  incrementStock,
  updateStockItem,
} from "../repository/stock-item.repository.js";
import type { AdjustStockInput, CreateStockItemInput, UpdateStockItemInput } from "../schema/stock-item.schema.js";

function toStockItemDto(item: StockItem): StockItemDto {
  return {
    id: item.id,
    outletId: item.outletId,
    name: item.name,
    unit: item.unit,
    currentStock: item.currentStock.toString(),
    minStockThreshold: item.minStockThreshold.toString(),
    isLowStock: item.currentStock.lessThan(item.minStockThreshold),
  };
}

export async function listStockItems(outletId: string) {
  const items = await findManyStockItems(outletId);
  return items.map(toStockItemDto);
}

export async function createOutletStockItem(outletId: string, input: CreateStockItemInput) {
  const item = await createStockItem({ ...input, outletId });
  return toStockItemDto(item);
}

export async function updateOutletStockItem(id: string, outletId: string, input: UpdateStockItemInput) {
  const existing = await findStockItemById(id, outletId);
  if (!existing) throw new NotFoundError("Stock item tidak ditemukan");
  const item = await updateStockItem(id, input);
  return toStockItemDto(item);
}

export async function adjustOutletStock(id: string, outletId: string, input: AdjustStockInput) {
  const existing = await findStockItemById(id, outletId);
  if (!existing) throw new NotFoundError("Stock item tidak ditemukan");

  const item = await prisma.$transaction(async (tx) => {
    if (input.type === "OUT") {
      await decrementStock(tx, id, input.quantity);
    } else {
      await incrementStock(tx, id, input.quantity);
    }
    await createMovement(tx, {
      outletId,
      stockItemId: id,
      type: input.type,
      quantity: input.quantity,
      note: input.note ?? null,
      referenceType: "MANUAL",
    });
    return tx.stockItem.findUniqueOrThrow({ where: { id } });
  });

  return toStockItemDto(item);
}

/** Dipanggil `modules/pos` sebelum transaksi order dimulai — pre-check fail-fast. */
export async function assertStockAvailableForOrder(items: { productId: string; quantity: number }[]) {
  const required = new Map<string, number>();

  for (const item of items) {
    const ingredients = await getIngredientsForProduct(item.productId);
    for (const ingredient of ingredients) {
      const needed = ingredient.quantity.toNumber() * item.quantity;
      required.set(ingredient.stockItemId, (required.get(ingredient.stockItemId) ?? 0) + needed);
    }
  }

  for (const [stockItemId, needed] of required) {
    const stockItem = await prisma.stockItem.findUnique({ where: { id: stockItemId } });
    if (!stockItem || stockItem.currentStock.toNumber() < needed) {
      throw new AppError(
        `Stok "${stockItem?.name ?? stockItemId}" tidak cukup (butuh ${needed}, tersedia ${
          stockItem?.currentStock.toString() ?? 0
        })`,
        400,
      );
    }
  }
}

/**
 * Dipanggil di dalam transaksi order `modules/pos` — decrement stok + catat movement.
 * Return daftar stock item yang jatuh di bawah minStockThreshold (untuk notifikasi LOW_STOCK
 * yang dipicu oleh caller SETELAH transaksi commit — publishNotification pakai koneksi
 * Prisma terpisah dari `tx`, jadi tidak boleh dipanggil selagi transaksi masih berjalan).
 */
export async function consumeStockForOrder(
  tx: Prisma.TransactionClient,
  outletId: string,
  orderId: string,
  items: { productId: string; quantity: number }[],
): Promise<StockItem[]> {
  const lowStockAlerts: StockItem[] = [];

  for (const item of items) {
    const ingredients = await getIngredientsForProduct(item.productId, tx);
    for (const ingredient of ingredients) {
      const needed = (ingredient.quantity.toNumber() * item.quantity).toString();
      const updated = await decrementStock(tx, ingredient.stockItemId, needed);
      await createMovement(tx, {
        outletId,
        stockItemId: ingredient.stockItemId,
        type: "OUT",
        quantity: needed,
        referenceType: "ORDER",
        referenceId: orderId,
      });
      if (updated.currentStock.lessThan(updated.minStockThreshold)) {
        lowStockAlerts.push(updated);
      }
    }
  }

  return lowStockAlerts;
}

/** Dipanggil `modules/supplier` saat Purchase Order ditandai diterima. */
export async function receiveStock(
  tx: Prisma.TransactionClient,
  outletId: string,
  items: { stockItemId: string; quantity: string }[],
  referenceId: string,
) {
  for (const item of items) {
    await incrementStock(tx, item.stockItemId, item.quantity);
    await createMovement(tx, {
      outletId,
      stockItemId: item.stockItemId,
      type: "IN",
      quantity: item.quantity,
      referenceType: "PURCHASE_ORDER",
      referenceId,
    });
  }
}
