import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@restaurant-pos/ui";
import { formatDateTime } from "@restaurant-pos/utils";
import { Download, Plus } from "lucide-react";
import { useState } from "react";
import { useReportExports } from "../hooks/useReportExports";
import { EXPORT_STATUS_LABELS, REPORT_TYPE_LABELS } from "../types/report.types";
import { ExportDialog } from "./ExportDialog";

const STATUS_BADGE_VARIANT: Record<string, "primary" | "success" | "warning" | "danger" | "outline"> = {
  PENDING: "warning",
  PROCESSING: "primary",
  COMPLETED: "success",
  FAILED: "danger",
};

export function ExportHistoryPage() {
  const { data, isLoading } = useReportExports();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-black/60">Riwayat Export</h2>
        <Button size="sm" onClick={() => setDialogOpen(true)}>
          <Plus size={16} /> Export Laporan
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-black/40">Memuat...</p>
      ) : !data || data.items.length === 0 ? (
        <p className="text-sm text-black/40">Belum ada riwayat export.</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeaderCell>Tanggal</TableHeaderCell>
              <TableHeaderCell>Tipe Laporan</TableHeaderCell>
              <TableHeaderCell>Format</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.items.map((job) => (
              <TableRow key={job.id}>
                <TableCell>{formatDateTime(job.createdAt)}</TableCell>
                <TableCell>{REPORT_TYPE_LABELS[job.reportType as keyof typeof REPORT_TYPE_LABELS] ?? job.reportType}</TableCell>
                <TableCell>{job.fileType}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_BADGE_VARIANT[job.status] ?? "outline"}>
                    {EXPORT_STATUS_LABELS[job.status] ?? job.status}
                  </Badge>
                  {job.status === "FAILED" && job.failureReason && (
                    <p className="mt-1 text-xs text-red-600">{job.failureReason}</p>
                  )}
                </TableCell>
                <TableCell>
                  {job.status === "COMPLETED" && job.fileUrl && (
                    <a href={job.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-sm text-primary">
                      <Download size={14} /> Unduh
                    </a>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <ExportDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  );
}
