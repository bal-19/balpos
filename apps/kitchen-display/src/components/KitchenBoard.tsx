import type { ApiSuccessEnvelope, KitchenItemStatus, KitchenOrder } from "@restaurant-pos/types";
import { Badge, Button, Card } from "@restaurant-pos/ui";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { apiClient } from "../lib/api-client";
import { getAuthState, setAuthState } from "../lib/auth";

const STATUS_FLOW: Record<KitchenItemStatus, KitchenItemStatus | null> = {
  NEW: "PREPARING",
  PREPARING: "READY",
  READY: null,
};

const STATUS_LABEL: Record<KitchenItemStatus, string> = {
  NEW: "Baru",
  PREPARING: "Diproses",
  READY: "Siap",
};

async function fetchOrders(): Promise<KitchenOrder[]> {
  const { data } = await apiClient.get<ApiSuccessEnvelope<KitchenOrder[]>>("/api/kitchen/orders");
  return data.data;
}

function elapsedMinutes(createdAt: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000));
}

export function KitchenBoard() {
  const queryClient = useQueryClient();
  const { data: orders, isLoading } = useQuery({
    queryKey: ["kitchen", "orders"],
    queryFn: fetchOrders,
    refetchInterval: 15000,
  });

  useEffect(() => {
    const outletId = getAuthState().user?.outletId;
    if (!outletId) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL, { withCredentials: true });
    socket.on("connect", () => socket.emit("join-outlet", outletId));
    socket.on("order:created", () => queryClient.invalidateQueries({ queryKey: ["kitchen", "orders"] }));
    socket.on("order:item.updated", () =>
      queryClient.invalidateQueries({ queryKey: ["kitchen", "orders"] }),
    );

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  async function advanceStatus(itemId: string, current: KitchenItemStatus) {
    const next = STATUS_FLOW[current];
    if (!next) return;
    await apiClient.patch(`/api/kitchen/order-items/${itemId}/status`, { status: next });
    queryClient.invalidateQueries({ queryKey: ["kitchen", "orders"] });
  }

  function handleLogout() {
    setAuthState({ user: null, accessToken: null });
  }

  return (
    <div className="min-h-screen bg-surface p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-primary">Kitchen Display</h1>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Logout
        </Button>
      </div>

      {isLoading ? (
        <p className="text-sm text-black/40">Memuat order...</p>
      ) : !orders || orders.length === 0 ? (
        <p className="text-sm text-black/40">Tidak ada order aktif.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <Card key={order.id}>
              <div className="mb-2 flex items-center justify-between">
                <span className="font-semibold">{order.orderNumber}</span>
                <span className="text-xs text-black/40">{elapsedMinutes(order.createdAt)} menit lalu</span>
              </div>
              <div className="mb-3 text-xs text-black/50">
                {order.tableName ? `Meja ${order.tableName}` : order.orderType}
                {order.customerName ? ` — ${order.customerName}` : ""}
              </div>
              <div className="flex flex-col gap-2">
                {order.items.map((item) => {
                  const next = STATUS_FLOW[item.kitchenStatus];
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-lg border border-black/5 p-2"
                    >
                      <div>
                        <div className="text-sm font-medium">
                          {item.productNameSnapshot} x{item.quantity}
                        </div>
                        {item.notes && <div className="text-xs text-black/40">{item.notes}</div>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            item.kitchenStatus === "READY"
                              ? "success"
                              : item.kitchenStatus === "PREPARING"
                                ? "warning"
                                : "outline"
                          }
                        >
                          {STATUS_LABEL[item.kitchenStatus]}
                        </Badge>
                        {next && (
                          <Button size="sm" onClick={() => advanceStatus(item.id, item.kitchenStatus)}>
                            {STATUS_LABEL[next]}
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
