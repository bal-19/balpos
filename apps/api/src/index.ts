import "dotenv/config";
import { startServer } from "./core/server.js";

startServer().catch((err) => {
  console.error("[api] failed to start", err);
  process.exit(1);
});
