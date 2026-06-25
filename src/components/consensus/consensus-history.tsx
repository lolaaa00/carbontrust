import { ArrowUp, ArrowDown, Minus, BarChart3 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfidenceGauge } from "./confidence-gauge";
import { formatCarbonTons, formatTimestamp } from "@/lib/utils/formatting";
import { getConfidenceColor } from "@/lib/constants/scoring";
import type { Assessment } from "@/types/assessment";

function TrendArrow({ current, previous }: { current: number; previous: number }) {
  if (current > previous) return <ArrowUp className="h-3.5 w-3.5 text-green-500" />;
  if (current < previous) return <ArrowDown className="h-3.5 w-3.5 text-red-500" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
}

export function ConsensusHistory({ assessments }: { assessments: Assessment[] }) {
  if (assessments.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="No assessments yet"
        description="This project has not been assessed by the consensus network."
      />
    );
  }

  const sorted = [...assessments].sort(
    (a, b) => new Date(b.timestamp || "").getTime() - new Date(a.timestamp || "").getTime()
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative space-y-0">
          {sorted.map((assessment, index) => {
            const prev = sorted[index + 1];
            return (
              <div key={assessment.assessment_id} className="relative flex gap-4 pb-8 last:pb-0">
                {index < sorted.length - 1 && (
                  <div className="absolute left-[11px] top-6 h-full w-0.5 bg-border" />
                )}
                <div className="relative z-10 mt-1 h-6 w-6 shrink-0 rounded-full border-2 border-primary bg-background flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                </div>

                <div className="flex-1 space-y-2 rounded-lg border p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">
                      {assessment.timestamp ? formatTimestamp(assessment.timestamp) : `Assessment #${assessment.assessment_id}`}
                    </span>
                    <Badge variant="outline">#{assessment.assessment_id}</Badge>
                  </div>

                  <ConfidenceGauge score={assessment.confidence_score} size="sm" />

                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Carbon (likely):</span>
                      <span className="font-medium">{formatCarbonTons(assessment.carbon_estimate_likely)}</span>
                      {prev && <TrendArrow current={assessment.carbon_estimate_likely} previous={prev.carbon_estimate_likely} />}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-muted-foreground">Confidence:</span>
                      <span className={`font-medium ${getConfidenceColor(assessment.confidence_score)}`}>
                        {Math.round(assessment.confidence_score)}%
                      </span>
                      {prev && <TrendArrow current={assessment.confidence_score} previous={prev.confidence_score} />}
                    </div>
                    <div>
                      <span className="text-muted-foreground">Env Risk: </span>
                      <span className="font-medium capitalize">{assessment.environmental_risk}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Fraud Risk: </span>
                      <span className="font-medium capitalize">{assessment.fraud_risk}</span>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">{assessment.reasoning}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
