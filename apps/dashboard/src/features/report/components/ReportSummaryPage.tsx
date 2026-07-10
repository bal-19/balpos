import { Card, CardHeader, CardTitle, DateRangePicker, Spinner, type DateRange } from "@restaurant-pos/ui";
import { formatCurrencyIDR } from "@restaurant-pos/utils";
import { useMemo, useState } from "react";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useReportSummary } from "../hooks/useReportSummary";
import { REPORT_FILTER_LABELS } from "../types/report.types";

const FILTERS = ["DAILY", "WEEKLY", "MONTHLY", "CUSTOM"] as const;

export function ReportSummaryPage() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("DAILY");
  const [range, setRange] = useState<DateRange | undefined>(undefined);

  const from = range?.from ? range.from.toISOString() : undefined;
  const to = range?.to ? range.to.toISOString() : undefined;

  const { data, isLoading } = useReportSummary({ filter, from, to });

  const primaryColor = useMemo(() => {
    if (typeof document === "undefined") return "#2C4A3B";
    return getComputedStyle(document.documentElement).getPropertyValue("--brand-primary").trim() || "#2C4A3B";
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1 text-xs capitalize ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-black/5 text-black/60"
            }`}
          >
            {REPORT_FILTER_LABELS[f]}
          </button>
        ))}
      </div>

      {filter === "CUSTOM" && <DateRangePicker value={range} onChange={setRange} className="w-fit" />}

      {isLoading || !data ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Total Omset</CardTitle>
              </CardHeader>
              <p className="text-xl font-bold text-primary">{formatCurrencyIDR(data.totalRevenue)}</p>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Total Order</CardTitle>
              </CardHeader>
              <p className="text-xl font-bold text-primary">{data.totalOrders}</p>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Rata-rata Order</CardTitle>
              </CardHeader>
              <p className="text-xl font-bold text-primary">{formatCurrencyIDR(data.averageOrderValue)}</p>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Omset per Periode</CardTitle>
            </CardHeader>
            <div className="h-64">
              {data.points.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-black/40">Belum ada data</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.points}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#00000010" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke={primaryColor} strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Produk Terlaris</CardTitle>
            </CardHeader>
            <div className="flex flex-col gap-1">
              {data.topItems.length === 0 ? (
                <p className="text-sm text-black/40">Belum ada data</p>
              ) : (
                data.topItems.map((item) => (
                  <div key={item.name} className="flex items-center justify-between border-b border-black/5 py-2 text-sm last:border-0">
                    <span>{item.name}</span>
                    <span className="text-black/60">{item.quantity} pcs</span>
                    <span className="font-medium text-primary">{formatCurrencyIDR(item.revenue)}</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}
