import { env } from "../../../config/env.js";

const XENDIT_API_BASE = "https://api.xendit.co";

interface CreateInvoiceInput {
  externalId: string;
  amount: number;
  description: string;
  customerName?: string | null;
}

interface XenditInvoiceResponse {
  id: string;
  invoice_url: string;
}

/** Xendit Invoice API — satu hosted payment page yang cover QRIS/VA/e-wallet, dipanggil via `fetch` native (nol dependency baru). */
export async function createXenditInvoice(
  input: CreateInvoiceInput,
): Promise<{ invoiceId: string; invoiceUrl: string }> {
  if (!env.XENDIT_SECRET_KEY) {
    throw new Error("XENDIT_SECRET_KEY belum di-set di .env");
  }

  const auth = Buffer.from(`${env.XENDIT_SECRET_KEY}:`).toString("base64");

  const res = await fetch(`${XENDIT_API_BASE}/v2/invoices`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      external_id: input.externalId,
      amount: input.amount,
      description: input.description,
      currency: "IDR",
      ...(input.customerName ? { customer: { given_names: input.customerName } } : {}),
    }),
  });

  if (!res.ok) {
    const errorBody = await res.text();
    throw new Error(`Xendit invoice creation failed (${res.status}): ${errorBody}`);
  }

  const data = (await res.json()) as XenditInvoiceResponse;
  return { invoiceId: data.id, invoiceUrl: data.invoice_url };
}
