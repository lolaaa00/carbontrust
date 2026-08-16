import { Activity } from "lucide-react";
import { MonitoringRecordCard } from "./monitoring-record-card";
import { EmptyState } from "@/components/shared/empty-state";
import type { MonitoringRecord } from "@/types/monitoring";

export function MonitoringRecordList({ records }: { records: MonitoringRecord[] }) {
  if (records.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="No monitoring records yet"
        description="Ongoing monitoring observations for this project will appear here."
      />
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {records.length} monitoring record{records.length !== 1 ? "s" : ""}
      </p>
      <div className="grid gap-4 sm:grid-cols-2">
        {records.map((record) => (
          <MonitoringRecordCard key={record.record_id} record={record} />
        ))}
      </div>
    </div>
  );
}
