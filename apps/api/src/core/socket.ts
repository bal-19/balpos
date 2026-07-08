import type { Server as HttpServer } from "node:http";
import { Server as SocketIOServer } from "socket.io";
import { env } from "../config/env.js";

let ioInstance: SocketIOServer | undefined;

/**
 * Socket.IO server generik. Event & room per outlet/tenant didefinisikan
 * di masing-masing module (`modules/<name>/events/`) — lihat
 * docs/07-realtime-architecture.md.
 */
export function createSocketServer(httpServer: HttpServer): SocketIOServer {
  const io = new SocketIOServer(httpServer, {
    cors: { origin: env.CORS_ORIGIN, credentials: true },
  });

  io.on("connection", (socket) => {
    console.log(`[socket] connected: ${socket.id}`);

    socket.on("join-outlet", (outletId: string) => {
      socket.join(`outlet:${outletId}`);
    });

    socket.on("disconnect", () => {
      console.log(`[socket] disconnected: ${socket.id}`);
    });
  });

  ioInstance = io;
  return io;
}

/** Dipakai service module lain (mis. pos/order) untuk emit event tanpa import core/server.ts langsung. */
export function getIO(): SocketIOServer {
  if (!ioInstance) {
    throw new Error("Socket.IO belum diinisialisasi — pastikan createSocketServer() sudah dipanggil");
  }
  return ioInstance;
}
