import type { PurchaseOrder, PurchaseOrderItem, StockItem, Supplier } from "@prisma/client";
import type { PurchaseOrder as PurchaseOrderDto } from "@restaurant-pos/types";
import { prisma } from "../../../database/prisma.js";
import { AppError, NotFoundError } from "../../../shared/errors/app-error.js";
import { receiveStock } from "../../inventory/service/stock.service.js";
import {
  createPurchaseOrder,
  findManyPurchaseOrders,
  findPurchaseOrderById,
  markPurchaseOrderReceived,
} from "../repository/purchase-order.repository.js";
import type { CreatePurchaseOrderInput } from "../schema/purchase-order.schema.js";

type PurchaseOrderWithRelations = PurchaseOrder & {
  supplier: Supplier;
  items: (PurchaseOrderItem & { stockItem: StockItem })[];
};

function toPurchaseOrderDto(po: PurchaseOrderWithRelations): PurchaseOrderDto {
  return {
    id: po.id,
    outletId: po.outletId,
    supplierId: po.supplierId,
    supplierName: po.supplier.name,
    orderNumber: po.orderNumber,
    status: po.status,
    totalAmount: po.totalAmount.toString(),
    notes: po.notes,
    receivedAt: po.receivedAt ? po.receivedAt.toISOString() : null,
    createdAt: po.createdAt.toISOString(),
    items: po.items.map((item) => ({
      id: item.id,
      stockItemId: item.stockItemId,
      stockItemName: item.stockItem.name,
      unit: item.stockItem.unit,
      quantity: item.quantity.toString(),
      unitCost: item.unitCost.toString(),
      subtotal: item.subtotal.toString(),
    })),
  };
}

function generatePoNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `PO-${timestamp}-${random}`;
}

export async function listPurchaseOrders(outletId: string) {
  const orders = await findManyPurchaseOrders(outletId);
  return orders.map(toPurchaseOrderDto);
}

export async function getPurchaseOrder(id: string, outletId: string) {
  const po = await findPurchaseOrderById(id, outletId);
  if (!po) throw new NotFoundError("Purchase order tidak ditemukan");
  return toPurchaseOrderDto(po);
}

export async function createOutletPurchaseOrder(outletId: string, input: CreatePurchaseOrderInput) {
  let totalAmount = 0;
  const items = input.items.map((item) => {
    const subtotal = Number(item.quantity) * Number(item.unitCost);
    totalAmount += subtotal;
    return {
      stockItemId: item.stockItemId,
      quantity: item.quantity,
      unitCost: item.unitCost,
      subtotal: subtotal.toFixed(2),
    };
  });

  const po = await createPurchaseOrder({
    outletId,
    supplierId: input.supplierId,
    orderNumber: generatePoNumber(),
    notes: input.notes ?? null,
    totalAmount: totalAmount.toFixed(2),
    items: { create: items },
  });

  return toPurchaseOrderDto(po);
}

export async function receivePurchaseOrder(id: string, outletId: string) {
  const existing = await findPurchaseOrderById(id, outletId);
  if (!existing) throw new NotFoundError("Purchase order tidak ditemukan");
  if (existing.status === "RECEIVED") throw new AppError("Purchase order sudah diterima", 400);
  if (existing.status === "CANCELLED") throw new AppError("Purchase order sudah dibatalkan", 400);

  const po = await prisma.$transaction(async (tx) => {
    await receiveStock(
      tx,
      outletId,
      existing.items.map((item) => ({ stockItemId: item.stockItemId, quantity: item.quantity.toString() })),
      id,
    );
    return markPurchaseOrderReceived(tx, id);
  });

  return toPurchaseOrderDto(po);
}
