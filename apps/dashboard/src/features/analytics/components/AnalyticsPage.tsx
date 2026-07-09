import { InsightCard } from "./InsightCard";
import { AI_INSIGHT_TYPES_LIST } from "../types/analytics.types";

export function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">AI Analytics</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {AI_INSIGHT_TYPES_LIST.map((type) => (
          <InsightCard key={type} type={type} />
        ))}
      </div>
    </div>
  );
}
