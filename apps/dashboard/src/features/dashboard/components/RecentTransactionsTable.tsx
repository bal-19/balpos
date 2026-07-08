import {
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

export function RecentTransactionsTable() {
  const { data, isLoading } = useRecentTransactions(10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      {isLoading ? (
        <p className="text-sm text-black/40">Memuat...</p>
      ) : !data || data.length === 0 ? (
        <p className="text-sm text-black/40">Belum ada transaksi.</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>No. Order</TableHeaderCell>
              <TableHeaderCell>Customer</TableHeaderCell>
              <TableHeaderCell>Items</TableHeaderCell>
              <TableHeaderCell>Total</TableHeaderCell>
              <TableHeaderCell>Waktu</TableHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((trx) => (
              <TableRow key={trx.id}>
                <TableCell className="font-medium">{trx.orderNumber}</TableCell>
                <TableCell>{trx.customerName ?? "-"}</TableCell>
                <TableCell className="max-w-xs truncate">{trx.itemsSummary}</TableCell>
                <TableCell>{formatCurrencyIDR(trx.totalAmount)}</TableCell>
                <TableCell>{formatDateTime(trx.createdAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}
