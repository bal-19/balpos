import type { StockItem } from "@restaurant-pos/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, DialogContent, Input } from "@restaurant-pos/ui";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useStockItemMutations } from "../hooks/useStockItems";
import { stockItemFormSchema, type StockItemFormValues } from "../types/inventory.types";

export function StockItemFormDialog({
  open,
  onOpenChange,
  stockItem,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stockItem: StockItem | null;
}) {
  const { create, update } = useStockItemMutations();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<StockItemFormValues>({ resolver: zodResolver(stockItemFormSchema) });

  useEffect(() => {
    reset({
      name: stockItem?.name ?? "",
      unit: stockItem?.unit ?? "",
      currentStock: stockItem?.currentStock ?? "0",
      minStockThreshold: stockItem?.minStockThreshold ?? "0",
    });
  }, [stockItem, reset, open]);

  function onSubmit(values: StockItemFormValues) {
    const mutation = stockItem
      ? update.mutateAsync({ id: stockItem.id, payload: values })
      : create.mutateAsync(values);
    mutation.then(() => onOpenChange(false));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={stockItem ? "Edit Bahan Baku" : "Tambah Bahan Baku"}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nama</label>
            <Input {...register("name")} />
            {errors.name && <span className="text-xs text-red-600">{errors.name.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Satuan</label>
            <Input {...register("unit")} placeholder="gram, ml, pcs" />
            {errors.unit && <span className="text-xs text-red-600">{errors.unit.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Stok Awal</label>
            <Input {...register("currentStock")} disabled={Boolean(stockItem)} />
            {stockItem && (
              <p className="text-xs text-black/40">Gunakan tombol sesuaikan stok untuk mengubah jumlah.</p>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Ambang Batas Stok Rendah</label>
            <Input {...register("minStockThreshold")} />
            {errors.minStockThreshold && (
              <span className="text-xs text-red-600">{errors.minStockThreshold.message}</span>
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
