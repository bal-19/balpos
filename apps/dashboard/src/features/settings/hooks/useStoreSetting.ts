import { applyBrandColor } from "@restaurant-pos/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchStoreSetting,
  updateStoreSetting,
  type UpdateStoreSettingPayload,
} from "../services/settings.service";

export function useStoreSetting() {
  return useQuery({ queryKey: ["settings", "store"], queryFn: fetchStoreSetting });
}

export function useUpdateStoreSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateStoreSettingPayload) => updateStoreSetting(payload),
    onSuccess: (data) => {
      applyBrandColor(data.primaryColor);
      queryClient.invalidateQueries({ queryKey: ["settings", "store"] });
    },
  });
}
