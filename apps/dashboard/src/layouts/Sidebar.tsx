import { Link, useNavigate } from "@tanstack/react-router";
import {
  Boxes,
  CalendarCheck,
  ChefHat,
  FileText,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
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
import { motion } from "motion/react";
import { useState, type ReactNode } from "react";
import { logout as logoutRequest } from "../features/auth/services/auth.service";
import { useAuthStore } from "../stores/auth.store";

const EXPANDED_WIDTH = 224;
const COLLAPSED_WIDTH = 76;

function NavTooltip({ label }: { label: string }) {
  return (
    <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-lg bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground opacity-0 shadow-lg ring-1 ring-white/10 transition-opacity duration-150 group-hover:opacity-100">
      {label}
    </span>
  );
}

function NavItem({
  to,
  icon,
  label,
  exact,
  collapsed,
}: {
  to: string;
  icon: ReactNode;
  label: string;
  exact?: boolean;
  collapsed: boolean;
}) {
  return (
    <Link to={to} activeOptions={{ exact }} className="group relative block">
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.span
              layoutId="sidebar-active-pill"
              className="absolute inset-0 rounded-lg bg-primary-foreground"
              transition={{ type: "spring", stiffness: 500, damping: 38 }}
            />
          )}
          <span
            className={`relative z-10 flex items-center gap-3 rounded-lg py-2 text-sm transition-colors duration-150 ${
              collapsed ? "justify-center px-0" : "px-3"
            } ${
              isActive
                ? "font-semibold text-primary"
                : "text-primary-foreground/60 group-hover:bg-white/[0.06] group-hover:text-primary-foreground"
            }`}
          >
            <span className="shrink-0 transition-transform duration-150 group-hover:scale-110">{icon}</span>
            {!collapsed && <span className="truncate">{label}</span>}
          </span>
          {collapsed && <NavTooltip label={label} />}
        </>
      )}
    </Link>
  );
}

function NavSection({
  label,
  collapsed,
  children,
}: {
  label: string;
  collapsed: boolean;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      {collapsed ? (
        <div className="mx-2 mb-1.5 mt-4 border-t border-white/10 first:mt-0 first:border-0" />
      ) : (
        <p className="px-3 pb-1.5 pt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-foreground/35 first:pt-0">
          {label}
        </p>
      )}
      {children}
    </div>
  );
}

export function Sidebar() {
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  async function handleLogout() {
    try {
      await logoutRequest();
    } finally {
      clearAuth();
      navigate({ to: "/login" });
    }
  }

  const initial = user?.name?.charAt(0).toUpperCase() ?? "?";

  return (
    <motion.aside
      initial={{ x: -24, opacity: 0 }}
      animate={{ x: 0, opacity: 1, width: collapsed ? COLLAPSED_WIDTH : EXPANDED_WIDTH }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`flex shrink-0 flex-col gap-0.5 bg-primary p-4 ${collapsed ? "overflow-visible" : "overflow-y-auto"}`}
    >
      <div className={`mb-6 flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
        {!collapsed && (
          <div className="flex items-center gap-2.5 px-1">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10 text-primary-foreground">
              <ChefHat size={20} />
            </div>
            <div className="min-w-0">
              <div className="truncate text-base font-semibold leading-tight text-primary-foreground">BalPOS</div>
              <div className="truncate text-[10px] uppercase tracking-wider text-primary-foreground/45">
                Restaurant OS
              </div>
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => setCollapsed((prev) => !prev)}
          className="rounded-lg p-2 text-primary-foreground/60 transition-colors hover:bg-white/[0.08] hover:text-primary-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <NavSection label="Utama" collapsed={collapsed}>
        <NavItem to="/" icon={<LayoutDashboard size={18} />} label="Dashboard" exact collapsed={collapsed} />
        <NavItem to="/pos" icon={<ShoppingCart size={18} />} label="POS" collapsed={collapsed} />
      </NavSection>

      <NavSection label="Katalog & Stok" collapsed={collapsed}>
        {hasPermission("catalog.view") && (
          <NavItem to="/categories" icon={<Utensils size={18} />} label="Kategori" collapsed={collapsed} />
        )}
        {hasPermission("catalog.view") && (
          <NavItem to="/products" icon={<Package size={18} />} label="Produk" collapsed={collapsed} />
        )}
        {hasPermission("inventory.view") && (
          <NavItem to="/inventory" icon={<Boxes size={18} />} label="Inventory" collapsed={collapsed} />
        )}
        {hasPermission("supplier.view") && (
          <NavItem to="/supplier/suppliers" icon={<Truck size={18} />} label="Supplier" collapsed={collapsed} />
        )}
      </NavSection>

      <NavSection label="Pelanggan" collapsed={collapsed}>
        {hasPermission("crm.view") && (
          <NavItem to="/crm/customers" icon={<Users size={18} />} label="CRM" collapsed={collapsed} />
        )}
        {hasPermission("promotion.view") && (
          <NavItem to="/promotion" icon={<Tag size={18} />} label="Promo" collapsed={collapsed} />
        )}
        {hasPermission("reservation.view") && (
          <NavItem to="/reservation" icon={<CalendarCheck size={18} />} label="Reservasi" collapsed={collapsed} />
        )}
      </NavSection>

      <NavSection label="Laporan" collapsed={collapsed}>
        {hasPermission("report.view") && (
          <NavItem to="/report/summary" icon={<FileText size={18} />} label="Report" collapsed={collapsed} />
        )}
        {hasPermission("audit-log.view") && (
          <NavItem to="/audit-log" icon={<ScrollText size={18} />} label="Audit Log" collapsed={collapsed} />
        )}
        {hasPermission("analytics.view") && (
          <NavItem to="/analytics" icon={<Sparkles size={18} />} label="AI Analytics" collapsed={collapsed} />
        )}
      </NavSection>

      <NavSection label="Sistem" collapsed={collapsed}>
        {hasPermission("settings.view") && (
          <NavItem to="/settings/general" icon={<Settings size={18} />} label="Settings" collapsed={collapsed} />
        )}
      </NavSection>

      <div className={`mt-auto flex flex-col gap-2 border-t border-white/10 pt-4 ${collapsed ? "items-center" : ""}`}>
        <div className={`flex items-center gap-2.5 ${collapsed ? "justify-center" : "px-1"}`}>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-foreground/10 text-sm font-semibold text-primary-foreground">
            {initial}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <div className="truncate text-sm font-medium leading-tight text-primary-foreground">{user?.name}</div>
              <div className="truncate text-xs text-primary-foreground/50">{user?.roleCode}</div>
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className={`group relative flex items-center gap-2 rounded-lg py-2 text-sm font-medium text-primary-foreground/70 transition-colors hover:bg-white/[0.08] hover:text-primary-foreground ${
            collapsed ? "w-full justify-center px-0" : "px-3"
          }`}
        >
          <LogOut size={16} className="shrink-0" />
          {collapsed ? <NavTooltip label="Keluar" /> : "Keluar"}
        </button>
      </div>
    </motion.aside>
  );
}
