import { Badge } from "@/components/ui/badge";
import { EVIDENCE_TYPE_LABELS, EVIDENCE_TYPE_COLORS } from "@/lib/constants/evidence-types";

export function EvidenceTypeBadge({ type }: { type: string }) {
  const label = EVIDENCE_TYPE_LABELS[type] || type;
  const colorClass = EVIDENCE_TYPE_COLORS[type] || "";

  return (
    <Badge variant="outline" className={colorClass}>
      {label}
    </Badge>
  );
}
