import { apiReference } from "@scalar/express-api-reference";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { env } from "../config/env.js";
import { authRoutes } from "../modules/auth/routes/auth.routes.js";
import { dashboardRoutes } from "../modules/dashboard/routes/dashboard.routes.js";
import { posRoutes } from "../modules/pos/routes/pos.routes.js";
import { settingsRoutes } from "../modules/settings/routes/settings.routes.js";
import { errorHandler } from "../shared/middlewares/error-handler.js";
import { notFoundHandler } from "../shared/middlewares/not-found.js";
import { openApiDocument } from "./openapi.js";

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

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

  app.use("/api/auth", authRoutes);
  app.use("/api/settings", settingsRoutes);
  app.use("/api/pos", posRoutes);
  app.use("/api/dashboard", dashboardRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
