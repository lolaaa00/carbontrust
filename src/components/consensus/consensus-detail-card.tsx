import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConfidenceGauge } from "./confidence-gauge";
import { CarbonRangeDisplay } from "./carbon-range-display";
import { RiskIndicator } from "./risk-indicator";
import { BiodiversityScore } from "./biodiversity-score";
import { ADDITIONALITY_COLORS, QUALITY_COLORS } from "@/lib/constants/risk-levels";
import { formatPercentage, formatTimestamp } from "@/lib/utils/formatting";
import type { Assessment, SourceFinding } from "@/types/assessment";

export function ConsensusDetailCard({ assessment }: { assessment: Assessment }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Assessment #{assessment.assessment_id}</CardTitle>
          <span className="text-xs text-muted-foreground">
            {assessment.timestamp ? formatTimestamp(assessment.timestamp) : ""}
          </span>
        </div>
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

        <div>
          <h4 className="text-sm font-semibold mb-3">Risk Assessment</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <RiskIndicator level={assessment.environmental_risk} label="Environmental Risk" />
            <RiskIndicator level={assessment.fraud_risk} label="Fraud Risk" />
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Evidence Quality</span>
              <Badge variant="outline" className={QUALITY_COLORS[assessment.evidence_quality] || ""}>
                {assessment.evidence_quality.charAt(0).toUpperCase() + assessment.evidence_quality.slice(1)}
              </Badge>
            </div>
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Additionality</span>
              <Badge variant="outline" className={ADDITIONALITY_COLORS[assessment.additionality] || ""}>
                {assessment.additionality.charAt(0).toUpperCase() + assessment.additionality.slice(1)}
              </Badge>
            </div>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-2 gap-4">
          <BiodiversityScore
            impact={assessment.biodiversity_impact}
            confidence={assessment.biodiversity_confidence}
          />
          <div className="space-y-1">
            <span className="text-xs text-muted-foreground">Permanence Confidence</span>
            <p className="text-sm font-semibold">{formatPercentage(assessment.permanence_confidence)}</p>
          </div>
        </div>

        <Separator />

        {assessment.source_findings && assessment.source_findings.length > 0 && (
          <>
            <Separator />
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Source Assurance</h4>
              <div className="space-y-2">
                {assessment.source_findings.map((f) => (
                  <SourceFindingRow key={f.evidence_id} finding={f} />
                ))}
              </div>
            </div>
          </>
        )}

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

const FETCH_STATUS_LABELS: Record<string, { label: string; className: string }> = {
  fetched: { label: "200 OK", className: "text-green-600 dark:text-green-400" },
  failed: { label: "Failed", className: "text-red-600 dark:text-red-400" },
  binary: { label: "Binary", className: "text-yellow-600 dark:text-yellow-400" },
};

const HASH_LABELS: Record<string, { label: string; className: string }> = {
  match: { label: "Hash verified", className: "text-green-600 dark:text-green-400" },
  mismatch: { label: "Hash mismatch", className: "text-red-600 dark:text-red-400" },
  not_provided: { label: "No hash", className: "text-muted-foreground" },
};

const ALIGNMENT_COLORS: Record<string, string> = {
  supports: "text-green-600 dark:text-green-400",
  contradicts: "text-red-600 dark:text-red-400",
  mixed: "text-yellow-600 dark:text-yellow-400",
  unclear: "text-muted-foreground",
};

function SourceFindingRow({ finding }: { finding: SourceFinding }) {
  const fetchInfo = FETCH_STATUS_LABELS[finding.fetch_status] ?? {
    label: finding.fetch_status,
    className: "text-muted-foreground",
  };
  const hashInfo = HASH_LABELS[finding.hash_match ?? "not_provided"] ?? HASH_LABELS.not_provided;
  const alignmentColor = ALIGNMENT_COLORS[finding.source_alignment] ?? "text-muted-foreground";

  return (
    <div className="rounded-md border px-3 py-2 text-xs space-y-1">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-medium">Evidence #{finding.evidence_id}</span>
        <span className={fetchInfo.className}>{fetchInfo.label}</span>
        {finding.http_status && finding.fetch_status !== "fetched" && (
          <span className="text-muted-foreground">HTTP {finding.http_status}</span>
        )}
        {finding.fetched_domain && (
          <span className="text-muted-foreground font-mono">{finding.fetched_domain}</span>
        )}
        <span className={hashInfo.className}>{hashInfo.label}</span>
        <span className={alignmentColor}>{finding.source_alignment}</span>
        <Badge variant="outline" className="text-xs py-0">
          {finding.credibility}
        </Badge>
      </div>
      {finding.key_observation && (
        <p className="text-muted-foreground">{finding.key_observation}</p>
      )}
    </div>
  );
}
