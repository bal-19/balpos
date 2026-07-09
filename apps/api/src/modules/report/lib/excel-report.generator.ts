import ExcelJS from "exceljs";
import type { ReportDataset } from "./pdf-report.generator.js";

export async function generateExcelReport(dataset: ReportDataset): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Report");
  sheet.columns = [
    { header: "Item", key: "label", width: 30 },
    { header: "Value", key: "value", width: 30 },
  ];
  sheet.addRow({ label: "Periode", value: `${dataset.from} — ${dataset.to}` });
  sheet.addRow({ label: "Total Omset", value: dataset.totalRevenue });
  sheet.addRow({ label: "Total Order", value: dataset.totalOrders });
  dataset.rows.forEach((row) => sheet.addRow(row));
  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer as ArrayBuffer);
}
