import { Link } from "@tanstack/react-router";
import { Boxes, LayoutDashboard, Settings, ShoppingCart, Truck } from "lucide-react";
import type { ReactNode } from "react";
import { useAuthStore } from "../stores/auth.store";

function NavItem({ to, icon, label, exact }: { to: string; icon: ReactNode; label: string; exact?: boolean }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact }}
      className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-black/70 transition-colors hover:bg-black/5 data-[status=active]:bg-primary data-[status=active]:text-primary-foreground"
    >
      {icon}
      {label}
    </Link>
  );
}

export function Sidebar() {
  const hasPermission = useAuthStore((state) => state.hasPermission);

  return (
    <aside className="flex w-56 flex-col gap-1 border-r border-black/10 bg-white p-4">
      <div className="mb-6 px-2 text-lg font-semibold text-primary">Restaurant POS</div>
      <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" exact />
      <NavItem to="/pos" icon={<ShoppingCart size={18} />} label="POS" />
      {hasPermission("inventory.view") && (
        <NavItem to="/inventory" icon={<Boxes size={18} />} label="Inventory" />
      )}
      {hasPermission("supplier.view") && (
        <NavItem to="/supplier/suppliers" icon={<Truck size={18} />} label="Supplier" />
      )}
      {hasPermission("settings.view") && (
        <NavItem to="/settings/general" icon={<Settings size={18} />} label="Settings" />
      )}
    </aside>
  );
}
