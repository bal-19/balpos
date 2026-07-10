import { Badge, Button, Input, Select, Spinner, Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from "@restaurant-pos/ui";
import { formatDateTime } from "@restaurant-pos/utils";
import { useState } from "react";
import { useAuditLogs } from "../hooks/useAuditLogs";

const METHOD_BADGE_VARIANT: Record<string, "primary" | "success" | "warning" | "danger" | "outline"> = {
  POST: "success",
  PUT: "primary",
  PATCH: "primary",
  DELETE: "danger",
};

export function AuditLogPage() {
  const [userId, setUserId] = useState("");
  const [method, setMethod] = useState("");
  const [path, setPath] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const { data, isLoading } = useAuditLogs({
    userId: userId || undefined,
    method: method || undefined,
    path: path || undefined,
    page,
    pageSize,
  });

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">Audit Log</h1>

      <div className="flex flex-wrap items-end gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs text-black/60">User ID</label>
          <Input className="w-48" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Filter user ID" />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-black/60">Method</label>
          <Select className="w-32" value={method} onChange={(e) => setMethod(e.target.value)}>
            <option value="">Semua</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="PATCH">PATCH</option>
            <option value="DELETE">DELETE</option>
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-black/60">Path</label>
          <Input className="w-48" value={path} onChange={(e) => setPath(e.target.value)} placeholder="mis. /api/crm" />
        </div>
        {(userId || method || path) && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setUserId("");
              setMethod("");
              setPath("");
              setPage(1);
            }}
          >
            Reset
          </Button>
        )}
      </div>

      {isLoading ? (
        <Spinner />
      ) : !data || data.items.length === 0 ? (
        <p className="text-sm text-black/40">Belum ada aktivitas.</p>
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Waktu</TableHeaderCell>
                <TableHeaderCell>User</TableHeaderCell>
                <TableHeaderCell>Method</TableHeaderCell>
                <TableHeaderCell>Path</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.items.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{formatDateTime(log.createdAt)}</TableCell>
                  <TableCell>{log.userName}</TableCell>
                  <TableCell>
                    <Badge variant={METHOD_BADGE_VARIANT[log.method] ?? "outline"}>{log.method}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{log.path}</TableCell>
                  <TableCell>{log.statusCode}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between text-sm text-black/60">
            <span>
              Halaman {data.page} dari {Math.max(1, Math.ceil(data.total / data.pageSize))} ({data.total} entri)
            </span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                Sebelumnya
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page * pageSize >= data.total}
                onClick={() => setPage((p) => p + 1)}
              >
                Berikutnya
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
