import { Badge } from "@/components/ui/badge";
import { RISK_COLORS } from "@/lib/constants/risk-levels";

interface RiskIndicatorProps {
  level: string;
  label: string;
}

export function RiskIndicator({ level, label }: RiskIndicatorProps) {
  const colorClass = RISK_COLORS[level] || "";

  return (
    <div className="space-y-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <Badge variant="outline" className={colorClass}>
        {level.charAt(0).toUpperCase() + level.slice(1)}
      </Badge>
    </div>
  );
}
