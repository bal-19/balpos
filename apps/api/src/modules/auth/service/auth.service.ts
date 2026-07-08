import type { AuthUser, PermissionCode } from "@restaurant-pos/types";
import { UnauthorizedError } from "../../../shared/errors/app-error.js";
import { findUserByEmail, findUserById, touchLastLogin, type UserWithAccess } from "../repository/user.repository.js";
import type { JwtAccessPayload } from "../types/auth.types.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt.util.js";
import { comparePassword } from "../utils/password.util.js";

function toAccessPayload(user: UserWithAccess): JwtAccessPayload {
  return {
    sub: user.id,
    tenantId: user.tenantId,
    outletId: user.outletId,
    roleId: user.roleId,
    roleCode: user.role.code,
    name: user.name,
    email: user.email,
    permissions: user.role.permissions.map((rp) => rp.permission.code) as PermissionCode[],
  };
}

function toAuthUser(payload: JwtAccessPayload): AuthUser {
  const { sub, ...rest } = payload;
  return { id: sub, ...rest };
}

export async function login(email: string, password: string) {
  const user = await findUserByEmail(email);
  if (!user || !user.isActive) {
    throw new UnauthorizedError("Email atau password salah");
  }

  const isPasswordValid = await comparePassword(password, user.passwordHash);
  if (!isPasswordValid) {
    throw new UnauthorizedError("Email atau password salah");
  }

  await touchLastLogin(user.id);

  const payload = toAccessPayload(user);
  return {
    user: toAuthUser(payload),
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken({ sub: user.id }),
  };
}

export async function refresh(refreshToken: string) {
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch {
    throw new UnauthorizedError("Refresh token tidak valid atau kedaluwarsa");
  }

  const user = await findUserById(decoded.sub);
  if (!user || !user.isActive) {
    throw new UnauthorizedError("User tidak ditemukan atau tidak aktif");
  }

  const payload = toAccessPayload(user);
  return {
    user: toAuthUser(payload),
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken({ sub: user.id }),
  };
}

export function getMe(payload: JwtAccessPayload): AuthUser {
  return toAuthUser(payload);
}
