import type { Category } from "@restaurant-pos/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, DialogContent, Input } from "@restaurant-pos/ui";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCategoryMutations } from "../hooks/useCategories";
import { categoryFormSchema, type CategoryFormValues } from "../types/settings.types";

export function CategoryFormDialog({
  open,
  onOpenChange,
  category,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}) {
  const { create, update } = useCategoryMutations();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CategoryFormValues>({ resolver: zodResolver(categoryFormSchema) });

  useEffect(() => {
    reset({ name: category?.name ?? "" });
  }, [category, reset, open]);

  function onSubmit(values: CategoryFormValues) {
    const mutation = category
      ? update.mutateAsync({ id: category.id, payload: values })
      : create.mutateAsync(values);
    mutation.then(() => onOpenChange(false));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={category ? "Edit Kategori" : "Tambah Kategori"}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nama Kategori</label>
            <Input {...register("name")} />
            {errors.name && <span className="text-xs text-red-600">{errors.name.message}</span>}
          </div>
          <Button type="submit" disabled={create.isPending || update.isPending}>
            Simpan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
