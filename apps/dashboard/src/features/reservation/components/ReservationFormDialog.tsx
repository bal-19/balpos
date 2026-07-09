import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, DialogContent, Input, Select } from "@restaurant-pos/ui";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTables } from "../../pos/hooks/useTables";
import { useReservationMutations } from "../hooks/useReservations";
import { reservationFormSchema, type ReservationFormValues } from "../types/reservation.types";

export function ReservationFormDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { create } = useReservationMutations();
  const { data: tables } = useTables();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReservationFormValues>({ resolver: zodResolver(reservationFormSchema) });

  useEffect(() => {
    reset({ tableId: "", customerName: "", customerPhone: "", partySize: 1, reservedAt: "", notes: "" });
  }, [reset, open]);

  function onSubmit(values: ReservationFormValues) {
    create
      .mutateAsync({
        tableId: values.tableId,
        customerName: values.customerName,
        customerPhone: values.customerPhone || null,
        partySize: values.partySize,
        reservedAt: new Date(values.reservedAt).toISOString(),
        notes: values.notes || null,
      })
      .then(() => onOpenChange(false));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Buat Reservasi">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Meja</label>
            <Select {...register("tableId")}>
              <option value="">- Pilih meja -</option>
              {tables?.map((table) => (
                <option key={table.id} value={table.id}>
                  {table.name}
                </option>
              ))}
            </Select>
            {errors.tableId && <span className="text-xs text-red-600">{errors.tableId.message}</span>}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Nama Pelanggan</label>
            <Input {...register("customerName")} />
            {errors.customerName && (
              <span className="text-xs text-red-600">{errors.customerName.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Telepon (opsional)</label>
            <Input {...register("customerPhone")} />
          </div>
          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-sm font-medium">Tanggal & Jam</label>
              <Input type="datetime-local" {...register("reservedAt")} />
              {errors.reservedAt && (
                <span className="text-xs text-red-600">{errors.reservedAt.message}</span>
              )}
            </div>
            <div className="flex w-28 flex-col gap-1">
              <label className="text-sm font-medium">Jumlah Tamu</label>
              <Input type="number" min={1} {...register("partySize")} />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Catatan (opsional)</label>
            <Input {...register("notes")} />
          </div>
          <Button type="submit" disabled={create.isPending}>
            Simpan
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
