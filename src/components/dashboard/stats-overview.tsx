import { FolderOpen, CheckCircle, Clock, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsOverviewProps {
  totalProjects: number;
  assessed: number;
  pendingReview: number;
  totalEvidence: number;
}

const stats = [
  { key: "totalProjects", label: "Total Projects", icon: FolderOpen, color: "text-blue-600 dark:text-blue-400" },
  { key: "assessed", label: "Assessed", icon: CheckCircle, color: "text-green-600 dark:text-green-400" },
  { key: "pendingReview", label: "Pending Review", icon: Clock, color: "text-amber-600 dark:text-amber-400" },
  { key: "totalEvidence", label: "Total Evidence", icon: FileText, color: "text-purple-600 dark:text-purple-400" },
] as const;

export function StatsOverview(props: StatsOverviewProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ key, label, icon: Icon, color }) => (
        <Card key={key}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-muted ${color}`}>
              <Icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold">{props[key].toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
