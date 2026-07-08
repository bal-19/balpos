import type { ApiSuccessEnvelope, PublicTheme } from "@restaurant-pos/types";
import { applyBrandColor } from "@restaurant-pos/ui";
import { apiClient } from "../../services/api-client";

const DEFAULT_PRIMARY_COLOR = "#2C4A3B";

export async function bootstrapTheme() {
  try {
    const { data } = await apiClient.get<ApiSuccessEnvelope<PublicTheme>>("/api/settings/theme");
    applyBrandColor(data.data.primaryColor);
  } catch {
    applyBrandColor(DEFAULT_PRIMARY_COLOR);
  }
}
