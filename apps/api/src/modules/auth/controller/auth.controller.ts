import type { Request, Response } from "express";
import { env } from "../../../config/env.js";
import { UnauthorizedError } from "../../../shared/errors/app-error.js";
import { ok } from "../../../shared/http/response.js";
import * as authService from "../service/auth.service.js";
import type { LoginInput } from "../schema/auth.schema.js";
import { parseDurationToMs } from "../utils/jwt.util.js";

const REFRESH_COOKIE_NAME = "refreshToken";
const REFRESH_COOKIE_PATH = "/api/auth";

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: env.NODE_ENV === "production",
    path: REFRESH_COOKIE_PATH,
    maxAge: parseDurationToMs(env.JWT_REFRESH_EXPIRES_IN),
  });
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body as LoginInput;
  const { user, accessToken, refreshToken } = await authService.login(email, password);

  setRefreshCookie(res, refreshToken);
  ok(res, { user, accessToken });
}

export async function refreshTokenHandler(req: Request, res: Response) {
  const token = req.cookies?.[REFRESH_COOKIE_NAME] as string | undefined;
  if (!token) throw new UnauthorizedError("Refresh token tidak ditemukan");

  const { user, accessToken, refreshToken } = await authService.refresh(token);

  setRefreshCookie(res, refreshToken);
  ok(res, { user, accessToken });
}

export function logout(_req: Request, res: Response) {
  res.clearCookie(REFRESH_COOKIE_NAME, { path: REFRESH_COOKIE_PATH });
  ok(res, { success: true });
}

export function me(req: Request, res: Response) {
  if (!req.user) throw new UnauthorizedError();
  ok(res, authService.getMe(req.user));
}
