export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-muted ${className || "h-4 w-full"}`} />;
}
