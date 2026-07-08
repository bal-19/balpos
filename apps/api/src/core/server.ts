import { createServer } from "node:http";
import { env } from "../config/env.js";
import { prisma } from "../database/prisma.js";
import { createApp } from "./app.js";
import { redis } from "./redis.js";
import { createSocketServer } from "./socket.js";

export async function startServer() {
  const app = createApp();
  const httpServer = createServer(app);
  createSocketServer(httpServer);

  await prisma.$connect();
  redis.on("error", (err: Error) => console.error("[redis] connection error", err));

  httpServer.listen(env.PORT, () => {
    console.log(`[api] listening on http://localhost:${env.PORT}`);
    console.log(`[api] docs available at http://localhost:${env.PORT}/docs`);
  });

  const shutdown = async () => {
    console.log("[api] shutting down...");
    httpServer.close();
    await prisma.$disconnect();
    redis.disconnect();
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}
