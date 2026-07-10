import type { RecentTransactionStatus } from "@restaurant-pos/types";
import {
  Card,
  CardHeader,
  CardTitle,
  Spinner,
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

const STATUS_DOTS: Record<RecentTransactionStatus, string> = {
  OPEN: "bg-amber-500",
  COMPLETED: "bg-emerald-500",
  CANCELLED: "bg-red-500",
};

const STATUS_TEXT: Record<RecentTransactionStatus, string> = {
  OPEN: "text-amber-700",
  COMPLETED: "text-emerald-700",
  CANCELLED: "text-red-700",
};

export function RecentTransactionsTable() {
  const { data, isLoading } = useRecentTransactions(10);

  return (
    <Card className="p-5">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-black/90">Transaksi Terbaru</CardTitle>
      </CardHeader>
      {isLoading ? (
        <Spinner />
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
              <TableHeaderCell className="uppercase tracking-wider text-black/40">Status</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((trx) => (
              <TableRow key={trx.id} className="transition-colors hover:bg-black/[0.02]">
                <TableCell className="font-medium">{trx.orderNumber}</TableCell>
                <TableCell className="font-semibold text-black/80">{trx.customerName ?? "-"}</TableCell>
                <TableCell className="max-w-xs truncate text-black/60">{trx.itemsSummary}</TableCell>
                <TableCell className="font-semibold">{formatCurrencyIDR(trx.totalAmount)}</TableCell>
                <TableCell className="text-black/50">{formatDateTime(trx.createdAt)}</TableCell>
                <TableCell>
                  <span className={`flex items-center gap-1.5 text-xs font-semibold ${STATUS_TEXT[trx.status]}`}>
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${STATUS_DOTS[trx.status]}`} />
                    {STATUS_LABELS[trx.status]}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
