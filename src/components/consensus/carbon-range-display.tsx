import { formatCarbonTons } from "@/lib/utils/formatting";

interface CarbonRangeDisplayProps {
  low: number;
  high: number;
  likely: number;
}

export function CarbonRangeDisplay({ low, high, likely }: CarbonRangeDisplayProps) {
  const range = high - low;
  const likelyPosition = range > 0 ? ((likely - low) / range) * 100 : 50;

  return (
    <div className="space-y-3">
      <h4 className="text-xs font-medium text-muted-foreground">Carbon Estimate Range</h4>

      <div className="relative pt-4 pb-2">
        <div
          className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
          style={{ left: `${likelyPosition}%` }}
        >
          <span className="text-xs font-bold text-primary whitespace-nowrap">
            {formatCarbonTons(likely)}
          </span>
          <div className="w-0.5 h-2 bg-primary" />
        </div>

        <div className="h-3 rounded-full bg-gradient-to-r from-green-200 via-emerald-300 to-teal-400 dark:from-green-900 dark:via-emerald-800 dark:to-teal-700 relative">
          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-5 w-5 rounded-full border-2 border-primary bg-background shadow"
            style={{ left: `${likelyPosition}%` }}
          />
        </div>

        <div className="flex justify-between mt-1 text-xs text-muted-foreground">
          <span>{formatCarbonTons(low)}</span>
          <span>{formatCarbonTons(high)}</span>
        </div>
      </div>
    </div>
  );
}
