import type {
  ApiSuccessEnvelope,
  Order,
  OrderItem,
  PaymentStatus,
  PublicOutletInfo,
} from "@restaurant-pos/types";
import { applyBrandColor } from "@restaurant-pos/ui";
import { formatCurrencyIDR } from "@restaurant-pos/utils";
import QRCode from "qrcode";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { apiClient } from "./lib/api-client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface PaymentUpdate {
  orderId: string;
  paymentStatus: PaymentStatus;
  paymentUrl: string | null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

function totalItems(items: OrderItem[]): number {
  return items.reduce((acc, i) => acc + i.quantity, 0);
}

function orderTypeLabel(type: Order["orderType"], tableName?: string | null): string {
  if (type === "DINE_IN" && tableName) return `Meja ${tableName}`;
  if (type === "TAKE_AWAY") return "Take Away";
  if (type === "ORDER_ONLINE") return "Online";
  return type;
}

// ---------------------------------------------------------------------------
// Clock — realtime update
// ---------------------------------------------------------------------------
function LiveClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const dateStr = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex flex-col items-end">
      <span className="font-bold text-primary text-xl tabular-nums leading-tight">{timeStr}</span>
      <span className="text-xs text-black/40 font-medium">{dateStr}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Idle Screen — tampil saat tidak ada order aktif
// ---------------------------------------------------------------------------
interface IdleScreenProps {
  storeName: string;
  logoUrl: string | null;
}

