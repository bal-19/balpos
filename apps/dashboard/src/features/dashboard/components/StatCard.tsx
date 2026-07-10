import { TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import type { ReactNode } from "react";

export function StatCard({
  label,
  value,
  icon,
  trendPercent,
  sparkline,
}: {
  label: string;
  value: string;
  icon?: ReactNode;
  trendPercent?: string;
  sparkline?: number[];
}) {
  const trend = trendPercent !== undefined ? Number.parseFloat(trendPercent) : undefined;
  const max = sparkline && sparkline.length > 0 ? Math.max(...sparkline, 1) : 1;

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: "0 8px 24px rgba(26, 58, 50, 0.10)" }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="flex flex-col gap-4 rounded-lg border border-black/10 bg-white p-5 shadow-sm"
    >
      <div className="flex items-start justify-between">
        {icon && (
          <div className="w-fit rounded-lg border border-black/10 bg-white p-2.5 text-primary shadow-sm">{icon}</div>
        )}
        {trend !== undefined && (
          <span
            className={`flex items-center gap-1 text-xs font-bold ${
              trend >= 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-black/40">{label}</p>
        <p className="mt-1 truncate text-[26px] font-semibold leading-snug text-black/90">{value}</p>
      </div>
      {sparkline && sparkline.length > 0 && (
        <div className="flex h-12 items-end gap-1.5">
          {sparkline.map((point, index) => (
            <motion.div
              key={index}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.4, delay: 0.2 + index * 0.04, ease: "easeOut" }}
              className={`flex-1 origin-bottom rounded-sm ${
                index === sparkline.length - 1 ? "bg-black/25" : "bg-black/10"
              }`}
              style={{ height: `${Math.max(10, (point / max) * 100)}%` }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
