import type { ErrorRequestHandler } from "express";
import { AppError } from "../errors/app-error.js";
import { fail } from "../http/response.js";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof AppError) {
    fail(res, err.message, err.statusCode, err.details);
    return;
  }

  console.error(err);
  fail(res, "Internal server error", 500);
};
