import type { Promotion } from "@restaurant-pos/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, DialogContent, Input, Select } from "@restaurant-pos/ui";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useProducts } from "../../settings/hooks/useProducts";
import { usePromotionMutations } from "../hooks/usePromotions";
import { PROMOTION_TYPE_LABELS, promotionFormSchema, type PromotionFormValues } from "../types/promotion.types";

export function PromotionFormDialog({
  open,
  onOpenChange,
  promotion,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  promotion: Promotion | null;
}) {
  const { create, update } = usePromotionMutations();
  const { data: products } = useProducts();
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<PromotionFormValues>({ resolver: zodResolver(promotionFormSchema) });

  const type = useWatch({ control, name: "type" });

  useEffect(() => {
    reset({
      type: promotion?.type ?? "VOUCHER",
      code: promotion?.code ?? "",
      name: promotion?.name ?? "",
      discountType: promotion?.discountType ?? "PERCENTAGE",
      discountValue: promotion?.discountValue ?? "",
      minPurchase: promotion?.minPurchase ?? "0",
      buyProductId: promotion?.buyProductId ?? "",
      buyQuantity: promotion?.buyQuantity ?? 0,
      getProductId: promotion?.getProductId ?? "",
      getQuantity: promotion?.getQuantity ?? 0,
      startTime: promotion?.startTime ?? "",
      endTime: promotion?.endTime ?? "",
      isActive: promotion?.isActive ?? true,
    });
  }, [promotion, reset, open]);

  function onSubmit(values: PromotionFormValues) {
    const payload = {
      ...values,
      code: values.code || null,
      minPurchase: values.minPurchase || "0",
      buyProductId: values.buyProductId || null,
      buyQuantity: values.buyQuantity || null,
      getProductId: values.getProductId || null,
      getQuantity: values.getQuantity || null,
      startTime: values.startTime || null,
      endTime: values.endTime || null,
    };
    const mutation = promotion
      ? update.mutateAsync({ id: promotion.id, payload })
      : create.mutateAsync(payload);
    mutation.then(() => onOpenChange(false));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={promotion ? "Edit Promo" : "Tambah Promo"} className="max-w-lg">
        <form onSubmit={handleSubmit(onSubmit)} className="flex max-h-[70vh] flex-col gap-4 overflow-y-auto">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Tipe Promo</label>
            <Select {...register("type")}>
              {Object.entries(PROMOTION_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nama Promo</label>
            <Input {...register("name")} />
            {errors.name && <span className="text-xs text-red-600">{errors.name.message}</span>}
          </div>

          {type === "VOUCHER" && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium">Kode Voucher</label>
              <Input {...register("code")} placeholder="contoh: DISKON10" />
            </div>
          )}

          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-sm font-medium">Tipe Diskon</label>
              <Select {...register("discountType")}>
                <option value="PERCENTAGE">Persen (%)</option>
                <option value="FIXED_AMOUNT">Nominal (Rp)</option>
              </Select>
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-sm font-medium">Nilai Diskon</label>
              <Input {...register("discountValue")} placeholder="contoh: 10" />
              {errors.discountValue && (
                <span className="text-xs text-red-600">{errors.discountValue.message}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Minimal Pembelian (Rp, opsional)</label>
            <Input {...register("minPurchase")} placeholder="0" />
          </div>

          {type === "HAPPY_HOUR" && (
            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-sm font-medium">Jam Mulai</label>
                <Input type="time" {...register("startTime")} />
              </div>
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-sm font-medium">Jam Selesai</label>
                <Input type="time" {...register("endTime")} />
              </div>
            </div>
          )}

          {type === "BUY_X_GET_Y" && (
            <>
              <div className="flex gap-3">
                <div className="flex flex-1 flex-col gap-1">
                  <label className="text-sm font-medium">Produk Dibeli</label>
                  <Select {...register("buyProductId")}>
                    <option value="">- Pilih produk -</option>
                    {products?.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex w-24 flex-col gap-1">
                  <label className="text-sm font-medium">Jumlah</label>
                  <Input type="number" min={1} {...register("buyQuantity")} />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex flex-1 flex-col gap-1">
                  <label className="text-sm font-medium">Produk Didapat</label>
                  <Select {...register("getProductId")}>
                    <option value="">- Pilih produk -</option>
                    {products?.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="flex w-24 flex-col gap-1">
                  <label className="text-sm font-medium">Jumlah</label>
                  <Input type="number" min={1} {...register("getQuantity")} />
                </div>
              </div>
              <p className="text-xs text-black/50">
                Nilai diskon di atas berlaku untuk produk yang didapat (100% = gratis).
              </p>
            </>
          )}

          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" {...register("isActive")} />
            Promo aktif
          </label>

          <Button type="submit" disabled={create.isPending || update.isPending}>
            Simpan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
