import type { StockItem } from "@restaurant-pos/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, DialogContent, Input } from "@restaurant-pos/ui";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useStockItemMutations } from "../hooks/useStockItems";
import { adjustStockFormSchema, type AdjustStockFormValues } from "../types/inventory.types";

export function StockAdjustmentDialog({
  stockItem,
  onOpenChange,
}: {
  stockItem: StockItem | null;
  onOpenChange: (open: boolean) => void;
}) {
  const { adjust } = useStockItemMutations();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdjustStockFormValues>({
    resolver: zodResolver(adjustStockFormSchema),
    defaultValues: { type: "IN", quantity: "0", note: "" },
  });

  useEffect(() => {
    reset({ type: "IN", quantity: "0", note: "" });
  }, [stockItem, reset]);

  if (!stockItem) return null;

  function onSubmit(values: AdjustStockFormValues) {
    adjust.mutateAsync({ id: stockItem!.id, payload: values }).then(() => onOpenChange(false));
  }

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent title={`Sesuaikan Stok — ${stockItem.name}`}>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Tipe</label>
            <select className="h-10 rounded-lg border border-black/10 px-3 text-sm" {...register("type")}>
              <option value="IN">Tambah (IN)</option>
              <option value="OUT">Kurangi (OUT)</option>
              <option value="ADJUSTMENT">Penyesuaian (ADJUSTMENT)</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Jumlah ({stockItem.unit})</label>
            <Input {...register("quantity")} />
            {errors.quantity && <span className="text-xs text-red-600">{errors.quantity.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Catatan (opsional)</label>
            <Input {...register("note")} />
          </div>
          <Button type="submit" disabled={adjust.isPending}>
            Simpan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
