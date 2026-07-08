import type { Product } from "@restaurant-pos/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, DialogContent, Input } from "@restaurant-pos/ui";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCategories } from "../hooks/useCategories";
import { useProductMutations } from "../hooks/useProducts";
import { productFormSchema, type ProductFormValues } from "../types/settings.types";

export function ProductFormDialog({
  open,
  onOpenChange,
  product,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}) {
  const { data: categories } = useCategories();
  const { create, update } = useProductMutations();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProductFormValues>({ resolver: zodResolver(productFormSchema) });

  useEffect(() => {
    reset({
      categoryId: product?.categoryId ?? categories?.[0]?.id ?? "",
      name: product?.name ?? "",
      price: product?.price ?? "",
      description: product?.description ?? "",
      imageUrl: product?.imageUrl ?? "",
    });
  }, [product, categories, reset, open]);

  function onSubmit(values: ProductFormValues) {
    const payload = { ...values, imageUrl: values.imageUrl || null };
    const mutation = product
      ? update.mutateAsync({ id: product.id, payload })
      : create.mutateAsync(payload);
    mutation.then(() => onOpenChange(false));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={product ? "Edit Produk" : "Tambah Produk"}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Kategori</label>
            <select
              className="h-10 rounded-lg border border-black/10 px-3 text-sm"
              {...register("categoryId")}
            >
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <span className="text-xs text-red-600">{errors.categoryId.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nama Produk</label>
            <Input {...register("name")} />
            {errors.name && <span className="text-xs text-red-600">{errors.name.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Harga</label>
            <Input {...register("price")} placeholder="15000" />
            {errors.price && <span className="text-xs text-red-600">{errors.price.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Deskripsi (opsional)</label>
            <Input {...register("description")} />
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">URL Gambar (opsional)</label>
            <Input {...register("imageUrl")} placeholder="https://..." />
            {errors.imageUrl && <span className="text-xs text-red-600">{errors.imageUrl.message}</span>}
          </div>
          <Button type="submit" disabled={create.isPending || update.isPending}>
            Simpan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
