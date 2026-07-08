import type { Order } from "@restaurant-pos/types";
import type { Server as SocketIOServer } from "socket.io";

/** Lihat docs/07-realtime-architecture.md — konsumer (kitchen-display dst.) menyusul di iterasi berikutnya. */
export function emitOrderCreated(io: SocketIOServer, outletId: string, order: Order) {
  io.to(`outlet:${outletId}`).emit("order:created", order);
}
