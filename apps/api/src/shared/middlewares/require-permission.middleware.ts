import type { PermissionCode } from "@restaurant-pos/types";
import type { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../errors/app-error.js";

export function requirePermission(code: PermissionCode) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user?.permissions.includes(code)) {
      next(new ForbiddenError("Anda tidak punya akses untuk aksi ini"));
      return;
    }
    next();
  };
}
