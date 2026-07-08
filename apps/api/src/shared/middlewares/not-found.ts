import type { Request, Response } from "express";
import { fail } from "../http/response.js";

export function notFoundHandler(req: Request, res: Response) {
  fail(res, `Route not found: ${req.method} ${req.originalUrl}`, 404);
}
