# CarbonTrust Protocol - Contract Reference

Source: `contracts/carbon_trust_protocol.py`

## Methods

### Write Methods
- `create_project(title, project_type, location, project_owner_name, assessment_objective, claimed_carbon_impact, claimed_biodiversity_impact, monitoring_period, evidence_summary) -> u256` —
  create a new assessment case, returns the new project id
- `add_evidence(project_id, evidence_type, title, url, description, content_hash, source_name, date_produced) -> u256` —
  submit evidence to a project; `url` must be a public http(s) URL validators can fetch;
  open to any sender (not just the owner — evidence types include
  `third_party_audit` and `community_observation`), blocked while a review is in progress
- `add_monitoring_record(project_id, period_label, observation_summary, evidence_url, content_hash, risk_signal) -> u256` —
  submit an ongoing monitoring observation; owner-only
- `request_review(project_id) -> str` — triggers the non-deterministic AI consensus
  review (fetches evidence URLs, asks the model to assess, applies the equivalence
  principle) and returns the resulting assessment as a JSON string; owner-only, requires
  at least one evidence item

### Read Methods
- `get_project(project_id) -> str` — project details as JSON
- `get_project_evidence(project_id) -> str` — all evidence for a project as a JSON array
- `get_project_assessment(project_id) -> str` — latest assessment as JSON
- `get_assessment_history(project_id) -> str` — all assessments for a project as a JSON array
- `get_monitoring_records(project_id) -> str` — all monitoring records for a project as a JSON array
- `get_project_count() -> u256` — total number of projects
- `get_projects_by_owner(owner_address) -> str` — project ids owned by an address, as a JSON array

## Error taxonomy

All user-input and access-control failures raise `gl.vm.UserError` with an `EXPECTED:`
prefix (e.g. `"EXPECTED: Title is required"`), so the frontend can treat them as
catchable user errors rather than infrastructure failures. Evidence fetch failures never
raise — they're recorded as `fetch_status: "failed"` in the assessment and folded into a
lower confidence/evidence-quality score instead, preserving the abstention path.

## Non-determinism budget

Two `gl.nondet.*` calls per review: one `gl.nondet.web.get` per evidence item (capped at
12) and one `gl.nondet.exec_prompt` for the assessment itself, both compared across
validators via `gl.eq_principle.prompt_comparative` with an 11-rule prose equivalence
principle (see `_evaluate_environmental_evidence` in the contract).
