import { TrendingDown, TrendingUp } from "lucide-react";
import type { ReactNode } from "react";
import { Card } from "@restaurant-pos/ui";

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
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        {icon && <div className="w-fit rounded-lg bg-primary/10 p-2 text-primary">{icon}</div>}
        {trend !== undefined && (
          <span
            className={`flex items-center gap-1 text-xs font-bold ${trend >= 0 ? "text-emerald-600" : "text-red-600"}`}
          >
            {trend >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
            {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-black/40">{label}</p>
        <p className="mt-1 text-2xl font-semibold text-black/90">{value}</p>
      </div>
      {sparkline && sparkline.length > 0 && (
        <div className="flex h-10 items-end gap-1">
          {sparkline.map((point, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-sm bg-primary/25"
              style={{ height: `${Math.max(8, (point / max) * 100)}%` }}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
