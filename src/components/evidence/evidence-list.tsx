"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import { EvidenceCard } from "./evidence-card";
import { EmptyState } from "@/components/shared/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VALID_EVIDENCE_TYPES, EVIDENCE_TYPE_LABELS } from "@/lib/constants/evidence-types";
import type { Evidence } from "@/types/evidence";

export function EvidenceList({ evidence }: { evidence: Evidence[] }) {
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all"
    ? evidence
    : evidence.filter((e) => e.evidence_type === filter);

  if (evidence.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No evidence submitted"
        description="No evidence has been submitted for this project yet."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {filtered.length} piece{filtered.length !== 1 ? "s" : ""} of evidence
        </p>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {VALID_EVIDENCE_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {EVIDENCE_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((item) => (
          <EvidenceCard key={item.evidence_id} evidence={item} />
        ))}
      </div>

      {filtered.length === 0 && evidence.length > 0 && (
        <p className="text-center text-sm text-muted-foreground py-8">
          No evidence matches the selected filter.
        </p>
      )}
    </div>
  );
}
