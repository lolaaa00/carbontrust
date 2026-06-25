"use client";

import { useState, useEffect } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { ProjectList } from "@/components/project/project-list";
import { EmptyState } from "@/components/shared/empty-state";
import { PROJECT_TYPE_LABELS } from "@/lib/constants/project-types";
import { getAllProjects } from "@/lib/contract/reads";
import type { Project } from "@/types/project";

export default function ExplorePage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    async function load() {
      try {
        const all = await getAllProjects();
        setProjects(all);
      } catch {
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = projects.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === "all" || p.project_type === typeFilter;
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Explore Projects"
        description="Browse all environmental assessment projects on the network."
      />

      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Project Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(PROJECT_TYPE_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="created">Created</SelectItem>
            <SelectItem value="evidence_submitted">Evidence Submitted</SelectItem>
            <SelectItem value="review_requested">Under Review</SelectItem>
            <SelectItem value="assessed">Assessed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No Projects Found"
          description={
            projects.length === 0
              ? "No projects have been created yet. Be the first to submit an assessment case."
              : "No projects match your search criteria. Try adjusting your filters."
          }
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-muted-foreground">
            {filtered.length} project{filtered.length !== 1 ? "s" : ""} found
          </p>
          <ProjectList projects={filtered} />
        </>
      )}
    </div>
  );
}
