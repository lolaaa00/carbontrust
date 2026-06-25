import { ExternalLink, Hash } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { EvidenceTypeBadge } from "./evidence-type-badge";
import { formatDate } from "@/lib/utils/formatting";
import { truncateAddress } from "@/lib/wallet/utils";
import type { Evidence } from "@/types/evidence";

export function EvidenceCard({ evidence }: { evidence: Evidence }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base line-clamp-2">{evidence.title}</CardTitle>
          <EvidenceTypeBadge type={evidence.evidence_type} />
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="text-muted-foreground line-clamp-3">{evidence.description}</p>

        {evidence.url && (
          <a
            href={evidence.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline text-xs"
          >
            View Source <ExternalLink className="h-3 w-3" />
          </a>
        )}

        <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-muted-foreground">
          <div>
            <span className="font-medium">Source:</span> {evidence.source_name}
          </div>
          <div>
            <span className="font-medium">Date:</span> {formatDate(evidence.date_produced)}
          </div>
        </div>

        {evidence.content_hash && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
            <Hash className="h-3 w-3 shrink-0" />
            <span className="font-mono truncate">{evidence.content_hash}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        Submitted by {truncateAddress(evidence.submitter)}
      </CardFooter>
    </Card>
  );
}
