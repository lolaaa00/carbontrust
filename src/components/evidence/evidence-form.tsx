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
import { VALID_EVIDENCE_TYPES, EVIDENCE_TYPE_LABELS } from "@/lib/constants/evidence-types";
import { evidenceFormSchema, type EvidenceFormData } from "@/lib/utils/validation";
import { generateSHA256 } from "@/lib/utils/hash";

interface EvidenceFormProps {
  onSubmit: (data: EvidenceFormData) => void;
  isSubmitting?: boolean;
}

export function EvidenceForm({ onSubmit, isSubmitting = false }: EvidenceFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<EvidenceFormData>({
    resolver: zodResolver(evidenceFormSchema),
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
        <Label htmlFor="evidence_type">Evidence Type</Label>
        <Select
          onValueChange={(value) => {
            setValue("evidence_type", value);
            trigger("evidence_type");
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select evidence type" />
          </SelectTrigger>
          <SelectContent>
            {VALID_EVIDENCE_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {EVIDENCE_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.evidence_type && <p className="text-sm text-destructive">{errors.evidence_type.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" placeholder="Evidence title" {...register("title")} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="url">URL</Label>
        <Input id="url" type="url" placeholder="https://..." {...register("url")} />
        {errors.url && <p className="text-sm text-destructive">{errors.url.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Describe the evidence..." rows={4} {...register("description")} />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
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
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileHash}
          />
        </div>
        {contentHash && (
          <p className="text-xs text-muted-foreground font-mono truncate">
            {contentHash}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          File never leaves your browser -- only the hash is stored.
        </p>
        {errors.content_hash && <p className="text-sm text-destructive">{errors.content_hash.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="source_name">Source Name</Label>
        <Input id="source_name" placeholder="e.g. NASA Landsat" {...register("source_name")} />
        {errors.source_name && <p className="text-sm text-destructive">{errors.source_name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="date_produced">Date Produced</Label>
        <Input id="date_produced" type="date" {...register("date_produced")} />
        {errors.date_produced && <p className="text-sm text-destructive">{errors.date_produced.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting Evidence...
          </>
        ) : (
          "Submit Evidence"
        )}
      </Button>
    </form>
  );
}
