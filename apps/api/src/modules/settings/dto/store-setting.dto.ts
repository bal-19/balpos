import type { PublicTheme, StoreSetting as StoreSettingDto } from "@restaurant-pos/types";
import type { StoreSetting } from "@prisma/client";

export function toStoreSettingDto(setting: StoreSetting): StoreSettingDto {
  return {
    id: setting.id,
    outletId: setting.outletId,
    storeName: setting.storeName,
    logoUrl: setting.logoUrl,
    primaryColor: setting.primaryColor,
    taxPercent: setting.taxPercent.toString(),
    serviceChargePercent: setting.serviceChargePercent.toString(),
    currency: setting.currency,
    address: setting.address,
    phone: setting.phone,
  };
}

export function toPublicThemeDto(setting: StoreSetting): PublicTheme {
  return {
    storeName: setting.storeName,
    logoUrl: setting.logoUrl,
    primaryColor: setting.primaryColor,
  };
}
