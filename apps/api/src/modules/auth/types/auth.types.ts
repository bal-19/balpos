import type { PermissionCode } from "@restaurant-pos/types";

export interface JwtAccessPayload {
  sub: string;
  tenantId: string;
  outletId: string;
  roleId: string;
  roleCode: string;
  name: string;
  email: string;
  permissions: PermissionCode[];
}

export interface JwtRefreshPayload {
  sub: string;
}
