"use client";

import { cn } from "@/lib/utils";
import { getConfidenceLabel, getConfidenceColor, getConfidenceBarColor } from "@/lib/constants/scoring";

interface ConfidenceGaugeProps {
  score: number;
  size?: "sm" | "lg";
}

export function ConfidenceGauge({ score, size = "sm" }: ConfidenceGaugeProps) {
  const label = getConfidenceLabel(score);
  const textColor = getConfidenceColor(score);
  const barColor = getConfidenceBarColor(score);
  const isLarge = size === "lg";

  if (isLarge) {
    const radius = 70;
    const stroke = 10;
    const cx = 80;
    const cy = 80;
    const circumference = Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
      <div className="flex flex-col items-center gap-2">
        <svg width="160" height="100" viewBox="0 0 160 100" className="overflow-visible">
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-muted/30"
          />
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            strokeWidth={stroke}
            strokeLinecap="round"
            className={barColor.replace("bg-", "stroke-")}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 0.5s ease" }}
          />
          <text x={cx} y={cy - 10} textAnchor="middle" className={cn("text-2xl font-bold fill-current", textColor)}>
            {Math.round(score)}%
          </text>
        </svg>
        <span className={cn("text-sm font-semibold", textColor)}>{label} Confidence</span>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Confidence</span>
        <span className={cn("font-semibold", textColor)}>
          {Math.round(score)}% - {label}
        </span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", barColor)}
          style={{ width: `${Math.min(score, 100)}%` }}
        />
      </div>
    </div>
  );
}
