import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConfidenceGauge } from "./confidence-gauge";
import { CarbonRangeDisplay } from "./carbon-range-display";
import { RiskIndicator } from "./risk-indicator";
import { BiodiversityScore } from "./biodiversity-score";
import { ADDITIONALITY_COLORS, QUALITY_COLORS } from "@/lib/constants/risk-levels";
import { formatPercentage } from "@/lib/utils/formatting";
import type { Assessment } from "@/types/assessment";

export function ConsensusSummary({ assessment }: { assessment: Assessment }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assessment Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <ConfidenceGauge score={assessment.confidence_score} size="lg" />
        </div>

        <Separator />

        <CarbonRangeDisplay
          low={assessment.carbon_estimate_low}
          high={assessment.carbon_estimate_high}
          likely={assessment.carbon_estimate_likely}
        />

        <Separator />

        <div className="grid grid-cols-3 gap-4">
          <RiskIndicator level={assessment.environmental_risk} label="Environmental Risk" />
          <RiskIndicator level={assessment.fraud_risk} label="Fraud Risk" />
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Evidence Quality</span>
            <Badge variant="outline" className={QUALITY_COLORS[assessment.evidence_quality] || ""}>
              {assessment.evidence_quality.charAt(0).toUpperCase() + assessment.evidence_quality.slice(1)}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-3 gap-4">
          <BiodiversityScore
            impact={assessment.biodiversity_impact}
            confidence={assessment.biodiversity_confidence}
          />
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Permanence</span>
            <p className="text-sm font-semibold">{formatPercentage(assessment.permanence_confidence)}</p>
          </div>
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Additionality</span>
            <Badge variant="outline" className={ADDITIONALITY_COLORS[assessment.additionality] || ""}>
              {assessment.additionality.charAt(0).toUpperCase() + assessment.additionality.slice(1)}
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Recommended Action</h4>
          <p className="text-sm">{assessment.recommended_action}</p>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold">Reasoning</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">{assessment.reasoning}</p>
        </div>
      </CardContent>
    </Card>
  );
}
