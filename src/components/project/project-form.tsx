"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { VALID_PROJECT_TYPES, PROJECT_TYPE_LABELS } from "@/lib/constants/project-types";
import { projectFormSchema, type ProjectFormData } from "@/lib/utils/validation";

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
  isSubmitting?: boolean;
}

export function ProjectForm({ onSubmit, isSubmitting = false }: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectFormSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Project Title</Label>
        <Input id="title" placeholder="e.g. Amazon Reforestation Initiative" {...register("title")} />
        {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="project_type">Project Type</Label>
        <Select
          onValueChange={(value) => {
            setValue("project_type", value);
            trigger("project_type");
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a project type" />
          </SelectTrigger>
          <SelectContent>
            {VALID_PROJECT_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {PROJECT_TYPE_LABELS[type] || type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.project_type && <p className="text-sm text-destructive">{errors.project_type.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input id="location" placeholder="e.g. Para State, Brazil" {...register("location")} />
        {errors.location && <p className="text-sm text-destructive">{errors.location.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="project_owner_name">Project Owner Name</Label>
        <Input id="project_owner_name" placeholder="Organization or individual name" {...register("project_owner_name")} />
        {errors.project_owner_name && <p className="text-sm text-destructive">{errors.project_owner_name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="assessment_objective">Assessment Objective</Label>
        <Textarea
          id="assessment_objective"
          placeholder="Describe the goal of the carbon assessment..."
          rows={3}
          {...register("assessment_objective")}
        />
        {errors.assessment_objective && <p className="text-sm text-destructive">{errors.assessment_objective.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="claimed_carbon_impact">Claimed Carbon Impact</Label>
        <Textarea
          id="claimed_carbon_impact"
          placeholder="Describe the expected carbon impact..."
          rows={3}
          {...register("claimed_carbon_impact")}
        />
        {errors.claimed_carbon_impact && <p className="text-sm text-destructive">{errors.claimed_carbon_impact.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="claimed_biodiversity_impact">Claimed Biodiversity Impact</Label>
        <Textarea
          id="claimed_biodiversity_impact"
          placeholder="Describe the expected biodiversity impact..."
          rows={3}
          {...register("claimed_biodiversity_impact")}
        />
        {errors.claimed_biodiversity_impact && <p className="text-sm text-destructive">{errors.claimed_biodiversity_impact.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="monitoring_period">Monitoring Period</Label>
        <Input id="monitoring_period" placeholder="e.g. 2024-2034 (10 years)" {...register("monitoring_period")} />
        {errors.monitoring_period && <p className="text-sm text-destructive">{errors.monitoring_period.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="evidence_summary">Evidence Summary</Label>
        <Textarea
          id="evidence_summary"
          placeholder="Summarize the evidence supporting this project..."
          rows={3}
          {...register("evidence_summary")}
        />
        {errors.evidence_summary && <p className="text-sm text-destructive">{errors.evidence_summary.message}</p>}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Project...
          </>
        ) : (
          "Create Project"
        )}
      </Button>
    </form>
  );
}