function IdleScreen({ storeName, logoUrl }: IdleScreenProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 p-12">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={storeName}
          className="w-20 h-20 rounded-2xl object-cover"
        />
      ) : (
        <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center">
          <Icon name="restaurant" className="text-white text-[40px]" />
        </div>
      )}
      <div className="text-center space-y-2">
        <p className="text-2xl font-bold text-primary">{storeName}</p>
        <p className="text-sm text-black/40 font-medium">Selamat datang! Pesanan Anda akan tampil di sini.</p>
      </div>
      {/* Animated dots */}
      <div className="flex gap-2 mt-4">
        {[0, 0.2, 0.4].map((delay, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-primary/30"
            style={{ animation: `bounce 1.4s ease-in-out ${delay}s infinite` }}
          />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// OrderItemCard
// ---------------------------------------------------------------------------
interface OrderItemCardProps {
  item: OrderItem;
  index: number;
}

function OrderItemCard({ item, index }: OrderItemCardProps) {
  return (
    <div
      className="item-enter bg-white rounded-[20px] p-5 flex items-center gap-5 card-shadow inner-stroke hover:scale-[1.01] transition-transform duration-300"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Item icon placeholder */}
      <div className="w-16 h-16 rounded-2xl shrink-0 bg-[#f4f4f0] flex items-center justify-center">
        <Icon name="lunch_dining" className="text-primary/40 text-[28px]" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2 mb-1.5">
          <h3 className="font-semibold text-primary text-base leading-tight">
            {item.productNameSnapshot}
          </h3>
          <span className="font-bold text-primary text-base tabular-nums shrink-0">
            {formatCurrencyIDR(item.subtotal)}
          </span>
        </div>

        {item.notes && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="text-xs px-2.5 py-1 bg-[#dae8e4] text-[#4b635c] rounded-full flex items-center gap-1">
              <Icon name="notes" className="text-[12px]" />
              {item.notes}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-black/40 uppercase tracking-wider font-medium">
            Qty
          </span>
          <span className="text-xs font-bold bg-[#c7eade] text-[#02241d] px-2.5 py-0.5 rounded">
            {item.quantity}
          </span>
          {item.unitPrice !== item.subtotal && item.quantity > 1 && (
            <span className="text-[11px] text-black/30 tabular-nums">
              @ {formatCurrencyIDR(item.unitPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// OrderSummaryPanel — right sidebar
// ---------------------------------------------------------------------------
interface OrderSummaryPanelProps {
  order: Order;
  paymentUpdate: PaymentUpdate | null;
  qrDataUrl: string | null;
}

function OrderSummaryPanel({ order, paymentUpdate, qrDataUrl }: OrderSummaryPanelProps) {
  const isPaid = paymentUpdate?.paymentStatus === "PAID";
  const isPending = paymentUpdate?.paymentStatus === "PENDING" && !!qrDataUrl;

  return (
    <aside className="w-96 flex flex-col gap-5 shrink-0">
      {/* Order Summary Card */}
      <div className={`bg-primary text-white rounded-[32px] p-8 modal-shadow flex flex-col relative overflow-hidden ${isPaid ? "paid-glow" : ""}`}>
        {/* Decorative circle */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full pointer-events-none" />

        <h2 className="text-sm font-semibold opacity-70 mb-6 uppercase tracking-widest">
          Ringkasan Pesanan
        </h2>

        <div className="space-y-3 mb-6 text-sm">
          <div className="flex justify-between">
            <span className="opacity-75">Subtotal</span>
            <span className="tabular-nums font-medium">{formatCurrencyIDR(order.subtotal)}</span>
          </div>
          {Number(order.serviceChargeAmount) > 0 && (
            <div className="flex justify-between">
              <span className="opacity-75">Biaya Layanan</span>
              <span className="tabular-nums font-medium">{formatCurrencyIDR(order.serviceChargeAmount)}</span>
            </div>
          )}
          {Number(order.taxAmount) > 0 && (
            <div className="flex justify-between">
              <span className="opacity-75">Pajak</span>
              <span className="tabular-nums font-medium">{formatCurrencyIDR(order.taxAmount)}</span>
            </div>
          )}
          {Number(order.discountAmount) > 0 && (
            <div className="flex justify-between text-emerald-300">
              <span>Diskon</span>
              <span className="tabular-nums font-medium">- {formatCurrencyIDR(order.discountAmount)}</span>
            </div>
          )}
        </div>

        <div className="pt-5 border-t border-white/20">
          <div className="flex justify-between items-baseline">
            <span className="font-bold text-base uppercase tracking-wide">Total</span>
            <span className="font-black text-3xl tabular-nums" style={{ letterSpacing: "-0.02em" }}>
              {formatCurrencyIDR(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Paid state overlay */}
        {isPaid && (
          <div className="mt-6 flex items-center gap-3 bg-emerald-500/20 border border-emerald-400/30 rounded-2xl px-4 py-3">
            <div className="w-8 h-8 rounded-full bg-emerald-400 flex items-center justify-center shrink-0">
              <Icon name="check" className="text-white text-[16px]" />
            </div>
            <div>
              <p className="font-bold text-emerald-300 text-sm">Pembayaran Lunas</p>
              <p className="text-xs text-white/60">Terima kasih!</p>
            </div>
          </div>
        )}
      </div>

      {/* QR / Scan to Pay Card */}
      <div className="flex-1 bg-white rounded-[32px] p-8 card-shadow inner-stroke flex flex-col items-center justify-center text-center gap-4">
        {isPaid ? (
          <>
            <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center">
              <Icon name="check_circle" className="text-emerald-500 text-[40px]" />
            </div>
            <p className="font-bold text-primary text-lg">Lunas!</p>
            <p className="text-sm text-black/40">Pesanan #{order.orderNumber} sudah dibayar.</p>
          </>
        ) : isPending && qrDataUrl ? (
          <>
            <span className="text-[11px] text-black/40 uppercase tracking-[0.2em] font-semibold">
              Scan untuk Bayar
            </span>

            {/* QR code with animated corners */}
            <div className="qr-wrap p-4 bg-[#efeeea] rounded-3xl border border-[#c1c8c4] relative">
              {/* Corners */}
              <div className="qr-corner absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
              <div className="qr-corner absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
              <div className="qr-corner absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
              <div className="qr-corner absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />

              <div className="w-40 h-40 bg-white p-2 rounded-xl">
                <img src={qrDataUrl} alt="QR Pembayaran" className="w-full h-full object-contain" />
              </div>
            </div>

            <div className="space-y-1 mt-1">
              <p className="text-sm text-black/60 font-medium">Support QRIS & semua e-wallet</p>
              <div className="flex gap-3 justify-center opacity-50">
                <Icon name="credit_card" className="text-[18px]" />
                <Icon name="account_balance" className="text-[18px]" />
                <Icon name="wallet" className="text-[18px]" />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-[#efeeea] flex items-center justify-center">
              <Icon name="qr_code_2" className="text-primary/40 text-[32px]" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold text-primary">Menunggu Pembayaran</p>
              <p className="text-xs text-black/40">QR akan muncul saat kasir memproses pesanan.</p>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

// ---------------------------------------------------------------------------
// App (main)
// ---------------------------------------------------------------------------
export function App() {
  const [outlet, setOutlet] = useState<PublicOutletInfo | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [paymentUpdate, setPaymentUpdate] = useState<PaymentUpdate | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);

  // Bootstrap: fetch outlet public info & apply brand color
  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiClient.get<ApiSuccessEnvelope<PublicOutletInfo>>("/api/settings/public");
        setOutlet(data.data);
        applyBrandColor(data.data.primaryColor);
      } catch {
        applyBrandColor("#2C4A3B");
        setOutlet({ outletId: "", storeName: "Restaurant", logoUrl: null, primaryColor: "#2C4A3B" });
      }
    })();
  }, []);

  // Realtime via Socket.IO
  useEffect(() => {
    if (!outlet) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL, { withCredentials: true });
    socket.on("connect", () => socket.emit("join-outlet", outlet.outletId));

    socket.on("order:created", (payload: Order) => {
      setOrder(payload);
      setPaymentUpdate(null);
      setQrDataUrl(null);
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

  // Generate QR from payment URL
  useEffect(() => {
    if (paymentUpdate?.paymentStatus === "PENDING" && paymentUpdate.paymentUrl) {
      QRCode.toDataURL(paymentUpdate.paymentUrl)
        .then(setQrDataUrl)
        .catch(() => setQrDataUrl(null));
    } else {
      setQrDataUrl(null);
    }
  }, [paymentUpdate]);

  // Render: wait for outlet bootstrap
  if (!outlet) return null;

  return (
    <div className="h-screen flex flex-col bg-[#faf9f5] text-[#1b1c1a] overflow-hidden">
      {/* ── Header ── */}
      <header className="h-20 bg-white border-b border-[#c1c8c4] flex items-center justify-between px-8 shrink-0">
        {/* Brand / store info */}
        <div className="flex items-center gap-4">
          {outlet.logoUrl ? (
            <img
              src={outlet.logoUrl}
              alt={outlet.storeName}
              className="w-10 h-10 rounded-xl object-cover"
            />
          ) : (
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shrink-0">
              <Icon name="restaurant" className="text-white text-[20px]" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-black text-primary text-xl leading-tight">{outlet.storeName}</span>
            {order && (
              <span className="text-[11px] text-black/40 uppercase tracking-widest font-medium">
                Order #{order.orderNumber} • {orderTypeLabel(order.orderType)}
              </span>
            )}
          </div>
        </div>

        {/* Right: clock */}
        <LiveClock />
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6 max-w-[1600px] mx-auto w-full">
        {/* ── Left: Order List ── */}
        <section className="flex-1 flex flex-col gap-5 overflow-hidden min-w-0">
          {!order ? (
            <IdleScreen storeName={outlet.storeName} logoUrl={outlet.logoUrl} />
          ) : (
            <>
              {/* Section title */}
              <div className="flex items-center justify-between shrink-0">
                <h1 className="font-bold text-primary text-2xl flex items-center gap-3" style={{ letterSpacing: "-0.01em" }}>
                  Pesanan Anda
                  <span className="bg-[#cae6dd] text-[#4f6861] text-sm px-3 py-1 rounded-full font-bold">
                    {totalItems(order.items)} Item
                  </span>
                </h1>
                <div className="flex items-center gap-1 text-primary/60 text-xs font-medium">
                  <Icon name="update" className="text-[14px]" />
                  Live
                </div>
              </div>

              {/* Scrollable item cards */}
              <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1 pb-2">
                {order.items.map((item, idx) => (
                  <OrderItemCard key={item.id} item={item} index={idx} />
                ))}
              </div>
            </>
          )}
        </section>

        {/* ── Right: Summary + QR ── */}
        {order && (
          <OrderSummaryPanel
            order={order}
            paymentUpdate={paymentUpdate}
            qrDataUrl={qrDataUrl}
          />
        )}
      </main>

      {/* ── Footer: Rewards Banner ── */}
      <footer className="h-20 bg-[#cde8df] flex items-center justify-between px-8 shrink-0 relative overflow-hidden">
        {/* Dot grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 2px 2px, #07201a 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="flex items-center gap-4 z-10 relative">
          <div className="w-10 h-10 bg-primary text-white flex items-center justify-center rounded-full shrink-0">
            <Icon name="stars" className="text-[20px]" />
          </div>
          <div>
            <span className="font-black text-primary text-base">Belum jadi member?</span>
            <span className="text-sm text-[#4b635c] ml-2 font-medium opacity-90">
              Bergabung dan hemat 15% di kunjungan berikutnya!
            </span>
          </div>
        </div>
        <div className="z-10 relative">
          <button
            type="button"
            className="bg-primary text-white px-7 h-11 rounded-full font-bold text-sm hover:opacity-90 active:scale-95 transition-all flex items-center gap-2"
          >
            Daftar Sekarang
            <Icon name="arrow_forward" className="text-[18px]" />
          </button>
        </div>
      </footer>

      {/* Global bounce animation for idle dots */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
