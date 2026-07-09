import type {
  ApiSuccessEnvelope,
  KitchenItemStatus,
  KitchenOrder,
  KitchenOrderItem,
} from "@restaurant-pos/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { apiClient } from "../lib/api-client";
import { getAuthState, setAuthState } from "../lib/auth";

// ---------------------------------------------------------------------------
// Status flow & helpers
// ---------------------------------------------------------------------------
const STATUS_FLOW: Record<KitchenItemStatus, KitchenItemStatus | null> = {
  NEW: "PREPARING",
  PREPARING: "READY",
  READY: null,
};

function elapsedMinutes(createdAt: string): number {
  return Math.max(0, Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000));
}

function elapsedDisplay(createdAt: string): string {
  const mins = elapsedMinutes(createdAt);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return `${h}h ${String(m).padStart(2, "0")}m`;
  return `${String(m).padStart(2, "0")}:00`;
}

function isUrgent(createdAt: string): boolean {
  return elapsedMinutes(createdAt) >= 5;
}

function orderTypeLabel(type: KitchenOrder["orderType"], tableName: string | null): string {
  if (type === "DINE_IN" && tableName) return `Meja ${tableName}`;
  if (type === "TAKE_AWAY") return "Take Away";
  if (type === "ORDER_ONLINE") return "Online";
  return type;
}

// ---------------------------------------------------------------------------
// Column classification helpers (based on real backend data shape)
// ---------------------------------------------------------------------------
function hasStatus(items: KitchenOrderItem[], status: KitchenItemStatus): boolean {
  return items.some((i) => i.kitchenStatus === status);
}

type KdsColumn = "INCOMING" | "PREPARING" | "READY";

function getOrderColumn(order: KitchenOrder): KdsColumn {
  const hasPreparing = hasStatus(order.items, "PREPARING");
  if (hasPreparing) return "PREPARING";
  const hasNew = hasStatus(order.items, "NEW");
  if (hasNew) return "INCOMING";
  return "READY";
}

// ---------------------------------------------------------------------------
// API helpers
// ---------------------------------------------------------------------------
async function fetchOrders(): Promise<KitchenOrder[]> {
  const { data } = await apiClient.get<ApiSuccessEnvelope<KitchenOrder[]>>("/api/kitchen/orders");
  return data.data;
}

async function advanceItem(itemId: string, current: KitchenItemStatus): Promise<void> {
  const next = STATUS_FLOW[current];
  if (!next) return;
  await apiClient.patch(`/api/kitchen/order-items/${itemId}/status`, { status: next });
}

// ---------------------------------------------------------------------------
// Icon component — wraps Material Symbols
// ---------------------------------------------------------------------------
function Icon({ name, className = "" }: { name: string; className?: string }) {
  return <span className={`material-symbols-outlined ${className}`}>{name}</span>;
}

// ---------------------------------------------------------------------------
// OrderCard
// ---------------------------------------------------------------------------
interface OrderCardProps {
  order: KitchenOrder;
  column: KdsColumn;
  onAdvanceAll: (order: KitchenOrder, targetStatus: KitchenItemStatus) => Promise<void>;
  processing: boolean;
}

