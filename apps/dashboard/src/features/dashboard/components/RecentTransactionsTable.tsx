import type { RecentTransactionStatus } from "@restaurant-pos/types";
import {
  Badge,
  Card,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@restaurant-pos/ui";
import { formatCurrencyIDR, formatDateTime } from "@restaurant-pos/utils";
import { useRecentTransactions } from "../hooks/useRecentTransactions";

const STATUS_LABELS: Record<RecentTransactionStatus, string> = {
  OPEN: "Menunggu Bayar",
  COMPLETED: "Selesai",
  CANCELLED: "Dibatalkan",
};

const STATUS_VARIANTS: Record<RecentTransactionStatus, "success" | "warning" | "danger"> = {
  OPEN: "warning",
  COMPLETED: "success",
  CANCELLED: "danger",
};

export function RecentTransactionsTable() {
  const { data, isLoading } = useRecentTransactions(10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaksi Terbaru</CardTitle>
      </CardHeader>
      {isLoading ? (
        <p className="text-sm text-black/40">Memuat...</p>
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-black/40">Belum ada transaksi.</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell className="uppercase tracking-wider text-black/40">No. Order</TableHeaderCell>
              <TableHeaderCell className="uppercase tracking-wider text-black/40">Pelanggan</TableHeaderCell>
              <TableHeaderCell className="uppercase tracking-wider text-black/40">Item</TableHeaderCell>
              <TableHeaderCell className="uppercase tracking-wider text-black/40">Total</TableHeaderCell>
              <TableHeaderCell className="uppercase tracking-wider text-black/40">Waktu</TableHeaderCell>
              <TableHeaderCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((trx) => (
              <TableRow key={trx.id} className="transition-colors hover:bg-black/[0.02]">
                <TableCell className="font-medium">{trx.orderNumber}</TableCell>
                <TableCell>{trx.customerName ?? "-"}</TableCell>
                <TableCell className="max-w-xs truncate">{trx.itemsSummary}</TableCell>
                <TableCell className="font-semibold">{formatCurrencyIDR(trx.totalAmount)}</TableCell>
                <TableCell className="text-black/50">{formatDateTime(trx.createdAt)}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_VARIANTS[trx.status]}>{STATUS_LABELS[trx.status]}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
