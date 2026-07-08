import type { Supplier } from "@restaurant-pos/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, DialogContent, Input } from "@restaurant-pos/ui";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useSupplierMutations } from "../hooks/useSuppliers";
import { supplierFormSchema, type SupplierFormValues } from "../types/supplier.types";

export function SupplierFormDialog({
  open,
  onOpenChange,
  supplier,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplier: Supplier | null;
}) {
  const { create, update } = useSupplierMutations();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupplierFormValues>({ resolver: zodResolver(supplierFormSchema) });

  useEffect(() => {
    reset({
      name: supplier?.name ?? "",
      phone: supplier?.phone ?? "",
      address: supplier?.address ?? "",
    });
  }, [supplier, reset, open]);

  function onSubmit(values: SupplierFormValues) {
    const mutation = supplier
      ? update.mutateAsync({ id: supplier.id, payload: values })
      : create.mutateAsync(values);
    mutation.then(() => onOpenChange(false));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={supplier ? "Edit Supplier" : "Tambah Supplier"}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nama Supplier</label>
            <Input {...register("name")} />
            {errors.name && <span className="text-xs text-red-600">{errors.name.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Telepon (opsional)</label>
            <Input {...register("phone")} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Alamat (opsional)</label>
            <Input {...register("address")} />
          </div>
          <Button type="submit" disabled={create.isPending || update.isPending}>
            Simpan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
