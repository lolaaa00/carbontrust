import { ExternalLink, Hash } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RISK_COLORS } from "@/lib/constants/risk-levels";
import { RISK_SIGNAL_LABELS } from "@/lib/constants/monitoring";
import { truncateAddress } from "@/lib/wallet/utils";
import type { MonitoringRecord } from "@/types/monitoring";

export function MonitoringRecordCard({ record }: { record: MonitoringRecord }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">{record.period_label}</CardTitle>
          <Badge variant="outline" className={RISK_COLORS[record.risk_signal] || ""}>
            {RISK_SIGNAL_LABELS[record.risk_signal] || record.risk_signal}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="text-muted-foreground line-clamp-3">{record.observation_summary}</p>

        {record.evidence_url && (
          <a
            href={record.evidence_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
          >
            View Evidence <ExternalLink className="h-3 w-3" />
          </a>
        )}

        {record.content_hash && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
            <Hash className="h-3 w-3 shrink-0" />
            <span className="font-mono truncate">{record.content_hash}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Submitted by {truncateAddress(record.submitter)}
      </CardFooter>
    </Card>
  );
}
