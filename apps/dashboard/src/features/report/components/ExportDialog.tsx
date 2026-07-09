import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Dialog, DialogContent, Input, Select } from "@restaurant-pos/ui";
import { useForm } from "react-hook-form";
import { useCreateExport } from "../hooks/useReportExports";
import { exportFormSchema, REPORT_TYPE_LABELS, type ExportFormValues } from "../types/report.types";

export function ExportDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const createExport = useCreateExport();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExportFormValues>({
    resolver: zodResolver(exportFormSchema),
    defaultValues: { reportType: "SALES_SUMMARY", fileType: "PDF", from: "", to: "" },
  });

  function onSubmit(values: ExportFormValues) {
    createExport
      .mutateAsync({
        reportType: values.reportType,
        fileType: values.fileType,
        from: new Date(values.from).toISOString(),
        to: new Date(values.to).toISOString(),
      })
      .then(() => {
        reset();
        onOpenChange(false);
      });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent title="Export Laporan" className="max-w-md">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Tipe Laporan</label>
            <Select {...register("reportType")}>
              {Object.entries(REPORT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">Format File</label>
            <Select {...register("fileType")}>
              <option value="PDF">PDF</option>
              <option value="EXCEL">Excel</option>
            </Select>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-sm font-medium">Dari</label>
              <Input type="datetime-local" {...register("from")} />
              {errors.from && <span className="text-xs text-red-600">{errors.from.message}</span>}
            </div>
            <div className="flex flex-1 flex-col gap-1">
              <label className="text-sm font-medium">Sampai</label>
              <Input type="datetime-local" {...register("to")} />
              {errors.to && <span className="text-xs text-red-600">{errors.to.message}</span>}
            </div>
          </div>
          <Button type="submit" disabled={createExport.isPending}>
            {createExport.isPending ? "Mengantrikan..." : "Export"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
