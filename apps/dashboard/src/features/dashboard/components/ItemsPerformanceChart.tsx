import { Card, CardHeader, CardTitle } from "@restaurant-pos/ui";
import { useMemo } from "react";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { useItemsPerformance } from "../hooks/useItemsPerformance";

export function ItemsPerformanceChart() {
  const { data, isLoading } = useItemsPerformance(6);
  const primaryColor = useMemo(() => {
    if (typeof document === "undefined") return "#2C4A3B";
    return getComputedStyle(document.documentElement).getPropertyValue("--brand-primary").trim() || "#2C4A3B";
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Items Performance</CardTitle>
      </CardHeader>
      <div className="h-64">
        {isLoading || !data || data.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-black/40">
            Belum ada data
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} />
              <Radar dataKey="quantity" stroke={primaryColor} fill={primaryColor} fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
