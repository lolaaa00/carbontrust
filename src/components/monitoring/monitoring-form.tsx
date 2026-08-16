"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VALID_MONITORING_RISK_SIGNALS, RISK_SIGNAL_LABELS } from "@/lib/constants/monitoring";
import { monitoringFormSchema, type MonitoringFormData } from "@/lib/utils/validation";
import { generateSHA256 } from "@/lib/utils/hash";

interface MonitoringFormProps {
  onSubmit: (data: MonitoringFormData) => void;
  isSubmitting?: boolean;
}

export function MonitoringForm({ onSubmit, isSubmitting = false }: MonitoringFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<MonitoringFormData>({
    resolver: zodResolver(monitoringFormSchema),
  });

  const contentHash = watch("content_hash");

  const handleFileHash = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const hash = await generateSHA256(file);
    setValue("content_hash", hash);
    trigger("content_hash");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="period_label">Monitoring Period</Label>
        <Input id="period_label" placeholder="e.g. Q1 2026" {...register("period_label")} />
        {errors.period_label && <p className="text-sm text-destructive">{errors.period_label.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="observation_summary">Observation Summary</Label>
        <Textarea
          id="observation_summary"
          placeholder="What was observed during this monitoring period..."
          rows={4}
          {...register("observation_summary")}
        />
        {errors.observation_summary && (
          <p className="text-sm text-destructive">{errors.observation_summary.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="evidence_url">Evidence URL</Label>
        <Input id="evidence_url" type="url" placeholder="https://..." {...register("evidence_url")} />
        {errors.evidence_url && <p className="text-sm text-destructive">{errors.evidence_url.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="content_hash">Content Hash (optional)</Label>
        <div className="flex gap-2">
          <Input
            id="content_hash"
            placeholder="SHA-256 hash or IPFS CID"
            className="font-mono text-xs"
            {...register("content_hash")}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            title="Generate hash from file"
          >
            <Upload className="h-4 w-4" />
          </Button>
          <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileHash} />
        </div>
        {contentHash && (
          <p className="text-xs text-muted-foreground font-mono truncate">{contentHash}</p>
        )}
        <p className="text-xs text-muted-foreground">
          File never leaves your browser -- only the hash is stored.
        </p>
        {errors.content_hash && <p className="text-sm text-destructive">{errors.content_hash.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="risk_signal">Risk Signal</Label>
        <Select
          onValueChange={(value) => {
            setValue("risk_signal", value);
            trigger("risk_signal");
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select observed risk level" />
          </SelectTrigger>
          <SelectContent>
            {VALID_MONITORING_RISK_SIGNALS.map((signal) => (
              <SelectItem key={signal} value={signal}>
                {RISK_SIGNAL_LABELS[signal]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.risk_signal && <p className="text-sm text-destructive">{errors.risk_signal.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting Record...
          </>
        ) : (
          "Submit Monitoring Record"
        )}
      </Button>
    </form>
  );
}
