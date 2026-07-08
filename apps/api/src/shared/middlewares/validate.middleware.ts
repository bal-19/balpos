import type { NextFunction, Request, RequestHandler, Response } from "express";
import type { ZodTypeAny } from "zod";
import { AppError } from "../errors/app-error.js";

type ValidateSource = "body" | "query" | "params";

export function validate(schema: ZodTypeAny, source: ValidateSource = "body"): RequestHandler {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      next(new AppError("Validasi gagal", 400, result.error.flatten()));
      return;
    }

    (req as unknown as Record<ValidateSource, unknown>)[source] = result.data;
    next();
  };
}
