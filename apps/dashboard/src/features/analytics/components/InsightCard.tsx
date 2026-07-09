import { PERMISSION_CODES, type AiInsightType } from "@restaurant-pos/types";
import { Button, Card, CardHeader, CardTitle } from "@restaurant-pos/ui";
import { formatDateTime } from "@restaurant-pos/utils";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocketEvent } from "../../../hooks/useSocketEvent";
import { useAuthStore } from "../../../stores/auth.store";
import { useGenerateInsight, useLatestInsight } from "../hooks/useAiInsights";
import { AI_INSIGHT_TYPE_LABELS } from "../types/analytics.types";

export function InsightCard({ type }: { type: AiInsightType }) {
  const hasPermission = useAuthStore((state) => state.hasPermission);
  const canManage = hasPermission(PERMISSION_CODES.ANALYTICS_MANAGE);
  const { data: insight, isLoading } = useLatestInsight(type);
  const generate = useGenerateInsight();
  const [pendingJobId, setPendingJobId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  useSocketEvent<{ jobId: string; insight: { type: AiInsightType } }>("ai:insight.completed", (payload) => {
    if (payload.insight.type === type) {
      setPendingJobId(null);
      queryClient.invalidateQueries({ queryKey: ["analytics", "insights", type] });
    }
  });
  useSocketEvent<{ jobId: string; type: AiInsightType; message: string }>("ai:insight.failed", (payload) => {
    if (payload.type === type) setPendingJobId(null);
  });

  function handleGenerate() {
    generate.mutate(
      { type, force: true },
      {
        onSuccess: (result) => {
          if ("queued" in result) setPendingJobId(result.jobId);
        },
      },
    );
  }

  const isWaiting = generate.isPending || !!pendingJobId;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />
          {AI_INSIGHT_TYPE_LABELS[type]}
        </CardTitle>
      </CardHeader>
      <div className="flex flex-col gap-3">
        {isLoading ? (
          <p className="text-sm text-black/40">Memuat...</p>
        ) : insight ? (
          <>
            <p className="whitespace-pre-line text-sm text-black/80">{insight.content}</p>
            <p className="text-xs text-black/40">
              {insight.source === "GEMINI" ? "Gemini AI" : "Lokal"} — {formatDateTime(insight.createdAt)}
            </p>
          </>
        ) : (
          <p className="text-sm text-black/40">Belum ada insight untuk kategori ini.</p>
        )}

        {canManage && (
          <Button size="sm" variant="outline" onClick={handleGenerate} disabled={isWaiting} className="w-fit">
            {isWaiting ? (
              <>
                <Loader2 size={14} className="animate-spin" /> Menghasilkan...
              </>
            ) : (
              "Generate"
            )}
          </Button>
        )}
      </div>
    </Card>
  );
}
