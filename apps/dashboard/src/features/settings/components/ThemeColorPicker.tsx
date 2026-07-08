import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@restaurant-pos/ui";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useStoreSetting, useUpdateStoreSetting } from "../hooks/useStoreSetting";
import { themeFormSchema, type ThemeFormValues } from "../types/settings.types";

export function ThemeColorPicker() {
  const { data: storeSetting, isLoading } = useStoreSetting();
  const updateMutation = useUpdateStoreSetting();
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<ThemeFormValues>({ resolver: zodResolver(themeFormSchema) });

  useEffect(() => {
    if (storeSetting) reset({ primaryColor: storeSetting.primaryColor });
  }, [storeSetting, reset]);

  const currentColor = watch("primaryColor");

  if (isLoading || !storeSetting) return <p className="text-sm text-black/40">Memuat...</p>;

  function onSubmit(values: ThemeFormValues) {
    updateMutation.mutate({
      storeName: storeSetting!.storeName,
      address: storeSetting!.address,
      phone: storeSetting!.phone,
      currency: storeSetting!.currency,
      taxPercent: storeSetting!.taxPercent,
      serviceChargePercent: storeSetting!.serviceChargePercent,
      primaryColor: values.primaryColor,
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Warna Utama (Brand Color)</label>
        <Controller
          control={control}
          name="primaryColor"
          render={({ field }) => (
            <div className="flex items-center gap-3">
              <input
                type="color"
                className="h-10 w-14 rounded border border-black/10"
                value={field.value ?? "#2C4A3B"}
                onChange={(e) => field.onChange(e.target.value)}
              />
              <input
                type="text"
                className="h-10 flex-1 rounded-lg border border-black/10 px-3 text-sm"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(e.target.value)}
              />
            </div>
          )}
        />
        {errors.primaryColor && <span className="text-xs text-red-600">{errors.primaryColor.message}</span>}
        <p className="text-xs text-black/40">
          Preview: <span style={{ color: currentColor }}>{currentColor}</span>
        </p>
      </div>
      <Button type="submit" disabled={updateMutation.isPending} className="w-fit">
        {updateMutation.isPending ? "Menyimpan..." : "Terapkan Warna"}
      </Button>
    </form>
  );
}
