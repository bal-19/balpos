import { Link } from "@tanstack/react-router";
import {
  Boxes,
  CalendarCheck,
  FileText,
  LayoutDashboard,
  ScrollText,
  Settings,
  ShoppingCart,
  Sparkles,
  Tag,
  Truck,
  Users,
  Utensils,
  Package,
} from "lucide-react";
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

function NavSection({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="px-3 pb-1 pt-4 text-[11px] font-semibold uppercase tracking-wider text-black/40 first:pt-0">
        {label}
      </p>
      {children}
    </div>
  );
}

export function Sidebar() {
  const hasPermission = useAuthStore((state) => state.hasPermission);

  return (
    <aside className="flex w-56 flex-col gap-1 border-r border-black/10 bg-white p-4">
      <div className="mb-6 px-2 text-lg font-semibold text-primary">Restaurant POS</div>

      <NavSection label="Utama">
        <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" exact />
        <NavItem to="/pos" icon={<ShoppingCart size={18} />} label="POS" />
      </NavSection>

      <NavSection label="Katalog & Stok">
        {hasPermission("catalog.view") && (
          <NavItem to="/categories" icon={<Utensils size={18} />} label="Kategori" />
        )}
        {hasPermission("catalog.view") && (
          <NavItem to="/products" icon={<Package size={18} />} label="Produk" />
        )}
        {hasPermission("inventory.view") && (
          <NavItem to="/inventory" icon={<Boxes size={18} />} label="Inventory" />
        )}
        {hasPermission("supplier.view") && (
          <NavItem to="/supplier/suppliers" icon={<Truck size={18} />} label="Supplier" />
        )}
      </NavSection>

      <NavSection label="Pelanggan">
        {hasPermission("crm.view") && (
          <NavItem to="/crm/customers" icon={<Users size={18} />} label="CRM" />
        )}
        {hasPermission("promotion.view") && (
          <NavItem to="/promotion" icon={<Tag size={18} />} label="Promo" />
        )}
        {hasPermission("reservation.view") && (
          <NavItem to="/reservation" icon={<CalendarCheck size={18} />} label="Reservasi" />
        )}
      </NavSection>

      <NavSection label="Laporan">
        {hasPermission("report.view") && (
          <NavItem to="/report/summary" icon={<FileText size={18} />} label="Report" />
        )}
        {hasPermission("audit-log.view") && (
          <NavItem to="/audit-log" icon={<ScrollText size={18} />} label="Audit Log" />
        )}
        {hasPermission("analytics.view") && (
          <NavItem to="/analytics" icon={<Sparkles size={18} />} label="AI Analytics" />
        )}
      </NavSection>

      <NavSection label="Sistem">
        {hasPermission("settings.view") && (
          <NavItem to="/settings/general" icon={<Settings size={18} />} label="Settings" />
        )}
      </NavSection>
    </aside>
  );
}
