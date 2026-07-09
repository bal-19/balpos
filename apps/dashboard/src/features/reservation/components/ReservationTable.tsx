import type { Reservation } from "@restaurant-pos/types";
import {
  Badge,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@restaurant-pos/ui";
import { formatDateTime } from "@restaurant-pos/utils";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useReservationMutations, useReservations } from "../hooks/useReservations";
import { RESERVATION_STATUS_LABELS } from "../types/reservation.types";
import { ReservationFormDialog } from "./ReservationFormDialog";

const STATUS_BADGE_VARIANT: Record<string, "primary" | "success" | "warning" | "danger" | "outline"> = {
  PENDING: "warning",
  CONFIRMED: "primary",
  SEATED: "success",
  COMPLETED: "outline",
  CANCELLED: "danger",
  NO_SHOW: "danger",
};

export function ReservationTable() {
  const [date, setDate] = useState("");
  const { data, isLoading } = useReservations(date || undefined);
  const { confirm, checkIn, complete, cancel, noShow } = useReservationMutations();
  const [dialogOpen, setDialogOpen] = useState(false);

  function renderActions(reservation: Reservation) {
    switch (reservation.status) {
      case "PENDING":
        return (
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={() => confirm.mutate(reservation.id)}>
              Konfirmasi
            </Button>
            <Button size="sm" variant="danger" onClick={() => cancel.mutate(reservation.id)}>
              Batal
            </Button>
          </div>
        );
      case "CONFIRMED":
        return (
          <div className="flex justify-end gap-2">
            <Button size="sm" onClick={() => checkIn.mutate(reservation.id)}>
              Check-in
            </Button>
            <Button size="sm" variant="outline" onClick={() => noShow.mutate(reservation.id)}>
              No-show
            </Button>
            <Button size="sm" variant="danger" onClick={() => cancel.mutate(reservation.id)}>
              Batal
            </Button>
          </div>
        );
      case "SEATED":
        return (
          <div className="flex justify-end">
            <Button size="sm" onClick={() => complete.mutate(reservation.id)}>
              Selesai
            </Button>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">Reservasi Meja</h1>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus size={16} /> Buat Reservasi
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-black/60">Filter tanggal</label>
        <Input type="date" className="w-44" value={date} onChange={(e) => setDate(e.target.value)} />
        {date && (
          <Button size="sm" variant="ghost" onClick={() => setDate("")}>
            Reset
          </Button>
        )}
      </div>

      {isLoading ? (
        <p className="text-sm text-black/40">Memuat...</p>
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-black/40">Belum ada reservasi.</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Waktu</TableHeaderCell>
              <TableHeaderCell>Meja</TableHeaderCell>
              <TableHeaderCell>Pelanggan</TableHeaderCell>
              <TableHeaderCell>Tamu</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell>{formatDateTime(reservation.reservedAt)}</TableCell>
                <TableCell>{reservation.tableName}</TableCell>
                <TableCell>
                  {reservation.customerName}
                  {reservation.customerPhone ? ` (${reservation.customerPhone})` : ""}
                </TableCell>
                <TableCell>{reservation.partySize}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_BADGE_VARIANT[reservation.status] ?? "outline"}>
                    {RESERVATION_STATUS_LABELS[reservation.status] ?? reservation.status}
                  </Badge>
                </TableCell>
                <TableCell>{renderActions(reservation)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ReservationFormDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
