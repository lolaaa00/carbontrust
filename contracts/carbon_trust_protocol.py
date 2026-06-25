# v0.2.18
# { "Depends": "py-genlayer:1jb45aa8ynh2a9c9xn3b7qqh8sm5q93hwfp7jqmwsfhh8jpz09h6" }

from genlayer import *
from dataclasses import dataclass
import json


VALID_PROJECT_TYPES = [
    "reforestation",
    "conservation",
    "renewable_energy",
    "blue_carbon",
    "soil_carbon",
    "avoided_deforestation",
    "methane_reduction",
    "sustainable_agriculture",
    "wetland_restoration",
    "urban_greening",
    "other",
]

VALID_EVIDENCE_TYPES = [
    "satellite_imagery",
    "drone_imagery",
    "environmental_report",
    "iot_sensor_data",
    "government_permit",
    "land_use_record",
    "biodiversity_survey",
    "community_observation",
    "carbon_methodology",
    "third_party_audit",
]

VALID_MONITORING_RISK_SIGNALS = [
    "none",
    "low",
    "medium",
    "high",
    "critical",
]

MAX_EVIDENCE_PER_PROJECT = 50
MAX_MONITORING_RECORDS_PER_PROJECT = 50
MAX_FETCH_PER_REVIEW = 12

MAX_TITLE_LENGTH = 200
MAX_FIELD_LENGTH = 1000
MAX_URL_LENGTH = 2000
MAX_HASH_LENGTH = 128
MAX_REASONING_LENGTH = 1500
MAX_RECOMMENDED_ACTION_LENGTH = 600
MAX_FETCH_CHARS_PER_EVIDENCE = 3500
MAX_SOURCE_FINDINGS = 12


