import type { NextFunction, Request, RequestHandler, Response } from "express";

/**
 * Express 4 tidak meneruskan rejection dari async handler ke error
 * middleware secara otomatis — bungkus semua controller async dengan ini.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
