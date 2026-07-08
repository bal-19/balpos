import { NotFoundError } from "../../../shared/errors/app-error.js";
import { toPublicOutletInfoDto, toPublicThemeDto, toStoreSettingDto } from "../dto/store-setting.dto.js";
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

/** MVP single-outlet: dipakai customer-display untuk join socket room outlet-nya. */
export async function getPublicOutletInfo() {
  const setting = await findFirstStoreSetting();
  if (!setting) throw new NotFoundError("Store setting belum ada");
  return toPublicOutletInfoDto(setting);
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
