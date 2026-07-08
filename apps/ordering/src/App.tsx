import type {
  ApiSuccessEnvelope,
  Order,
  Product,
  PublicOrderingContext,
  PublicOrderStatus,
} from "@restaurant-pos/types";
import { applyBrandColor, Button, Card } from "@restaurant-pos/ui";
import { formatCurrencyIDR } from "@restaurant-pos/utils";
import { useEffect, useMemo, useState } from "react";
import { apiClient } from "./lib/api-client";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

type Step = "menu" | "checkout" | "waiting" | "done";

function getTableIdFromPath(): string | null {
  const match = /\/t\/([^/]+)/.exec(window.location.pathname);
  return match?.[1] ?? null;
}

export function App() {
  const tableId = useMemo(() => getTableIdFromPath(), []);
  const [context, setContext] = useState<PublicOrderingContext | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState("");
  const [step, setStep] = useState<Step>("menu");
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderStatus, setOrderStatus] = useState<PublicOrderStatus | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!tableId) {
      setError("QR tidak valid — table id tidak ditemukan di URL.");
      return;
    }
    (async () => {
      try {
        const { data } = await apiClient.get<ApiSuccessEnvelope<PublicOrderingContext>>(
          `/api/ordering/context/${tableId}`,
        );
        setContext(data.data);
        applyBrandColor(data.data.primaryColor);
        setSelectedCategoryId(data.data.categories[0]?.id ?? null);
      } catch {
        setError("Meja tidak ditemukan atau sudah tidak aktif.");
      }
    })();
  }, [tableId]);

  useEffect(() => {
    if (step !== "waiting" || !orderId) return;

    const interval = setInterval(async () => {
      const { data } = await apiClient.get<ApiSuccessEnvelope<PublicOrderStatus>>(
        `/api/ordering/orders/${orderId}/status`,
      );
      setOrderStatus(data.data);
      if (data.data.paymentStatus === "PAID" || data.data.paymentStatus === "FAILED") {
        setStep("done");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [step, orderId]);

  function addToCart(product: Product) {
    setCart((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [...prev, { productId: product.id, name: product.name, price: Number(product.price), quantity: 1 }];
    });
  }

  function updateQuantity(productId: string, quantity: number) {
    setCart((prev) =>
      quantity <= 0
        ? prev.filter((item) => item.productId !== productId)
        : prev.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
    );
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handleCheckout() {
    if (!tableId || cart.length === 0 || !customerName.trim()) return;
    setSubmitting(true);
    try {
      const { data } = await apiClient.post<ApiSuccessEnvelope<Order>>(`/api/ordering/orders/${tableId}`, {
        customerName,
        paymentMethod: "QRIS",
        items: cart.map((item) => ({ productId: item.productId, quantity: item.quantity })),
      });
      const paymentUrl = data.data.payments[data.data.payments.length - 1]?.paymentUrl;
      setOrderId(data.data.id);
      setStep("waiting");
      if (paymentUrl) window.open(paymentUrl, "_blank");
    } catch {
      setError("Gagal membuat order, coba lagi.");
    } finally {
      setSubmitting(false);
    }
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface p-8 text-center text-black/60">
        {error}
      </div>
    );
  }

  if (!context) return null;

  return (
    <div className="min-h-screen bg-surface p-4 pb-32">
      <h1 className="mb-1 text-lg font-semibold text-primary">{context.storeName}</h1>
      <p className="mb-4 text-sm text-black/50">Meja {context.table.name}</p>

      {step === "menu" && (
        <>
          <div className="mb-4 flex gap-2 overflow-x-auto">
            {context.categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategoryId(category.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-sm ${
                  selectedCategoryId === category.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-white text-black/60"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {context.products
              .filter((product) => product.categoryId === selectedCategoryId)
              .map((product) => (
                <Card key={product.id}>
                  <div className="text-sm font-medium">{product.name}</div>
                  <div className="mb-2 text-xs text-black/50">{formatCurrencyIDR(product.price)}</div>
                  <Button size="sm" className="w-full" onClick={() => addToCart(product)}>
                    Tambah
                  </Button>
                </Card>
              ))}
          </div>

          {cart.length > 0 && (
            <div className="fixed inset-x-0 bottom-0 border-t border-black/10 bg-white p-4">
              <div className="mb-3 flex flex-col gap-1">
                {cart.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between text-sm">
                    <span>{item.name}</span>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button type="button" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mb-3 flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>{formatCurrencyIDR(subtotal)}</span>
              </div>
              <Button className="w-full" onClick={() => setStep("checkout")}>
                Checkout
              </Button>
            </div>
          )}
        </>
      )}

      {step === "checkout" && (
        <div className="mx-auto max-w-sm rounded-2xl border border-black/10 bg-white p-6">
          <h2 className="mb-4 text-base font-semibold">Checkout</h2>
          <input
            className="mb-4 h-10 w-full rounded-lg border border-black/10 px-3 text-sm"
            placeholder="Nama kamu"
            value={customerName}
            onChange={(event) => setCustomerName(event.target.value)}
          />
          <div className="mb-4 flex justify-between text-sm font-medium">
            <span>Total</span>
            <span>{formatCurrencyIDR(subtotal)}</span>
          </div>
          <Button className="w-full" disabled={submitting || !customerName.trim()} onClick={handleCheckout}>
            {submitting ? "Memproses..." : "Bayar dengan Xendit"}
          </Button>
        </div>
      )}

      {step === "waiting" && (
        <div className="flex flex-col items-center gap-3 pt-16 text-center">
          <p className="text-black/60">Menunggu konfirmasi pembayaran...</p>
          <p className="text-xs text-black/40">
            Selesaikan pembayaran di tab yang terbuka, halaman ini akan update otomatis.
          </p>
        </div>
      )}

      {step === "done" && (
        <div className="flex flex-col items-center gap-3 pt-16 text-center">
          {orderStatus?.paymentStatus === "PAID" ? (
            <p className="text-lg font-semibold text-emerald-600">
              Pembayaran berhasil! Pesanan sedang diproses.
            </p>
          ) : (
            <p className="text-lg font-semibold text-red-600">Pembayaran gagal, silakan coba lagi.</p>
          )}
        </div>
      )}
    </div>
  );
}
