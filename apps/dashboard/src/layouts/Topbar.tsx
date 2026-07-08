import { useNavigate } from "@tanstack/react-router";
import { Bell, LogOut } from "lucide-react";
import { logout as logoutRequest } from "../features/auth/services/auth.service";
import { useAuthStore } from "../stores/auth.store";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function Topbar() {
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  async function handleLogout() {
    try {
      await logoutRequest();
    } finally {
      clearAuth();
      navigate({ to: "/login" });
    }
  }

  return (
    <header className="flex items-center justify-between border-b border-black/10 bg-white px-6 py-4">
      <span className="text-sm text-black/50">{dateFormatter.format(new Date())}</span>
      <div className="flex items-center gap-4">
        <button type="button" className="rounded-full p-2 hover:bg-black/5" aria-label="Notifikasi">
          <Bell size={18} />
        </button>
        <div className="text-right">
          <div className="text-sm font-medium">{user?.name}</div>
          <div className="text-xs text-black/50">{user?.roleCode}</div>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-full p-2 hover:bg-black/5"
          aria-label="Logout"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