class CarbonTrustProtocol(gl.Contract):
    project_count: u256
    projects: TreeMap[u256, str]
    evidence: TreeMap[u256, str]
    assessments: TreeMap[u256, str]
    monitoring_records: TreeMap[u256, str]
    owner_projects: TreeMap[str, str]

    def __init__(self):
        self.project_count = u256(0)

    # ─────────────────────────────────────────────────────────────────────
    # Write Methods
    # ─────────────────────────────────────────────────────────────────────

    @gl.public.write
    def create_project(
        self,
        title: str,
        project_type: str,
        location: str,
        project_owner_name: str,
        assessment_objective: str,
        claimed_carbon_impact: str,
        claimed_biodiversity_impact: str,
        monitoring_period: str,
        evidence_summary: str,
    ) -> u256:
        title = self._clean(title, MAX_TITLE_LENGTH)
        project_type = self._clean(project_type, 80)
        location = self._clean(location, MAX_FIELD_LENGTH)
        project_owner_name = self._clean(project_owner_name, MAX_FIELD_LENGTH)
        assessment_objective = self._clean(assessment_objective, MAX_FIELD_LENGTH)
        claimed_carbon_impact = self._clean(claimed_carbon_impact, MAX_FIELD_LENGTH)
        claimed_biodiversity_impact = self._clean(claimed_biodiversity_impact, MAX_FIELD_LENGTH)
        monitoring_period = self._clean(monitoring_period, MAX_FIELD_LENGTH)
        evidence_summary = self._clean(evidence_summary, MAX_FIELD_LENGTH)

        if not title:
            raise gl.vm.UserError("Title is required")
        if project_type not in VALID_PROJECT_TYPES:
            raise gl.vm.UserError("Invalid project type")
        if not location:
            raise gl.vm.UserError("Location is required")
        if not project_owner_name:
            raise gl.vm.UserError("Project owner name is required")
        if not assessment_objective:
            raise gl.vm.UserError("Assessment objective is required")
        if not claimed_carbon_impact:
            raise gl.vm.UserError("Claimed carbon impact is required")
        if not claimed_biodiversity_impact:
            raise gl.vm.UserError("Claimed biodiversity impact is required")
        if not monitoring_period:
            raise gl.vm.UserError("Monitoring period is required")
        if not evidence_summary:
            raise gl.vm.UserError("Evidence summary is required")

        self.project_count = u256(int(self.project_count) + 1)
        project_id = int(self.project_count)
        sender = str(gl.message.sender_address)

        project = {
            "id": project_id,
            "owner": sender,
            "title": title,
            "project_type": project_type,
            "location": location,
            "project_owner_name": project_owner_name,
            "assessment_objective": assessment_objective,
            "claimed_carbon_impact": claimed_carbon_impact,
            "claimed_biodiversity_impact": claimed_biodiversity_impact,
            "monitoring_period": monitoring_period,
            "evidence_summary": evidence_summary,
            "status": "created",
            "evidence_count": 0,
            "assessment_count": 0,
            "monitoring_record_count": 0,
            "latest_assessment_id": -1,
            "created_sequence": project_id,
        }

        self.projects[u256(project_id)] = self._json(project)
        self.evidence[u256(project_id)] = self._json([])
        self.assessments[u256(project_id)] = self._json([])
        self.monitoring_records[u256(project_id)] = self._json([])

        existing = self._get_owner_projects(sender)
        existing.append(project_id)
        self.owner_projects[sender] = self._json(existing)

        return u256(project_id)

    @gl.public.write
    def add_evidence(
        self,
        project_id: u256,
        evidence_type: str,
        title: str,
        url: str,
        description: str,
        content_hash: str,
        source_name: str,
        date_produced: str,
    ) -> u256:
        pid = int(project_id)
        project = self._require_project(pid)

        sender = str(gl.message.sender_address)
        if project["owner"] != sender:
            raise gl.vm.UserError("Only the project owner can add evidence")

        if project["status"] == "review_requested":
            raise gl.vm.UserError("Cannot add evidence while review is in progress")

        evidence_type = self._clean(evidence_type, 80)
        title = self._clean(title, MAX_TITLE_LENGTH)
        url = self._clean(url, MAX_URL_LENGTH)
        description = self._clean(description, MAX_FIELD_LENGTH)
        content_hash = self._clean(content_hash, MAX_HASH_LENGTH)
        source_name = self._clean(source_name, MAX_FIELD_LENGTH)
        date_produced = self._clean(date_produced, 40)

        if evidence_type not in VALID_EVIDENCE_TYPES:
            raise gl.vm.UserError("Invalid evidence type")
        if not title:
            raise gl.vm.UserError("Evidence title is required")
        if not url:
            raise gl.vm.UserError("Evidence URL is required")
        if not self._is_fetchable_url(url):
            raise gl.vm.UserError("Evidence URL must be a public http(s) URL so validators can fetch it")
        if not description:
            raise gl.vm.UserError("Evidence description is required")
        if not source_name:
            raise gl.vm.UserError("Source name is required")
        if not date_produced:
            raise gl.vm.UserError("Date produced is required")

        evidence_list = self._get_evidence_list(pid)
        if len(evidence_list) >= MAX_EVIDENCE_PER_PROJECT:
            raise gl.vm.UserError("Maximum evidence limit reached")

        evidence_id = len(evidence_list)

        evidence_record = {
            "evidence_id": evidence_id,
            "submitter": sender,
            "evidence_type": evidence_type,
            "title": title,
            "url": url,
            "description": description,
            "content_hash": content_hash,
            "source_name": source_name,
            "date_produced": date_produced,
            "review_priority": evidence_id,
        }

        evidence_list.append(evidence_record)
        self.evidence[u256(pid)] = self._json(evidence_list)

        project["evidence_count"] = len(evidence_list)
        if project["status"] in ("created", "assessed"):
            project["status"] = "evidence_submitted"

        self.projects[u256(pid)] = self._json(project)
        return u256(evidence_id)

    @gl.public.write
    def add_monitoring_record(
        self,
        project_id: u256,
        period_label: str,
        observation_summary: str,
        evidence_url: str,
        content_hash: str,
        risk_signal: str,
    ) -> u256:
        pid = int(project_id)
        project = self._require_project(pid)

        sender = str(gl.message.sender_address)
        if project["owner"] != sender:
            raise gl.vm.UserError("Only the project owner can add monitoring records")

        period_label = self._clean(period_label, 120)
        observation_summary = self._clean(observation_summary, MAX_FIELD_LENGTH)
        evidence_url = self._clean(evidence_url, MAX_URL_LENGTH)
        content_hash = self._clean(content_hash, MAX_HASH_LENGTH)
        risk_signal = self._clean(risk_signal, 40)

        if not period_label:
            raise gl.vm.UserError("Monitoring period label is required")
        if not observation_summary:
            raise gl.vm.UserError("Observation summary is required")
        if not evidence_url:
            raise gl.vm.UserError("Monitoring evidence URL is required")
        if not self._is_fetchable_url(evidence_url):
            raise gl.vm.UserError("Monitoring evidence URL must be a public http(s) URL")
        if risk_signal not in VALID_MONITORING_RISK_SIGNALS:
            raise gl.vm.UserError("Invalid monitoring risk signal")

        records = self._get_monitoring_records(pid)
        if len(records) >= MAX_MONITORING_RECORDS_PER_PROJECT:
            raise gl.vm.UserError("Maximum monitoring record limit reached")

        record_id = len(records)
        record = {
            "record_id": record_id,
            "submitter": sender,
            "period_label": period_label,
            "observation_summary": observation_summary,
            "evidence_url": evidence_url,
            "content_hash": content_hash,
            "risk_signal": risk_signal,
        }

        records.append(record)
        self.monitoring_records[u256(pid)] = self._json(records)

        project["monitoring_record_count"] = len(records)
        self.projects[u256(pid)] = self._json(project)

        return u256(record_id)

    @gl.public.write
    def request_review(self, project_id: u256) -> str:
        pid = int(project_id)
        project = self._require_project(pid)

        sender = str(gl.message.sender_address)
        if project["owner"] != sender:
            raise gl.vm.UserError("Only the project owner can request review")

        if project["status"] not in ("evidence_submitted", "assessed"):
            raise gl.vm.UserError("Project must have evidence submitted before review")

        if int(project["evidence_count"]) < 1:
            raise gl.vm.UserError("At least one evidence item is required")

        project["status"] = "review_requested"
        self.projects[u256(pid)] = self._json(project)

        evidence_list = self._get_evidence_list(pid)
        monitoring_list = self._get_monitoring_records(pid)

        assessment = self._evaluate_environmental_evidence(project, evidence_list, monitoring_list)

        assessment_list = self._get_assessment_list(pid)
        assessment_id = len(assessment_list)

        assessment["assessment_id"] = assessment_id
        assessment["project_id"] = pid
        assessment["reviewed_evidence_count"] = len(evidence_list)
        assessment["fetched_evidence_limit"] = min(len(evidence_list), MAX_FETCH_PER_REVIEW)
        assessment["monitoring_record_count"] = len(monitoring_list)

        assessment_list.append(assessment)
        self.assessments[u256(pid)] = self._json(assessment_list)

        project["assessment_count"] = len(assessment_list)
        project["latest_assessment_id"] = assessment_id
        project["status"] = "assessed"
        self.projects[u256(pid)] = self._json(project)

        return self._json(assessment)

    # ─────────────────────────────────────────────────────────────────────
    # Read Methods
    # ─────────────────────────────────────────────────────────────────────

    @gl.public.view
    def get_project(self, project_id: u256) -> str:
        project = self._get_project(int(project_id))
        if project is None:
            return self._json({})
        return self._json(project)

    @gl.public.view
    def get_project_evidence(self, project_id: u256) -> str:
        return self.evidence.get(project_id, "[]")

    @gl.public.view
    def get_project_assessment(self, project_id: u256) -> str:
        assessment_list = self._get_assessment_list(int(project_id))
        if not assessment_list:
            return self._json({})
        return self._json(assessment_list[-1])

    @gl.public.view
    def get_assessment_history(self, project_id: u256) -> str:
        return self.assessments.get(project_id, "[]")

    @gl.public.view
    def get_monitoring_records(self, project_id: u256) -> str:
        return self.monitoring_records.get(project_id, "[]")

    @gl.public.view
    def get_project_count(self) -> u256:
        return self.project_count

    @gl.public.view
    def get_projects_by_owner(self, owner_address: str) -> str:
        return self._json(self._get_owner_projects(owner_address))

    # ─────────────────────────────────────────────────────────────────────
    # Non-deterministic Environmental Review
    # ─────────────────────────────────────────────────────────────────────

    def _evaluate_environmental_evidence(
        self,
        project: dict,
        evidence_list: list,
        monitoring_list: list,
    ) -> dict:
        metadata_text = self._build_evidence_metadata_text(evidence_list)
        monitoring_text = self._build_monitoring_text(monitoring_list)

        def evaluate():
            fetched_items = []

            fetch_limit = min(len(evidence_list), MAX_FETCH_PER_REVIEW)
            for i in range(fetch_limit):
                ev = evidence_list[i]
                fetched = self._fetch_public_evidence(ev["url"])
                fetched_items.append({
                    "evidence_id": ev["evidence_id"],
                    "evidence_type": ev["evidence_type"],
                    "title": ev["title"],
                    "source_name": ev["source_name"],
                    "url": ev["url"],
                    "fetch_status": fetched["fetch_status"],
                    "http_status": fetched["http_status"],
                    "content_excerpt": fetched["content_excerpt"],
                })

            fetched_text = self._build_fetched_evidence_text(fetched_items)

            prompt = f"""
You are an expert environmental scientist, carbon credit auditor, biodiversity analyst, and environmental fraud reviewer.

You are evaluating a carbon impact project using:
1. Project claims.
2. Evidence metadata submitted on-chain.
3. Public evidence content fetched directly from source URLs.
4. Monitoring records where available.

Your role is not to force certainty. Preserve uncertainty where evidence is weak, conflicting, incomplete, outdated, or not fetchable.

PROJECT DETAILS
Title: {project["title"]}
Project Type: {project["project_type"]}
Location: {project["location"]}
Project Owner Name: {project["project_owner_name"]}
Assessment Objective: {project["assessment_objective"]}
Claimed Carbon Impact: {project["claimed_carbon_impact"]}
Claimed Biodiversity Impact: {project["claimed_biodiversity_impact"]}
Monitoring Period: {project["monitoring_period"]}
Evidence Summary: {project["evidence_summary"]}

SUBMITTED EVIDENCE METADATA
{metadata_text}

FETCHED PUBLIC EVIDENCE CONTENT
{fetched_text}

MONITORING RECORDS
{monitoring_text}

EVALUATION TASK
Assess the project across:
- Carbon removal or avoidance credibility.
- Carbon estimate range in tons CO2e.
- Additionality.
- Permanence risk.
- Environmental risk.
- Evidence quality.
- Fraud risk.
- Biodiversity impact.
- Biodiversity confidence.
- Source alignment between claims and evidence.
- Missing evidence.
- Recommended next action.

SCORING RULES
confidence_score:
- 90-100: multiple independent high-quality sources strongly support the claim.
- 75-89: solid support with minor gaps.
- 50-74: mixed or incomplete support.
- 25-49: weak support.
- 0-24: insufficient or mostly unsupported.

additionality:
- likely
- unlikely
- uncertain

environmental_risk:
- low
- medium
- high
- critical

evidence_quality:
- high
- moderate
- low
- insufficient

fraud_risk:
- low
- medium
- high

biodiversity_impact:
- positive
- neutral
- negative
- uncertain

verdict:
- high_confidence
- moderate_confidence
- low_confidence
- insufficient_evidence
- high_fraud_risk

IMPORTANT RULES
- If evidence URLs are mostly unfetchable, reduce evidence quality and confidence.
- If claims are large but evidence is vague, use conservative carbon estimates.
- If evidence conflicts, preserve the uncertainty in reasoning.
- Do not invent facts that are not in the submitted metadata or fetched evidence.
- Keep source_findings short and tied to evidence IDs.
- Return only valid JSON.

OUTPUT JSON SCHEMA
{{
  "verdict": "<high_confidence|moderate_confidence|low_confidence|insufficient_evidence|high_fraud_risk>",
  "carbon_estimate_low": <int>,
  "carbon_estimate_high": <int>,
  "carbon_estimate_likely": <int>,
  "confidence_score": <int>,
  "additionality": "<likely|unlikely|uncertain>",
  "environmental_risk": "<low|medium|high|critical>",
  "evidence_quality": "<high|moderate|low|insufficient>",
  "fraud_risk": "<low|medium|high>",
  "permanence_confidence": <int>,
  "biodiversity_impact": "<positive|neutral|negative|uncertain>",
  "biodiversity_confidence": <int>,
  "source_findings": [
    {{
      "evidence_id": <int>,
      "fetch_status": "<fetched|failed>",
      "source_alignment": "<supports|contradicts|mixed|unclear>",
      "credibility": "<high|moderate|low|unknown>",
      "key_observation": "<short observation>"
    }}
  ],
  "missing_evidence": ["<short missing evidence item>"],
  "recommended_action": "<one clear sentence>",
  "reasoning": "<2-4 sentence overall reasoning>"
}}
"""
            return gl.nondet.exec_prompt(prompt, response_format="json")

        principle = """
Two CarbonTrust assessments are equivalent if they reach the same directional environmental judgment.

Mandatory equivalence rules:
1. verdict must match exactly, except moderate_confidence and low_confidence may be considered equivalent when confidence_score differs by 15 or fewer points.
2. carbon_estimate_likely must be within 35 percent when both estimates are above zero.
3. confidence_score must be within 15 points.
4. additionality must match, unless one side is uncertain.
5. environmental_risk may differ by at most one severity level.
6. evidence_quality may differ by at most one level.
7. fraud_risk may differ by at most one level.
8. permanence_confidence must be within 20 points.
9. biodiversity_impact must match, unless one side is uncertain.
10. source_findings may use different wording, but must agree directionally on whether key evidence supports, contradicts, is mixed, or is unclear.
11. reasoning may differ in wording, but must not contradict the core verdict, risk, confidence, additionality, or fraud conclusions.
"""

        raw_result = gl.eq_principle.prompt_comparative(
            evaluate,
            principle=principle,
        )

        return self._parse_assessment(raw_result)

    def _fetch_public_evidence(self, url: str) -> dict:
        try:
            response = gl.nondet.web.get(url)
            status = self._safe_status(response)
            body = self._safe_body(response)
            excerpt = self._clean(body, MAX_FETCH_CHARS_PER_EVIDENCE)

            if not excerpt:
                return {
                    "fetch_status": "failed",
                    "http_status": status,
                    "content_excerpt": "No readable body was returned from this URL.",
                }

            return {
                "fetch_status": "fetched",
                "http_status": status,
                "content_excerpt": excerpt,
            }
        except Exception as exc:
            return {
                "fetch_status": "failed",
                "http_status": "error",
                "content_excerpt": self._clean(str(exc), 500),
            }

    # ─────────────────────────────────────────────────────────────────────
    # Internal Read Helpers
    # ─────────────────────────────────────────────────────────────────────

    def _get_project(self, pid: int):
        raw = self.projects.get(u256(pid), None)
        if raw is None:
            return None
        return json.loads(raw)

    def _require_project(self, pid: int) -> dict:
        project = self._get_project(pid)
        if project is None:
            raise gl.vm.UserError("Project does not exist")
        return project

    def _get_evidence_list(self, pid: int) -> list:
        raw = self.evidence.get(u256(pid), "[]")
        return json.loads(raw)

    def _get_assessment_list(self, pid: int) -> list:
        raw = self.assessments.get(u256(pid), "[]")
        return json.loads(raw)

    def _get_monitoring_records(self, pid: int) -> list:
        raw = self.monitoring_records.get(u256(pid), "[]")
        return json.loads(raw)

    def _get_owner_projects(self, owner: str) -> list:
        raw = self.owner_projects.get(owner, "[]")
        return json.loads(raw)

    # ─────────────────────────────────────────────────────────────────────
    # Formatting Helpers
    # ─────────────────────────────────────────────────────────────────────

    def _build_evidence_metadata_text(self, evidence_list: list) -> str:
        if not evidence_list:
            return "No evidence metadata submitted."

        lines = []
        for ev in evidence_list:
            lines.append(
                f"""
Evidence ID: {ev.get("evidence_id")}
Type: {ev.get("evidence_type")}
Title: {ev.get("title")}
URL: {ev.get("url")}
Description: {ev.get("description")}
Source Name: {ev.get("source_name")}
Date Produced: {ev.get("date_produced")}
Content Hash: {ev.get("content_hash") or "not provided"}
"""
            )

        return "\n---\n".join(lines)

    def _build_fetched_evidence_text(self, fetched_items: list) -> str:
        if not fetched_items:
            return "No evidence content was fetched."

        lines = []
        for item in fetched_items:
            lines.append(
                f"""
Evidence ID: {item.get("evidence_id")}
Type: {item.get("evidence_type")}
Title: {item.get("title")}
Source Name: {item.get("source_name")}
URL: {item.get("url")}
Fetch Status: {item.get("fetch_status")}
HTTP Status: {item.get("http_status")}
Fetched Content Excerpt:
{item.get("content_excerpt")}
"""
            )

        return "\n---\n".join(lines)

    def _build_monitoring_text(self, monitoring_list: list) -> str:
        if not monitoring_list:
            return "No monitoring records submitted."

        lines = []
        for record in monitoring_list:
            lines.append(
                f"""
Monitoring Record ID: {record.get("record_id")}
Period: {record.get("period_label")}
Risk Signal: {record.get("risk_signal")}
Observation Summary: {record.get("observation_summary")}
Evidence URL: {record.get("evidence_url")}
Content Hash: {record.get("content_hash") or "not provided"}
"""
            )

        return "\n---\n".join(lines)

    # ─────────────────────────────────────────────────────────────────────
    # Assessment Parsing / Normalization
    # ─────────────────────────────────────────────────────────────────────

    def _parse_assessment(self, raw_result) -> dict:
        data = self._coerce_dict(raw_result)

        valid_verdicts = (
            "high_confidence",
            "moderate_confidence",
            "low_confidence",
            "insufficient_evidence",
            "high_fraud_risk",
        )
        valid_additionality = ("likely", "unlikely", "uncertain")
        valid_env_risk = ("low", "medium", "high", "critical")
        valid_evidence_quality = ("high", "moderate", "low", "insufficient")
        valid_fraud_risk = ("low", "medium", "high")
        valid_biodiversity = ("positive", "neutral", "negative", "uncertain")

        carbon_low = self._clamp(data.get("carbon_estimate_low", 0), 0, 100000000)
        carbon_high = self._clamp(data.get("carbon_estimate_high", carbon_low), carbon_low, 100000000)
        carbon_likely = self._clamp(
            data.get("carbon_estimate_likely", (carbon_low + carbon_high) // 2),
            carbon_low,
            carbon_high,
        )

        source_findings = self._normalize_source_findings(data.get("source_findings", []))
        missing_evidence = self._normalize_string_list(data.get("missing_evidence", []), 12, 180)

        return {
            "verdict": self._enum(data.get("verdict"), valid_verdicts, "insufficient_evidence"),
            "carbon_estimate_low": carbon_low,
            "carbon_estimate_high": carbon_high,
            "carbon_estimate_likely": carbon_likely,
            "confidence_score": self._clamp(data.get("confidence_score", 0), 0, 100),
            "additionality": self._enum(data.get("additionality"), valid_additionality, "uncertain"),
            "environmental_risk": self._enum(data.get("environmental_risk"), valid_env_risk, "medium"),
            "evidence_quality": self._enum(data.get("evidence_quality"), valid_evidence_quality, "insufficient"),
            "fraud_risk": self._enum(data.get("fraud_risk"), valid_fraud_risk, "medium"),
            "permanence_confidence": self._clamp(data.get("permanence_confidence", 0), 0, 100),
            "biodiversity_impact": self._enum(data.get("biodiversity_impact"), valid_biodiversity, "uncertain"),
            "biodiversity_confidence": self._clamp(data.get("biodiversity_confidence", 0), 0, 100),
            "source_findings": source_findings,
            "missing_evidence": missing_evidence,
            "recommended_action": self._clean(
                str(data.get("recommended_action", "Submit stronger independent evidence before relying on this assessment.")),
                MAX_RECOMMENDED_ACTION_LENGTH,
            ),
            "reasoning": self._clean(
                str(data.get("reasoning", "Assessment completed, but the returned reasoning was limited.")),
                MAX_REASONING_LENGTH,
            ),
        }

    def _normalize_source_findings(self, value) -> list:
        if not isinstance(value, list):
            return []

        valid_fetch = ("fetched", "failed")
        valid_alignment = ("supports", "contradicts", "mixed", "unclear")
        valid_credibility = ("high", "moderate", "low", "unknown")

        normalized = []
        for item in value[:MAX_SOURCE_FINDINGS]:
            if not isinstance(item, dict):
                continue

            normalized.append({
                "evidence_id": self._clamp(item.get("evidence_id", 0), 0, MAX_EVIDENCE_PER_PROJECT),
                "fetch_status": self._enum(item.get("fetch_status"), valid_fetch, "failed"),
                "source_alignment": self._enum(item.get("source_alignment"), valid_alignment, "unclear"),
                "credibility": self._enum(item.get("credibility"), valid_credibility, "unknown"),
                "key_observation": self._clean(str(item.get("key_observation", "")), 300),
            })

        return normalized

    def _normalize_string_list(self, value, max_items: int, max_len: int) -> list:
        if not isinstance(value, list):
            return []

        result = []
        for item in value[:max_items]:
            cleaned = self._clean(str(item), max_len)
            if cleaned:
                result.append(cleaned)
        return result

    # ─────────────────────────────────────────────────────────────────────
    # Primitive Helpers
    # ─────────────────────────────────────────────────────────────────────

    def _json(self, value) -> str:
        return json.dumps(value, sort_keys=True)

    def _coerce_dict(self, raw_result) -> dict:
        if isinstance(raw_result, dict):
            return raw_result

        if isinstance(raw_result, str):
            text = raw_result.strip()
            first = text.find("{")
            last = text.rfind("}")
            if first >= 0 and last > first:
                text = text[first:last + 1]
            try:
                parsed = json.loads(text)
                if isinstance(parsed, dict):
                    return parsed
            except Exception:
                return {}

        return {}

    def _clean(self, value: str, max_len: int) -> str:
        if value is None:
            return ""

        text = str(value)
        text = text.replace("\x00", "")
        text = text.replace("\r", " ")
        text = text.strip()

        if len(text) > max_len:
            return text[:max_len]

        return text

    def _is_fetchable_url(self, url: str) -> bool:
        if not url:
            return False

        lowered = url.lower().strip()

        if len(lowered) > MAX_URL_LENGTH:
            return False

        if not (lowered.startswith("https://") or lowered.startswith("http://")):
            return False

        if " " in lowered:
            return False

        return True

    def _safe_status(self, response) -> str:
        try:
            status = getattr(response, "status", "")
            if status is None:
                return "unknown"
            return self._clean(str(status), 40)
        except Exception:
            return "unknown"

    def _safe_body(self, response) -> str:
        try:
            body = getattr(response, "body", "")
            if isinstance(body, bytes):
                return body.decode("utf-8", errors="ignore")
            return str(body)
        except Exception as exc:
            return str(exc)

    def _clamp(self, value, lo: int, hi: int) -> int:
        try:
            number = int(value)
            if number < lo:
                return lo
            if number > hi:
                return hi
            return number
        except Exception:
            return lo

    def _enum(self, value, allowed, fallback: str) -> str:
        if value in allowed:
            return value
        return fallback
