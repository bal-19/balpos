import type { MembershipTier } from "@restaurant-pos/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, DialogContent, Input } from "@restaurant-pos/ui";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMembershipTierMutations } from "../hooks/useMembershipTiers";
import { membershipTierFormSchema, type MembershipTierFormValues } from "../types/crm.types";

export function MembershipTierFormDialog({
  open,
  onOpenChange,
  tier,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tier: MembershipTier | null;
}) {
  const { create, update } = useMembershipTierMutations();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MembershipTierFormValues>({ resolver: zodResolver(membershipTierFormSchema) });

  useEffect(() => {
    reset({
      name: tier?.name ?? "",
      minPoint: tier?.minPoint ?? 0,
      discountPercent: tier?.discountPercent ?? "0",
    });
  }, [tier, reset, open]);

  function onSubmit(values: MembershipTierFormValues) {
    const mutation = tier ? update.mutateAsync({ id: tier.id, payload: values }) : create.mutateAsync(values);
    mutation.then(() => onOpenChange(false));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={tier ? "Edit Membership Tier" : "Tambah Membership Tier"}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nama Tier</label>
            <Input {...register("name")} />
            {errors.name && <span className="text-xs text-red-600">{errors.name.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Minimal Poin</label>
            <Input type="number" min={0} {...register("minPoint")} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Diskon (%)</label>
            <Input {...register("discountPercent")} placeholder="contoh: 5" />
            {errors.discountPercent && (
              <span className="text-xs text-red-600">{errors.discountPercent.message}</span>
            )}
          </div>
          <Button type="submit" disabled={create.isPending || update.isPending}>
            Simpan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
