import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../../modules/auth/utils/jwt.util.js";
import { UnauthorizedError } from "../errors/app-error.js";

export function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    next(new UnauthorizedError("Token tidak ditemukan"));
    return;
  }

  try {
    req.user = verifyAccessToken(header.slice("Bearer ".length));
    next();
  } catch {
    next(new UnauthorizedError("Token tidak valid atau kedaluwarsa"));
  }
}
