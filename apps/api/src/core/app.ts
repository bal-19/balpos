import { apiReference } from "@scalar/express-api-reference";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { env } from "../config/env.js";
import { errorHandler } from "../shared/middlewares/error-handler.js";
import { notFoundHandler } from "../shared/middlewares/not-found.js";
import { openApiDocument } from "./openapi.js";

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.get("/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.get("/openapi.json", (_req, res) => {
    res.json(openApiDocument);
  });
  app.use(
    "/docs",
    apiReference({
      spec: { url: "/openapi.json" },
    }),
  );

  // Route per module dimount di sini mulai Phase 1, contoh:
  // app.use("/api/auth", authRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