function OrderCard({ order, column, onAdvanceAll, processing }: OrderCardProps) {
  const urgent = isUrgent(order.createdAt);
  const elapsed = elapsedDisplay(order.createdAt);

  const cardBase =
    "kds-card rounded-xl p-4 flex flex-col gap-3 relative overflow-hidden bg-white";
  const cardClass = urgent && column === "INCOMING" ? `${cardBase} urgent-border` : `${cardBase} inner-stroke`;

  return (
    <article className={cardClass}>
      {/* Urgent ribbon */}
      {urgent && column === "INCOMING" && (
        <div className="absolute top-0 right-0 bg-red-600 text-white px-3 py-0.5 text-[10px] font-bold rounded-bl-lg tracking-widest">
          URGENT
        </div>
      )}

      {/* Preparing live-dot */}
      {column === "PREPARING" && (
        <div className="absolute top-3 right-3 flex gap-1">
          <span className="relative flex h-2 w-2">
            <span className="live-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
          </span>
        </div>
      )}

      {/* Ready checkmark */}
      {column === "READY" && (
        <div className="absolute top-3 right-3 bg-primary text-white p-1 rounded-lg">
          <Icon name="done_all" className="text-[16px]" />
        </div>
      )}

      {/* Header: order number + elapsed */}
      <div className="flex items-start justify-between">
        <div>
          <h3
            className="font-bold text-primary text-lg leading-none"
            style={{ letterSpacing: "-0.01em" }}
          >
            #{order.orderNumber}
          </h3>
          <p className="text-xs text-black/50 uppercase tracking-wide mt-0.5">
            {orderTypeLabel(order.orderType, order.tableName)}
            {order.customerName ? ` • ${order.customerName}` : ""}
          </p>
        </div>
        <div className="text-right shrink-0">
          <span
            className={`font-bold text-base tabular-nums ${
              urgent && column !== "READY"
                ? "text-red-600"
                : column === "PREPARING"
                  ? "text-primary"
                  : "text-black/60"
            }`}
          >
            {elapsed}
          </span>
          <p className="text-[10px] text-black/40 uppercase tracking-widest">
            {column === "PREPARING" ? "TIMER" : "ELAPSED"}
          </p>
        </div>
      </div>

      {/* Item list */}
      <ul className="flex flex-col gap-2 flex-1">
        {order.items.map((item, idx) => {
          const isDone = item.kitchenStatus === "READY";
          return (
            <li
              key={item.id}
              className={`flex items-start justify-between gap-3 ${
                idx > 0 ? "border-t border-black/5 pt-2" : ""
              }`}
            >
              <div className={`flex items-start gap-2 ${isDone ? "opacity-50" : ""}`}>
                {isDone ? (
                  <Icon name="check_circle" className="text-primary text-[18px] mt-0.5 shrink-0" />
                ) : (
                  <span
                    className="bg-black/5 text-black/70 px-1.5 py-0.5 rounded text-xs font-bold shrink-0"
                    aria-label={`Kuantitas ${item.quantity}`}
                  >
                    {item.quantity}x
                  </span>
                )}
                <div>
                  <p
                    className={`text-sm font-semibold ${isDone ? "line-through text-black/40" : "text-black/80"}`}
                  >
                    {item.productNameSnapshot}
                  </p>
                  {item.notes && (
                    <p className="text-xs text-primary font-medium italic leading-tight mt-0.5">
                      • {item.notes}
                    </p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {/* Action button */}
      {column === "INCOMING" && (
        <ActionButton
          loading={processing}
          onClick={() => onAdvanceAll(order, "PREPARING")}
          icon="play_arrow"
          label="START PREPARING"
          className="bg-primary text-white"
        />
      )}
      {column === "PREPARING" && (
        <ActionButton
          loading={processing}
          onClick={() => onAdvanceAll(order, "READY")}
          icon="check_circle"
          label="MARK AS READY"
          className="bg-black/80 text-white"
        />
      )}
      {column === "READY" && (
        <ActionButton
          loading={processing}
          onClick={() => onAdvanceAll(order, "READY")}
          icon="send"
          label="SERVE ORDER"
          className="bg-transparent border-2 border-primary text-primary"
          disabled
        />
      )}
    </article>
  );
}

// ---------------------------------------------------------------------------
// ActionButton
// ---------------------------------------------------------------------------
interface ActionButtonProps {
  loading: boolean;
  onClick: () => void;
  icon: string;
  label: string;
  className?: string;
  disabled?: boolean;
}

function ActionButton({ loading, onClick, icon, label, className = "", disabled = false }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className={`w-full py-3 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none ${className}`}
    >
      {loading ? (
        <Icon name="sync" className="text-[18px] animate-spin" />
      ) : (
        <Icon name={icon} className="text-[18px]" />
      )}
      {loading ? "PROCESSING..." : label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// KDS Column
// ---------------------------------------------------------------------------
interface KdsColumnProps {
  title: string;
  icon: string;
  orders: KitchenOrder[];
  column: KdsColumn;
  badgeClass: string;
  processingIds: Set<string>;
  onAdvanceAll: (order: KitchenOrder, targetStatus: KitchenItemStatus) => Promise<void>;
}

function KdsColumnPanel({
  title,
  icon,
  orders,
  column,
  badgeClass,
  processingIds,
  onAdvanceAll,
}: KdsColumnProps) {
  return (
    <div className="flex flex-col gap-4 min-w-0">
      {/* Column header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="font-bold text-primary flex items-center gap-2 text-base tracking-wide">
          <Icon name={icon} />
          {title}
        </h2>
        <span
          className={`px-3 py-1 rounded-full font-bold text-xs ${badgeClass}`}
          aria-label={`${orders.length} order`}
        >
          {String(orders.length).padStart(2, "0")}
        </span>
      </div>

      {/* Card list */}
      <div className="kds-column overflow-y-auto scrollbar-hide flex flex-col gap-4 pr-1">
        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 opacity-30">
            <Icon name="inbox" className="text-[40px] mb-2" />
            <p className="text-xs uppercase tracking-widest">Kosong</p>
          </div>
        ) : (
          orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              column={column}
              onAdvanceAll={onAdvanceAll}
              processing={processingIds.has(order.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// KitchenVitalsFooter
// ---------------------------------------------------------------------------
interface VitalsFooterProps {
  totalActive: number;
  avgElapsedMinutes: number;
}

function KitchenVitalsFooter({ totalActive, avgElapsedMinutes }: VitalsFooterProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const avgDisplay =
    avgElapsedMinutes >= 60
      ? `${Math.floor(avgElapsedMinutes / 60)}j ${avgElapsedMinutes % 60}m`
      : `${avgElapsedMinutes}m`;

  const load = Math.min(100, Math.round((totalActive / 20) * 100));

  return (
    <footer className="h-20 bg-primary border-t border-primary/20 flex items-center px-8 justify-between shrink-0">
      {/* Vitals metrics */}
      <div className="flex items-center gap-10">
        {/* Avg ticket time */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Icon name="timer" className="text-white text-[18px]" />
          </div>
          <div>
            <p className="text-[10px] text-white/60 uppercase tracking-widest leading-none">
              Avg Ticket Time
            </p>
            <p className="font-bold text-white text-sm">{avgDisplay}</p>
          </div>
        </div>

        {/* Active tickets */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Icon name="assignment" className="text-white text-[18px]" />
          </div>
          <div>
            <p className="text-[10px] text-white/60 uppercase tracking-widest leading-none">
              Active Tickets
            </p>
            <p className="font-bold text-white text-sm">
              {totalActive}{" "}
              <span className="font-normal text-xs text-white/60">
                {totalActive === 0 ? "Clear" : "On Track"}
              </span>
            </p>
          </div>
        </div>

        {/* Kitchen load */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/10 rounded-lg">
            <Icon name="local_fire_department" className="text-white text-[18px]" />
          </div>
          <div>
            <p className="text-[10px] text-white/60 uppercase tracking-widest leading-none">
              Kitchen Load
            </p>
            <div className="w-32 h-2 bg-white/20 rounded-full mt-1 overflow-hidden">
              <div
                className="h-full bg-white/70 rounded-full transition-all duration-700"
                style={{ width: `${load}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clock + actions */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-[10px] text-white/60 uppercase tracking-widest leading-none">
            Waktu
          </p>
          <p className="font-bold text-white text-sm tabular-nums">{timeStr}</p>
        </div>
        <button
          type="button"
          className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
          title="Refresh"
        >
          <Icon name="refresh" className="text-white text-[18px]" />
        </button>
      </div>
    </footer>
  );
}

// ---------------------------------------------------------------------------
// KitchenBoard (main)
// ---------------------------------------------------------------------------
export function KitchenBoard() {
  const queryClient = useQueryClient();
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["kitchen", "orders"],
    queryFn: fetchOrders,
    refetchInterval: 15_000,
  });

  // Socket.IO realtime sync
  useEffect(() => {
    const outletId = getAuthState().user?.outletId;
    if (!outletId) return;

    const socket = io(import.meta.env.VITE_SOCKET_URL, { withCredentials: true });
    socket.on("connect", () => socket.emit("join-outlet", outletId));
    socket.on("order:created", () =>
      queryClient.invalidateQueries({ queryKey: ["kitchen", "orders"] }),
    );
    socket.on("order:item.updated", () =>
      queryClient.invalidateQueries({ queryKey: ["kitchen", "orders"] }),
    );

    return () => {
      socket.disconnect();
    };
  }, [queryClient]);

  // Advance all items in an order that are currently in the source status
  const handleAdvanceAll = useCallback(
    async (order: KitchenOrder, targetStatus: KitchenItemStatus) => {
      const sourceStatus: KitchenItemStatus = targetStatus === "PREPARING" ? "NEW" : "PREPARING";
      const itemsToAdvance = order.items.filter((i) => i.kitchenStatus === sourceStatus);
      if (itemsToAdvance.length === 0) return;

      setProcessingIds((prev) => new Set([...prev, order.id]));
      try {
        await Promise.all(itemsToAdvance.map((i) => advanceItem(i.id, i.kitchenStatus)));
        await queryClient.invalidateQueries({ queryKey: ["kitchen", "orders"] });
      } finally {
        setProcessingIds((prev) => {
          const next = new Set(prev);
          next.delete(order.id);
          return next;
        });
      }
    },
    [queryClient],
  );

  function handleLogout() {
    setAuthState({ user: null, accessToken: null });
  }

  // Classify orders into columns
  const incoming = orders.filter((o) => getOrderColumn(o) === "INCOMING");
  const preparing = orders.filter((o) => getOrderColumn(o) === "PREPARING");
  const ready = orders.filter((o) => getOrderColumn(o) === "READY");

  // Vitals: avg elapsed over all active orders
  const avgElapsed =
    orders.length > 0
      ? Math.round(
          orders.reduce((acc, o) => acc + elapsedMinutes(o.createdAt), 0) / orders.length,
        )
      : 0;

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f3ea]">
      {/* ── Sidebar Navigation Rail ── */}
      <aside className="w-20 h-screen fixed left-0 top-0 flex flex-col bg-primary border-r border-white/10 shadow-sm z-50 shrink-0">
        <div className="flex flex-col items-center py-5 gap-1">
          {/* Brand mark */}
          <div className="text-2xl font-extrabold text-white mb-5 tracking-tight select-none">
            R
          </div>

          {/* Nav items */}
          <nav className="flex flex-col gap-2 w-full items-center px-3">
            {/* Dashboard */}
            <button
              type="button"
              className="text-white/50 p-3 hover:bg-white/10 rounded-lg transition-colors w-full flex justify-center"
              title="Dashboard"
            >
              <Icon name="dashboard" className="text-[20px]" />
            </button>
            {/* POS */}
            <button
              type="button"
              className="text-white/50 p-3 hover:bg-white/10 rounded-lg transition-colors w-full flex justify-center"
              title="POS"
            >
              <Icon name="point_of_sale" className="text-[20px]" />
            </button>
            {/* Kitchen (active) */}
            <button
              type="button"
              className="bg-white/20 text-white p-3 rounded-lg w-full flex justify-center"
              title="Kitchen Display"
              aria-current="page"
            >
              <Icon name="skillet" className="text-[20px]" />
            </button>
            {/* Analytics */}
            <button
              type="button"
              className="text-white/50 p-3 hover:bg-white/10 rounded-lg transition-colors w-full flex justify-center"
              title="Laporan"
            >
              <Icon name="monitoring" className="text-[20px]" />
            </button>
          </nav>
        </div>

        {/* Bottom: settings + avatar */}
        <div className="mt-auto pb-5 flex flex-col items-center gap-3 px-3">
          <button
            type="button"
            className="text-white/50 p-3 hover:bg-white/10 rounded-lg w-full flex justify-center"
            title="Pengaturan"
          >
            <Icon name="settings" className="text-[20px]" />
          </button>
          <div
            className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-sm select-none cursor-pointer hover:bg-white/30 transition-colors"
            title="Keluar"
            onClick={handleLogout}
          >
            <Icon name="person" className="text-[20px]" />
          </div>
        </div>
      </aside>

      {/* ── Main Content Canvas ── */}
      <main className="ml-20 flex flex-col flex-1 min-w-0 h-screen overflow-hidden">
        {/* ── Top Bar ── */}
        <header className="h-[72px] flex items-center justify-between px-6 bg-[#f5f3ea]/80 backdrop-blur-md border-b border-black/8 sticky top-0 z-40 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="font-bold text-primary text-base tracking-[0.05em] uppercase">
              Kitchen Display System
            </h1>
            <div className="h-5 w-px bg-black/15" />
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="live-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
              </span>
              <span className="text-[11px] text-black/50 uppercase tracking-widest font-medium">
                Live
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoading && (
              <span className="text-xs text-black/40 flex items-center gap-1">
                <Icon name="sync" className="text-[14px] animate-spin" />
                Memuat...
              </span>
            )}
            <button
              type="button"
              className="flex items-center gap-1.5 bg-black/5 hover:bg-black/10 px-3 py-2 rounded-full text-[11px] font-semibold text-black/60 uppercase tracking-widest transition-colors"
            >
              <Icon name="history" className="text-[16px]" />
              Log Order
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="bg-primary text-white text-[11px] font-bold uppercase tracking-widest px-5 py-2 rounded-full hover:opacity-90 active:scale-95 transition-all"
            >
              Keluar
            </button>
          </div>
        </header>

        {/* ── KDS Board ── */}
        <section className="flex-1 overflow-hidden p-5">
          <div className="grid grid-cols-3 gap-6 h-full">
            <KdsColumnPanel
              title="INCOMING"
              icon="inbox"
              column="INCOMING"
              orders={incoming}
              badgeClass="bg-primary text-white"
              processingIds={processingIds}
              onAdvanceAll={handleAdvanceAll}
            />
            <KdsColumnPanel
              title="PREPARING"
              icon="skillet"
              column="PREPARING"
              orders={preparing}
              badgeClass="bg-amber-100 text-amber-800"
              processingIds={processingIds}
              onAdvanceAll={handleAdvanceAll}
            />
            <KdsColumnPanel
              title="READY"
              icon="task_alt"
              column="READY"
              orders={ready}
              badgeClass="bg-emerald-100 text-emerald-800"
              processingIds={processingIds}
              onAdvanceAll={handleAdvanceAll}
            />
          </div>
        </section>

        {/* ── Kitchen Vitals Footer ── */}
        <KitchenVitalsFooter totalActive={orders.length} avgElapsedMinutes={avgElapsed} />
      </main>
    </div>
  );
}
