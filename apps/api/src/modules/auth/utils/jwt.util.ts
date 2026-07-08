import jwt from "jsonwebtoken";
import { env } from "../../../config/env.js";
import type { JwtAccessPayload, JwtRefreshPayload } from "../types/auth.types.js";

export function signAccessToken(payload: JwtAccessPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function signRefreshToken(payload: JwtRefreshPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as jwt.SignOptions["expiresIn"],
  });
}

export function verifyAccessToken(token: string): JwtAccessPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as unknown as JwtAccessPayload;
}

export function verifyRefreshToken(token: string): JwtRefreshPayload {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as unknown as JwtRefreshPayload;
}

const DURATION_MULTIPLIERS: Record<string, number> = {
  ms: 1,
  s: 1000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

/** Parse durasi ala jsonwebtoken ("15m", "7d") jadi milidetik, untuk cookie maxAge. */
export function parseDurationToMs(value: string, fallbackMs = 7 * 24 * 60 * 60 * 1000): number {
  const match = /^(\d+)(ms|s|m|h|d)$/.exec(value.trim());
  if (!match || !match[1] || !match[2]) return fallbackMs;

  return Number(match[1]) * DURATION_MULTIPLIERS[match[2]]!;
}
