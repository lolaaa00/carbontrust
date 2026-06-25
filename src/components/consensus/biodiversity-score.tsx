export function BiodiversityScore({
  impact,
  confidence,
}: {
  impact: string;
  confidence: number;
}) {
  const colors: Record<string, string> = {
    positive: "text-green-600 dark:text-green-400",
    neutral: "text-gray-500",
    negative: "text-red-600 dark:text-red-400",
    uncertain: "text-amber-600 dark:text-amber-400",
  };

  return (
    <div className="space-y-1">
      <span className="text-xs text-muted-foreground">Biodiversity Impact</span>
      <p className={`text-sm font-semibold capitalize ${colors[impact] || ""}`}>{impact}</p>
      <p className="text-xs text-muted-foreground">Confidence: {confidence}%</p>
    </div>
  );
}
