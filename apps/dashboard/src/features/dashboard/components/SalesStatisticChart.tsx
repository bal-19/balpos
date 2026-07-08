import { Card, CardHeader, CardTitle } from "@restaurant-pos/ui";
import { useState } from "react";
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useSalesStatistic } from "../hooks/useSalesStatistic";

const COLORS = ["#2C4A3B", "#C97B3E", "#7A8B99", "#B23A48", "#5B7B9A"];
const RANGES = ["day", "month", "year"] as const;

export function SalesStatisticChart() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("day");
  const { data, isLoading } = useSalesStatistic(range);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Statistic</CardTitle>
        <div className="flex gap-1">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRange(r)}
              className={`rounded-full px-3 py-1 text-xs capitalize ${
                range === r ? "bg-primary text-primary-foreground" : "bg-black/5 text-black/60"
              }`}
            >
              {r}
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
                  stroke={COLORS[index % COLORS.length]}
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
