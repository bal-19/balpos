import PDFDocument from "pdfkit";

export interface ReportDataset {
  from: string;
  to: string;
  totalRevenue: string;
  totalOrders: number;
  rows: { label: string; value: string }[];
}

export function generatePdfReport(dataset: ReportDataset): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 40 });
    const chunks: Buffer[] = [];
    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(18).text("Laporan Penjualan", { align: "center" });
    doc.moveDown();
    doc.fontSize(10).text(`Periode: ${dataset.from} — ${dataset.to}`);
    doc.moveDown();
    doc.fontSize(12).text(`Total Omset: Rp ${dataset.totalRevenue}`);
    doc.text(`Total Order: ${dataset.totalOrders}`);
    doc.moveDown();
    dataset.rows.forEach((row) => doc.fontSize(10).text(`${row.label}: ${row.value}`));
    doc.end();
  });
}
