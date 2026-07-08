import { Card } from "@restaurant-pos/ui";
import type { ReactNode } from "react";

export function StatCard({ label, value, icon }: { label: string; value: string; icon?: ReactNode }) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <div className="text-xs text-black/50">{label}</div>
        <div className="mt-1 text-xl font-semibold">{value}</div>
      </div>
      {icon}
    </Card>
  );
}
