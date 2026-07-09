import type { KitchenItemStatus, KitchenOrder } from "@restaurant-pos/types";
import { getIO } from "../../../core/socket.js";
import { NotFoundError } from "../../../shared/errors/app-error.js";
import { publishNotification } from "../../notification/service/notification.service.js";
import {
  countNonReadyItems,
  findActiveOrders,
  findOrderItemById,
  updateOrderItemStatus,
} from "../repository/kitchen.repository.js";

function toKitchenOrderDto(order: Awaited<ReturnType<typeof findActiveOrders>>[number]): KitchenOrder {
  return {
    id: order.id,
    orderNumber: order.orderNumber,
    orderType: order.orderType,
    tableName: order.table?.name ?? null,
    customerName: order.customerName,
    createdAt: order.createdAt.toISOString(),
    items: order.items.map((item) => ({
      id: item.id,
      productNameSnapshot: item.productNameSnapshot,
      quantity: item.quantity,
      notes: item.notes,
      kitchenStatus: item.kitchenStatus,
    })),
  };
}

export async function listActiveOrders(outletId: string): Promise<KitchenOrder[]> {
  const orders = await findActiveOrders(outletId);
  return orders.map(toKitchenOrderDto);
}

export async function updateItemStatus(itemId: string, status: KitchenItemStatus) {
  const item = await findOrderItemById(itemId);
  if (!item) throw new NotFoundError("Item order tidak ditemukan");

  const updated = await updateOrderItemStatus(itemId, status);
  const io = getIO();

  io.to(`outlet:${item.order.outletId}`).emit("order:item.updated", {
    orderId: item.orderId,
    itemId: updated.id,
    kitchenStatus: updated.kitchenStatus,
  });

  if (status === "READY") {
    const remaining = await countNonReadyItems(item.orderId);
    if (remaining === 0) {
      io.to(`outlet:${item.order.outletId}`).emit("kitchen:ready", { orderId: item.orderId });
      await publishNotification(item.order.outletId, "ORDER_READY", "Order Siap", "Order siap disajikan", {
        referenceType: "ORDER",
        referenceId: item.orderId,
      });
    }
  }

  return updated;
}
