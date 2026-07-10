import { Link } from "@tanstack/react-router";
import { Plus, Search } from "lucide-react";
import { motion } from "motion/react";
import { NotificationBell } from "../features/notification/components/NotificationBell";

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function Topbar() {
  return (
    <motion.header
      initial={{ y: -12, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex items-center gap-6 border-b border-black/10 bg-white/80 px-6 py-3 backdrop-blur"
    >
      <div className="relative w-full max-w-md">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-black/35" />
        <input
          type="search"
          placeholder="Cari order, produk, atau pelanggan..."
          className="h-10 w-full rounded-full bg-black/5 pl-10 pr-4 text-sm outline-none transition-shadow placeholder:text-black/35 focus:bg-white focus:ring-2 focus:ring-primary/25"
        />
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-4">
        <span className="hidden text-sm text-black/45 md:block">{dateFormatter.format(new Date())}</span>
        <NotificationBell />
        <Link
          to="/pos"
          className="flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-transform hover:scale-[1.03] active:scale-[0.98]"
        >
          <Plus size={16} />
          Order Baru
        </Link>
      </div>
    </motion.header>
  );
}
