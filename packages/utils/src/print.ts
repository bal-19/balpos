import { formatCurrencyIDR } from "./currency.js";
import { formatDateTime } from "./date.js";

export interface PrintableOrderItem {
  productNameSnapshot: string;
  quantity: number;
  subtotal?: string;
  notes?: string | null;
}

export interface ReceiptOrderData {
  orderNumber: string;
  orderType: string;
  tableName?: string | null;
  customerName?: string | null;
  items: PrintableOrderItem[];
  subtotal: string;
  taxAmount: string;
  serviceChargeAmount: string;
  discountAmount: string;
  totalAmount: string;
  paymentMethod?: string;
  createdAt: string;
}

export interface ReceiptStoreInfo {
  storeName: string;
  address?: string | null;
  phone?: string | null;
  receiptFooterNote?: string | null;
}

export interface KitchenTicketOrderData {
  orderNumber: string;
  orderType: string;
  tableName?: string | null;
  customerName?: string | null;
  createdAt: string;
  items: PrintableOrderItem[];
}

const PRINT_BASE_STYLE = `
  @media print { @page { margin: 0; } }
  * { box-sizing: border-box; }
  body {
    font-family: "Courier New", monospace;
    width: 80mm;
    margin: 0 auto;
    padding: 8px;
    color: #000;
  }
  .center { text-align: center; }
  .divider { border-top: 1px dashed #000; margin: 6px 0; }
  .row { display: flex; justify-content: space-between; gap: 8px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 2px 0; vertical-align: top; }
`;

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case ">":
        return "&gt;";
      case '"':
        return "&quot;";
      default:
        return "&#39;";
    }
  });
}

function wrapHtmlDocument(title: string, bodyContent: string): string {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${escapeHtml(title)}</title>
<style>${PRINT_BASE_STYLE}</style>
</head>
<body>
${bodyContent}
<script>
  window.onload = function () { window.focus(); window.print(); };
  window.onafterprint = function () { window.close(); };
</script>
</body>
</html>`;
}

export function buildReceiptHtml(order: ReceiptOrderData, store: ReceiptStoreInfo): string {
  const itemRows = order.items
    .map(
      (item) => `
    <tr>
      <td colspan="2">${escapeHtml(item.productNameSnapshot)}${item.notes ? ` <em>(${escapeHtml(item.notes)})</em>` : ""}</td>
    </tr>
    <tr>
      <td>${item.quantity} x</td>
      <td style="text-align:right">${item.subtotal ? formatCurrencyIDR(item.subtotal) : ""}</td>
    </tr>`,
    )
    .join("");

  const body = `
    <div class="center">
      <strong>${escapeHtml(store.storeName)}</strong><br/>
      ${store.address ? `${escapeHtml(store.address)}<br/>` : ""}
      ${store.phone ? `${escapeHtml(store.phone)}<br/>` : ""}
    </div>
    <div class="divider"></div>
    <div class="row"><span>No. Order</span><span>${escapeHtml(order.orderNumber)}</span></div>
    <div class="row"><span>Tanggal</span><span>${formatDateTime(order.createdAt)}</span></div>
    ${order.tableName ? `<div class="row"><span>Meja</span><span>${escapeHtml(order.tableName)}</span></div>` : ""}
    ${order.customerName ? `<div class="row"><span>Pelanggan</span><span>${escapeHtml(order.customerName)}</span></div>` : ""}
    <div class="divider"></div>
    <table>${itemRows}</table>
    <div class="divider"></div>
    <div class="row"><span>Subtotal</span><span>${formatCurrencyIDR(order.subtotal)}</span></div>
    ${Number(order.discountAmount) > 0 ? `<div class="row"><span>Diskon</span><span>-${formatCurrencyIDR(order.discountAmount)}</span></div>` : ""}
    <div class="row"><span>Pajak</span><span>${formatCurrencyIDR(order.taxAmount)}</span></div>
    <div class="row"><span>Service Charge</span><span>${formatCurrencyIDR(order.serviceChargeAmount)}</span></div>
    <div class="divider"></div>
    <div class="row"><strong>Total</strong><strong>${formatCurrencyIDR(order.totalAmount)}</strong></div>
    ${order.paymentMethod ? `<div class="row"><span>Metode Bayar</span><span>${escapeHtml(order.paymentMethod)}</span></div>` : ""}
    <div class="divider"></div>
    <div class="center">${store.receiptFooterNote ? escapeHtml(store.receiptFooterNote) : "Terima kasih!"}</div>
  `;

  return wrapHtmlDocument(`Struk ${order.orderNumber}`, body);
}

export function buildKitchenTicketHtml(order: KitchenTicketOrderData): string {
  const itemRows = order.items
    .map(
      (item) => `
    <tr>
      <td style="font-size:16px; padding:4px 0;">
        <strong>${item.quantity}x</strong> ${escapeHtml(item.productNameSnapshot)}
        ${item.notes ? `<br/><em>${escapeHtml(item.notes)}</em>` : ""}
      </td>
    </tr>`,
    )
    .join("");

  const body = `
    <div class="center"><strong style="font-size:18px">TIKET DAPUR</strong></div>
    <div class="divider"></div>
    <div class="row"><span>No. Order</span><strong>${escapeHtml(order.orderNumber)}</strong></div>
    <div class="row"><span>Tipe</span><span>${escapeHtml(order.orderType)}</span></div>
    ${order.tableName ? `<div class="row"><span>Meja</span><strong>${escapeHtml(order.tableName)}</strong></div>` : ""}
    ${order.customerName ? `<div class="row"><span>Pelanggan</span><span>${escapeHtml(order.customerName)}</span></div>` : ""}
    <div class="row"><span>Waktu</span><span>${formatDateTime(order.createdAt)}</span></div>
    <div class="divider"></div>
    <table>${itemRows}</table>
  `;

  return wrapHtmlDocument(`Tiket ${order.orderNumber}`, body);
}

/** Buka window baru, tulis HTML, dan trigger print dialog browser (native, tanpa dependency). */
export function openPrintWindow(html: string): void {
  const printWindow = window.open("", "_blank", "width=400,height=600");
  if (!printWindow) return;
  printWindow.document.write(html);
  printWindow.document.close();
}
