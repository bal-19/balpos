import { Card, CardHeader, CardTitle } from "@restaurant-pos/ui";
import { useMemo, useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
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
    <Card>
      <CardHeader className="items-start">
        <div>
          <CardTitle>Statistik Penjualan</CardTitle>
          <p className="mt-0.5 text-xs text-black/40">Performa penjualan real-time per kategori</p>
        </div>
        <div className="flex gap-1 rounded-lg bg-black/5 p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                range === r ? "bg-white text-primary shadow-sm" : "text-black/50 hover:text-primary"
              }`}
            >
              {RANGE_LABELS[r]}
            </button>
          ))}
        </div>
      </CardHeader>
      <div className="h-64">
        {isLoading || !data ? (
          <div className="flex h-full items-center justify-center text-sm text-black/40">Memuat...</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              {data.categories.map((category, index) => (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
