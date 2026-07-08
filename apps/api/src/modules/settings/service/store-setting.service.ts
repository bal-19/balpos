import { NotFoundError } from "../../../shared/errors/app-error.js";
import { toPublicThemeDto, toStoreSettingDto } from "../dto/store-setting.dto.js";
import type { UpdateStoreSettingInput } from "../schema/store-setting.schema.js";
import {
  findFirstStoreSetting,
  findStoreSettingByOutlet,
  updateStoreSettingByOutlet,
} from "../repository/store-setting.repository.js";

const DEFAULT_THEME = {
  storeName: "Restaurant POS",
  logoUrl: null,
  primaryColor: "#2C4A3B",
};

/** MVP single-outlet: theme publik cukup ambil StoreSetting pertama. */
export async function getPublicTheme() {
  const setting = await findFirstStoreSetting();
  return setting ? toPublicThemeDto(setting) : DEFAULT_THEME;
}

export async function getStoreSetting(outletId: string) {
  const setting = await findStoreSettingByOutlet(outletId);
  if (!setting) throw new NotFoundError("Store setting belum ada untuk outlet ini");
  return toStoreSettingDto(setting);
}

export async function updateStoreSetting(outletId: string, input: UpdateStoreSettingInput) {
  const setting = await updateStoreSettingByOutlet(outletId, input);
  return toStoreSettingDto(setting);
}
