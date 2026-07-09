import type { Prisma } from "@prisma/client";
import type { NextFunction, Request, Response } from "express";
import { createAuditLog } from "../../modules/audit-log/repository/audit-log.repository.js";

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const SENSITIVE_FIELDS = ["password", "token", "accessToken", "refreshToken", "secret"];

function sanitizeBody(body: unknown): Record<string, unknown> | undefined {
  if (!body || typeof body !== "object") return undefined;
  const clone: Record<string, unknown> = { ...(body as Record<string, unknown>) };
  for (const field of SENSITIVE_FIELDS) {
    if (field in clone) clone[field] = "[REDACTED]";
  }
  return clone;
}

/**
 * Audit capture global lintas-module (docs/10-features.md — "Audit Log" dipetakan
 * ke shared/core, dicatat lewat middleware, bukan panggilan manual per-module).
 * req.user dibaca lazily di res.on("finish") karena requireAuth per-router baru
 * mengisi req.user saat route yang match dieksekusi — pada saat response selesai
 * dikirim, chain (termasuk requireAuth & handler) sudah tuntas.
 */
export function auditLogMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!MUTATING_METHODS.has(req.method)) {
    next();
    return;
  }

  const sanitizedBody = sanitizeBody(req.body);

  res.on("finish", () => {
    const user = req.user;
    if (!user) return;

    createAuditLog({
      tenantId: user.tenantId,
      outletId: user.outletId,
      userId: user.sub,
      userName: user.name,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      requestBody: sanitizedBody as Prisma.InputJsonValue | undefined,
    }).catch((err) => console.error("[audit-log] gagal menyimpan entry", err));
  });

  next();
}
