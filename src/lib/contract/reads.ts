import { callRead } from "@/lib/contract/client";
import type { Project } from "@/types/project";
import type { Evidence } from "@/types/evidence";
import type { Assessment } from "@/types/assessment";
import type { MonitoringRecord } from "@/types/monitoring";

function parse<T>(result: unknown): T | null {
  if (typeof result === "string") {
    try {
      const parsed = JSON.parse(result);
      if (typeof parsed === "object" && parsed !== null && Object.keys(parsed).length > 0) {
        return parsed as T;
      }
      return null;
    } catch {
      return null;
    }
  }
  if (typeof result === "object" && result !== null && Object.keys(result as object).length > 0) {
    return result as T;
  }
  return null;
}

function parseList<T>(result: unknown): T[] {
  if (typeof result === "string") {
    try {
      const parsed = JSON.parse(result);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return Array.isArray(result) ? result : [];
}

export async function getProject(projectId: number): Promise<Project | null> {
  try {
    const result = await callRead("get_project", [projectId]);
    return parse<Project>(result);
  } catch {
    return null;
  }
}

export async function getProjectEvidence(projectId: number): Promise<Evidence[]> {
  try {
    const result = await callRead("get_project_evidence", [projectId]);
    return parseList<Evidence>(result);
  } catch {
    return [];
  }
}

export async function getProjectAssessment(projectId: number): Promise<Assessment | null> {
  try {
    const result = await callRead("get_project_assessment", [projectId]);
    return parse<Assessment>(result);
  } catch {
    return null;
  }
}

export async function getAssessmentHistory(projectId: number): Promise<Assessment[]> {
  try {
    const result = await callRead("get_assessment_history", [projectId]);
    return parseList<Assessment>(result);
  } catch {
    return [];
  }
}

export async function getProjectCount(): Promise<number> {
  try {
    const result = await callRead("get_project_count", []);
    return Number(result) || 0;
  } catch {
    return 0;
  }
}

export async function getProjectsByOwner(ownerAddress: string): Promise<number[]> {
  try {
    const result = await callRead("get_projects_by_owner", [ownerAddress]);
    return parseList<number>(result);
  } catch {
    return [];
  }
}

export async function getMonitoringRecords(projectId: number): Promise<MonitoringRecord[]> {
  try {
    const result = await callRead("get_monitoring_records", [projectId]);
    return parseList<MonitoringRecord>(result);
  } catch {
    return [];
  }
}

export async function getAllProjects(): Promise<Project[]> {
  const count = await getProjectCount();
  if (count === 0) return [];
  const projects: Project[] = [];
  for (let i = 1; i <= count; i++) {
    const project = await getProject(i);
    if (project) projects.push(project);
  }
  return projects;
}
