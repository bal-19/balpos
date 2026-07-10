import { Card, CardHeader, CardTitle, Spinner } from "@restaurant-pos/ui";
import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useSalesStatistic } from "../hooks/useSalesStatistic";

const DEFAULT_COLORS = ["#2C4A3B", "#C97B3E", "#7A8B99", "#B23A48", "#5B7B9A"];
const RANGES = ["day", "month", "year"] as const;
const RANGE_LABELS: Record<(typeof RANGES)[number], string> = { day: "Harian", month: "Bulanan", year: "Tahunan" };

export function SalesStatisticChart() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("day");
  const { data, isLoading } = useSalesStatistic(range);
  const colors = useMemo(() => {
    if (typeof document === "undefined") return DEFAULT_COLORS;
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue("--brand-primary").trim() || "#2C4A3B";
    return [primaryColor, ...DEFAULT_COLORS.slice(1)];
  }, []);

  return (
    <Card className="p-5">
      <CardHeader className="items-start">
        <div>
          <CardTitle className="text-xl font-semibold text-black/90">Statistik Penjualan</CardTitle>
          <p className="mt-1 text-xs text-black/40">Performa penjualan real-time per kategori</p>
        </div>
        <div className="flex gap-1 rounded-full bg-black/5 p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                range === r ? "bg-white text-primary shadow-sm" : "text-black/50 hover:text-primary"
              }`}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>
      </CardHeader>
      <div className="h-72">
        {isLoading || !data ? (
          <Spinner className="h-full justify-center" />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.data}>
              <defs>
                <linearGradient id="salesPrimaryFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors[0]} stopOpacity={0.18} />
                  <stop offset="100%" stopColor={colors[0]} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000010" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} dy={8} />
              <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} width={44} />
              <Tooltip contentStyle={{ borderRadius: 8, borderColor: "#00000015", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {data.categories.map((category, index) => (
                <Area
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2.5}
                  fill={index === 0 ? "url(#salesPrimaryFill)" : "transparent"}
                  dot={false}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
