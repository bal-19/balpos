import { Button, Input } from "@restaurant-pos/ui";
import { formatCurrencyIDR } from "@restaurant-pos/utils";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { usePosCartStore } from "../../../stores/pos-cart.store";
import { useCreateOrder } from "../hooks/useCreateOrder";
import { useCurrentShift } from "../hooks/useShift";
import { useTables } from "../hooks/useTables";
import { CartItemRow } from "./CartItemRow";
import { OrderTypeTabs } from "./OrderTypeTabs";

export function CartPanel() {
    const items = usePosCartStore((state) => state.items);
    const orderType = usePosCartStore((state) => state.orderType);
    const tableId = usePosCartStore((state) => state.tableId);
    const customerName = usePosCartStore((state) => state.customerName);
    const setTableId = usePosCartStore((state) => state.setTableId);
    const setCustomerName = usePosCartStore((state) => state.setCustomerName);

    const { data: tables } = useTables();
    const { data: currentShift } = useCurrentShift();
    const createOrder = useCreateOrder();
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const hasActiveShift = Boolean(currentShift);
    const canSubmit =
        items.length > 0 && (orderType !== "DINE_IN" || Boolean(tableId)) && !createOrder.isPending && hasActiveShift;

    function handlePlaceOrder() {
        setSuccessMessage(null);
        createOrder.mutate(
            {
                orderType,
                tableId: orderType === "DINE_IN" ? tableId : null,
                customerName: customerName || null,
                items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
            },
            {
                onSuccess: (order) => {
                    setSuccessMessage(`Order ${order.orderNumber} berhasil dibuat!`);
                },
            },
        );
    }

    return (
        <div className="flex h-fit w-80 flex-col rounded-2xl border border-black/10 bg-white p-4">
            <div className="mb-4 flex items-center gap-2">
                <ChevronLeft size={18} className="text-black/40" />
                <h2 className="text-sm font-semibold">Purchase Receipt</h2>
            </div>

            <OrderTypeTabs />

            <div className="mt-4 flex flex-col gap-3">
                <Input
                    placeholder="Nama customer"
                    value={customerName}
                    onChange={(event) => setCustomerName(event.target.value)}
                />
                {orderType === "DINE_IN" && (
                    <select
                        className="h-10 rounded-lg border border-black/10 px-3 text-sm"
                        value={tableId ?? ""}
                        onChange={(event) => setTableId(event.target.value || null)}
                    >
                        <option value="">Pilih meja</option>
                        {tables?.map((table) => (
                            <option key={table.id} value={table.id}>
                                {table.name}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            <div className="mt-4 max-h-72 flex-1 divide-y divide-black/5 overflow-y-auto">
                {items.length === 0 ? (
                    <p className="py-6 text-center text-sm text-black/40">Belum ada item di order.</p>
                ) : (
                    items.map((item) => <CartItemRow key={item.productId} item={item} />)
                )}
            </div>

            <div className="mt-4 border-t border-black/10 pt-3 text-sm">
                <div className="flex justify-between text-black/60">
                    <span>Subtotal</span>
                    <span>{formatCurrencyIDR(subtotal)}</span>
                </div>
                <p className="mt-1 text-xs text-black/40">Pajak & service charge dihitung saat checkout.</p>
            </div>

            {!hasActiveShift && items.length > 0 && (
                <p className="mt-2 text-xs text-amber-600">Shift belum dibuka. Buka shift terlebih dahulu di atas.</p>
            )}
            {successMessage && <p className="mt-2 text-xs text-emerald-600">{successMessage}</p>}
            {createOrder.isError && <p className="mt-2 text-xs text-red-600">Gagal membuat order, coba lagi.</p>}

            <Button className="mt-4 w-full" disabled={!canSubmit} onClick={handlePlaceOrder}>
                {createOrder.isPending ? "Memproses..." : `Place Order — ${formatCurrencyIDR(subtotal)}`}
            </Button>
        </div>
    );
}
