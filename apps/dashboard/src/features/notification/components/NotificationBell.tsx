import { Badge, Button } from "@restaurant-pos/ui";
import { formatDateTime } from "@restaurant-pos/utils";
import { Bell, CheckCheck } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useMarkAllNotificationsRead, useMarkNotificationRead, useNotifications } from "../hooks/useNotifications";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = data?.unreadCount ?? 0;

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="relative rounded-full p-2 hover:bg-black/5"
        aria-label="Notifikasi"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-12 z-50 w-80 rounded-xl border border-black/10 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-black/10 px-4 py-3">
            <span className="text-sm font-semibold">Notifikasi</span>
            {unreadCount > 0 && (
              <Button size="sm" variant="ghost" onClick={() => markAllRead.mutate()}>
                <CheckCheck size={14} /> Tandai semua dibaca
              </Button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {!data || data.items.length === 0 ? (
              <p className="p-4 text-center text-sm text-black/40">Belum ada notifikasi.</p>
            ) : (
              data.items.map((notification) => (
                <button
                  key={notification.id}
                  type="button"
                  onClick={() => !notification.isRead && markRead.mutate(notification.id)}
                  className={`flex w-full flex-col gap-0.5 border-b border-black/5 px-4 py-3 text-left last:border-0 hover:bg-black/5 ${
                    notification.isRead ? "" : "bg-primary/5"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{notification.title}</span>
                    {!notification.isRead && <Badge variant="primary">Baru</Badge>}
                  </div>
                  <span className="text-xs text-black/60">{notification.message}</span>
                  <span className="text-[11px] text-black/40">{formatDateTime(notification.createdAt)}</span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
