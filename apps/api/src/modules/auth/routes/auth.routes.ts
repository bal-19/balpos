import { Router } from "express";
import { asyncHandler } from "../../../shared/middlewares/async-handler.js";
import { requireAuth } from "../../../shared/middlewares/require-auth.middleware.js";
import { validate } from "../../../shared/middlewares/validate.middleware.js";
import * as authController from "../controller/auth.controller.js";
import { loginSchema } from "../schema/auth.schema.js";

export const authRoutes = Router();

authRoutes.post("/login", validate(loginSchema), asyncHandler(authController.login));
authRoutes.post("/refresh", asyncHandler(authController.refreshTokenHandler));
authRoutes.post("/logout", authController.logout);
authRoutes.get("/me", requireAuth, authController.me);
