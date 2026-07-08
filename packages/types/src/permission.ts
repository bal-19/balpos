export const PERMISSION_CODES = {
  DASHBOARD_VIEW: "dashboard.view",
  SETTINGS_VIEW: "settings.view",
  SETTINGS_MANAGE: "settings.manage",
  CATALOG_VIEW: "catalog.view",
  CATALOG_MANAGE: "catalog.manage",
  POS_TABLE_VIEW: "pos.table.view",
  POS_ORDER_CREATE: "pos.order.create",
  KITCHEN_VIEW: "kitchen.view",
  KITCHEN_MANAGE: "kitchen.manage",
  ROLE_MANAGE: "role.manage",
} as const;

export type PermissionCode = (typeof PERMISSION_CODES)[keyof typeof PERMISSION_CODES];
