import { ExternalLink } from "lucide-react";

export function ExplorerLink({
  hash,
  type = "tx",
  label,
}: {
  hash: string;
  type?: "tx" | "address" | "contract";
  label?: string;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_GENLAYER_EXPLORER_URL || "";
  const url = `${baseUrl}/${type}/${hash}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
    >
      {label || `${hash.slice(0, 8)}...${hash.slice(-6)}`}
      <ExternalLink className="h-3 w-3" />
    </a>
  );
}
