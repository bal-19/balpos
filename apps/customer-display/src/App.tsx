import type { ApiSuccessEnvelope, Order, PaymentStatus, PublicOutletInfo } from "@restaurant-pos/types";
import { applyBrandColor } from "@restaurant-pos/ui";
import { formatCurrencyIDR } from "@restaurant-pos/utils";
import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { apiClient } from "./lib/api-client";

interface PaymentUpdate {
  orderId: string;
  paymentStatus: PaymentStatus;
  paymentUrl: string | null;
}

export function App() {
  const [outlet, setOutlet] = useState<PublicOutletInfo | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentUpdate, setPaymentUpdate] = useState<PaymentUpdate | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiClient.get<ApiSuccessEnvelope<PublicOutletInfo>>("/api/settings/public");
        setOutlet(data.data);
        applyBrandColor(data.data.primaryColor);
      } catch {
        applyBrandColor("#2C4A3B");
      }
    })();
  }, []);

  useEffect(() => {
    if (!outlet) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL, { withCredentials: true });
    socket.on("connect", () => socket.emit("join-outlet", outlet.outletId));

    socket.on("order:created", (payload: Order) => {
      setOrder(payload);
      setPaymentUpdate(null);
    });

    socket.on("payment:status.updated", (payload: PaymentUpdate) => {
      setPaymentUpdate(payload);
    });

    socket.on("order:completed", () => {
      setPaymentUpdate((prev) => (prev ? { ...prev, paymentStatus: "PAID" } : prev));
    });

    return () => {
      socket.disconnect();
    };
  }, [outlet]);

  useEffect(() => {
    if (paymentUpdate?.paymentStatus === "PENDING" && paymentUpdate.paymentUrl) {
      QRCode.toDataURL(paymentUpdate.paymentUrl)
        .then(setQrDataUrl)
        .catch(() => setQrDataUrl(null));
    } else {
      setQrDataUrl(null);
    }
  }, [paymentUpdate]);

  if (!outlet) return null;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface p-8 text-center">
      <h1 className="mb-8 text-2xl font-semibold text-primary">{outlet.storeName}</h1>

      {!order ? (
        <p className="text-black/40">Menunggu order...</p>
      ) : (
        <div className="w-full max-w-md rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <div className="mb-4 text-sm text-black/50">Order {order.orderNumber}</div>
          <div className="flex flex-col gap-2 text-left">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.productNameSnapshot} x{item.quantity}
                </span>
                <span>{formatCurrencyIDR(item.subtotal)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between border-t border-black/10 pt-3 text-lg font-semibold">
            <span>Total</span>
            <span>{formatCurrencyIDR(order.totalAmount)}</span>
          </div>

          {paymentUpdate?.paymentStatus === "PAID" && (
            <p className="mt-4 text-sm font-medium text-emerald-600">✓ Lunas</p>
          )}

          {qrDataUrl && (
            <div className="mt-4 flex flex-col items-center gap-2">
              <p className="text-xs text-black/50">Scan untuk bayar</p>
              <img src={qrDataUrl} alt="QR Pembayaran" className="h-40 w-40" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
