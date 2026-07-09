import type { Customer } from "@restaurant-pos/types";
import { Dialog, DialogContent, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@restaurant-pos/ui";
import { formatDateTime } from "@restaurant-pos/utils";
import { useCustomerPoints } from "../hooks/useCustomers";

export function PointHistoryDialog({
  open,
  onOpenChange,
  customer,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
}) {
  const { data, isLoading } = useCustomerPoints(open ? (customer?.id ?? null) : null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title={`Riwayat Poin — ${customer?.name ?? ""}`} className="max-w-lg">
        <p className="mb-3 text-sm text-black/60">
          Saldo poin saat ini: <span className="font-semibold text-black">{customer?.pointBalance ?? 0}</span>
        </p>
        {isLoading ? (
          <p className="text-sm text-black/40">Memuat...</p>
        ) : !data || data.length === 0 ? (
          <p className="text-sm text-black/40">Belum ada riwayat poin.</p>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Tanggal</TableHeaderCell>
                <TableHeaderCell>Tipe</TableHeaderCell>
                <TableHeaderCell>Poin</TableHeaderCell>
                <TableHeaderCell>Catatan</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{formatDateTime(entry.createdAt)}</TableCell>
                  <TableCell>{entry.type}</TableCell>
                  <TableCell>{entry.type === "EARN" ? "+" : "-"}{entry.points}</TableCell>
                  <TableCell>{entry.note ?? "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
}
