import type { Customer } from "@restaurant-pos/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, DialogContent, Input, Select } from "@restaurant-pos/ui";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCustomerMutations } from "../hooks/useCustomers";
import { useMembershipTiers } from "../hooks/useMembershipTiers";
import { customerFormSchema, type CustomerFormValues } from "../types/crm.types";

export function CustomerFormDialog({
  open,
  onOpenChange,
  customer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
}) {
  const { create, update } = useCustomerMutations();
  const { data: tiers } = useMembershipTiers();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({ resolver: zodResolver(customerFormSchema) });

  useEffect(() => {
    reset({
      name: customer?.name ?? "",
      phone: customer?.phone ?? "",
      email: customer?.email ?? "",
      membershipTierId: customer?.membershipTierId ?? "",
    });
  }, [customer, reset, open]);

  function onSubmit(values: CustomerFormValues) {
    const payload = {
      name: values.name,
      phone: values.phone || null,
      email: values.email || null,
      membershipTierId: values.membershipTierId || null,
    };
    const mutation = customer
      ? update.mutateAsync({ id: customer.id, payload })
      : create.mutateAsync(payload);
    mutation.then(() => onOpenChange(false));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={customer ? "Edit Pelanggan" : "Tambah Pelanggan"}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nama</label>
            <Input {...register("name")} />
            {errors.name && <span className="text-xs text-red-600">{errors.name.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Telepon (opsional)</label>
            <Input {...register("phone")} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Email (opsional)</label>
            <Input {...register("email")} />
            {errors.email && <span className="text-xs text-red-600">{errors.email.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Membership Tier (opsional)</label>
            <Select {...register("membershipTierId")}>
              <option value="">- Tanpa tier -</option>
              {tiers?.map((tier) => (
                <option key={tier.id} value={tier.id}>
                  {tier.name}
                </option>
              ))}
            </Select>
          </div>
          <Button type="submit" disabled={create.isPending || update.isPending}>
            Simpan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
