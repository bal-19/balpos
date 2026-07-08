import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Input } from "@restaurant-pos/ui";
import { useEffect } from "react";
import type { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { useStoreSetting, useUpdateStoreSetting } from "../hooks/useStoreSetting";
import { storeSettingFormSchema, type StoreSettingFormValues } from "../types/settings.types";

function Field({ label, error, children }: { label: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}

export function GeneralSettingsForm() {
  const { data: storeSetting, isLoading } = useStoreSetting();
  const updateMutation = useUpdateStoreSetting();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StoreSettingFormValues>({ resolver: zodResolver(storeSettingFormSchema) });

  useEffect(() => {
    if (storeSetting) {
      reset({
        storeName: storeSetting.storeName,
        address: storeSetting.address ?? "",
        phone: storeSetting.phone ?? "",
        currency: storeSetting.currency,
        taxPercent: storeSetting.taxPercent,
        serviceChargePercent: storeSetting.serviceChargePercent,
      });
    }
  }, [storeSetting, reset]);

  if (isLoading || !storeSetting) return <p className="text-sm text-black/40">Memuat...</p>;

  function onSubmit(values: StoreSettingFormValues) {
    updateMutation.mutate({ ...values, primaryColor: storeSetting!.primaryColor });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex max-w-lg flex-col gap-4">
      <Field label="Nama Toko" error={errors.storeName?.message}>
        <Input {...register("storeName")} />
      </Field>
      <Field label="Alamat" error={errors.address?.message}>
        <Input {...register("address")} />
      </Field>
      <Field label="Telepon" error={errors.phone?.message}>
        <Input {...register("phone")} />
      </Field>
      <Field label="Mata Uang" error={errors.currency?.message}>
        <Input {...register("currency")} />
      </Field>
      <Field label="Pajak (%)" error={errors.taxPercent?.message}>
        <Input {...register("taxPercent")} />
      </Field>
      <Field label="Service Charge (%)" error={errors.serviceChargePercent?.message}>
        <Input {...register("serviceChargePercent")} />
      </Field>
      <Button type="submit" disabled={updateMutation.isPending} className="w-fit">
        {updateMutation.isPending ? "Menyimpan..." : "Simpan"}
      </Button>
    </form>
  );
}
