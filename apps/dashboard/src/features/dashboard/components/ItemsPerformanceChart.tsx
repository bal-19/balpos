import { Card, CardHeader, CardTitle } from "@restaurant-pos/ui";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { useItemsPerformance } from "../hooks/useItemsPerformance";

export function ItemsPerformanceChart() {
  const { data, isLoading } = useItemsPerformance(6);

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
              <Radar dataKey="quantity" stroke="#2C4A3B" fill="#2C4A3B" fillOpacity={0.4} />
            </RadarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
