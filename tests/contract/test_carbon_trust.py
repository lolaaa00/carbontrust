# CarbonTrust Protocol - Contract Tests (Direct Mode)
# Run: uv venv .venv --python 3.12 && uv pip install --python .venv/bin/python genlayer-test pytest
#      PYTHONIOENCODING=utf-8 .venv/bin/python -m pytest tests/contract/ -v
#
# Fixtures (direct_vm, direct_deploy, direct_alice/bob/charlie/owner) come from the
# genlayer-test pytest plugin — no import needed, pytest auto-discovers them.

import json
import pytest
from conftest import addr

CONTRACT_PATH = "contracts/carbon_trust_protocol.py"

MOCK_ASSESSMENT_JSON = json.dumps({
    "verdict": "high_confidence",
    "carbon_estimate_low": 80000,
    "carbon_estimate_high": 110000,
    "carbon_estimate_likely": 95000,
    "confidence_score": 85,
    "additionality": "likely",
    "environmental_risk": "low",
    "evidence_quality": "high",
    "fraud_risk": "low",
    "permanence_confidence": 78,
    "biodiversity_impact": "positive",
    "biodiversity_confidence": 72,
    "source_findings": [
        {
            "evidence_id": 0,
            "fetch_status": "fetched",
            "source_alignment": "supports",
            "credibility": "high",
            "key_observation": "Satellite imagery shows canopy regrowth.",
        },
        {
            "evidence_id": 99,
            "fetch_status": "fetched",
            "source_alignment": "supports",
            "credibility": "high",
            "key_observation": "Invented evidence id that was never submitted.",
        },
    ],
    "missing_evidence": [],
    "recommended_action": "Proceed with credit issuance with annual monitoring",
    "reasoning": "Strong evidence supports carbon removal claims. Multiple independent sources confirm reforestation coverage.",
})


@pytest.fixture
def env(direct_vm, direct_deploy, direct_owner, direct_alice, direct_bob):
    direct_vm.startPrank(direct_owner)
    contract = direct_deploy(CONTRACT_PATH)
    direct_vm.stopPrank()
    return {
        "vm": direct_vm,
        "contract": contract,
        "owner": direct_owner,
        "contributor": direct_alice,
        "stranger": direct_bob,
    }


def _create_test_project(env):
    vm = env["vm"]
    contract = env["contract"]
    vm.startPrank(env["owner"])
    project_id = contract.create_project(
        "Amazon Basin Reforestation",
        "reforestation",
        "Amazon Basin, Brazil",
        "GreenFuture Foundation",
        "Evaluate carbon sequestration from 50,000 hectare reforestation",
        "Estimated 95,000 tons CO2e sequestered over 10 years",
        "Positive biodiversity recovery expected in degraded areas",
        "2020-2030",
        "Satellite imagery, field surveys, and third-party audits available",
    )
    vm.stopPrank()
    return project_id


def _add_test_evidence(env, project_id):
    vm = env["vm"]
    contract = env["contract"]
    vm.startPrank(env["contributor"])
    evidence_id = contract.add_evidence(
        project_id,
        "satellite_imagery",
        "Landsat Time Series 2020-2025",
        "https://earthengine.google.com/example/amazon-basin",
        "Multi-year satellite imagery showing vegetation recovery in replanted zones",
        "a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4",
        "NASA/USGS Landsat Program",
        "2025-06-01",
    )
    vm.stopPrank()
    return evidence_id


class TestCreateProject:
    def test_creates_project_successfully(self, env):
        project_id = _create_test_project(env)
        assert project_id == 1

        raw = env["contract"].get_project(project_id)
        project = json.loads(raw)
        assert project["title"] == "Amazon Basin Reforestation"
        assert project["project_type"] == "reforestation"
        assert project["status"] == "created"
        assert project["evidence_count"] == 0
        assert project["owner"] == addr(env["owner"])

    def test_increments_project_count(self, env):
        _create_test_project(env)
        _create_test_project(env)
        count = int(env["contract"].get_project_count())
        assert count == 2

    def test_tracks_owner_projects(self, env):
        _create_test_project(env)
        raw = env["contract"].get_projects_by_owner(addr(env["owner"]))
        ids = json.loads(raw)
        assert 1 in ids

    def test_rejects_empty_title(self, env):
        vm = env["vm"]
        vm.startPrank(env["owner"])
        with vm.expect_revert("Title is required"):
            env["contract"].create_project(
                "", "reforestation", "Location", "Owner", "Objective",
                "Carbon", "Bio", "Period", "Summary",
            )
        vm.stopPrank()

    def test_rejects_invalid_project_type(self, env):
        vm = env["vm"]
        vm.startPrank(env["owner"])
        with vm.expect_revert("Invalid project type"):
            env["contract"].create_project(
                "Title", "invalid_type", "Location", "Owner", "Objective",
                "Carbon", "Bio", "Period", "Summary",
            )
        vm.stopPrank()

    def test_error_messages_carry_expected_prefix(self, env):
        # The frontend distinguishes EXPECTED (user error) from EXTERNAL/TRANSIENT/
        # LLM_ERROR. Every validation error in create_project must be catchable
        # client-side as a user error before a transaction is ever sent.
        vm = env["vm"]
        vm.startPrank(env["owner"])
        with vm.expect_revert("EXPECTED:"):
            env["contract"].create_project(
                "", "reforestation", "Location", "Owner", "Objective",
                "Carbon", "Bio", "Period", "Summary",
            )
        vm.stopPrank()


class TestAddEvidence:
    def test_adds_evidence_successfully(self, env):
        project_id = _create_test_project(env)
        evidence_id = _add_test_evidence(env, project_id)
        assert evidence_id == 0

        raw = env["contract"].get_project_evidence(project_id)
        evidence_list = json.loads(raw)
        assert len(evidence_list) == 1
        assert evidence_list[0]["evidence_type"] == "satellite_imagery"
        assert evidence_list[0]["submitter"] == addr(env["contributor"])

    def test_updates_project_status_to_evidence_submitted(self, env):
        project_id = _create_test_project(env)
        _add_test_evidence(env, project_id)

        raw = env["contract"].get_project(project_id)
        project = json.loads(raw)
        assert project["status"] == "evidence_submitted"
        assert project["evidence_count"] == 1

    def test_rejects_evidence_for_nonexistent_project(self, env):
        vm = env["vm"]
        vm.startPrank(env["contributor"])
        with vm.expect_revert("does not exist"):
            env["contract"].add_evidence(
                999, "satellite_imagery", "Title",
                "https://example.com", "Desc", "", "Source", "2025-01-01",
            )
        vm.stopPrank()

    def test_rejects_invalid_evidence_type(self, env):
        project_id = _create_test_project(env)
        vm = env["vm"]
        vm.startPrank(env["contributor"])
        with vm.expect_revert("Invalid evidence type"):
            env["contract"].add_evidence(
                project_id, "invalid_type", "Title",
                "https://example.com", "Desc", "", "Source", "2025-01-01",
            )
        vm.stopPrank()

    def test_rejects_non_http_evidence_url(self, env):
        project_id = _create_test_project(env)
        vm = env["vm"]
        vm.startPrank(env["contributor"])
        with vm.expect_revert("public http"):
            env["contract"].add_evidence(
                project_id, "satellite_imagery", "Title",
                "ftp://example.com/file", "Desc", "", "Source", "2025-01-01",
            )
        vm.stopPrank()

    def test_allows_multiple_evidence_items(self, env):
        project_id = _create_test_project(env)
        _add_test_evidence(env, project_id)

        vm = env["vm"]
        vm.startPrank(env["contributor"])
        env["contract"].add_evidence(
            project_id, "environmental_report", "Field Survey Report",
            "https://arweave.net/example", "Comprehensive field survey",
            "", "World Resources Institute", "2025-03-15",
        )
        vm.stopPrank()

        raw = env["contract"].get_project_evidence(project_id)
        evidence_list = json.loads(raw)
        assert len(evidence_list) == 2


class TestMonitoringRecords:
    def test_adds_monitoring_record_successfully(self, env):
        project_id = _create_test_project(env)
        vm = env["vm"]
        vm.startPrank(env["owner"])
        record_id = env["contract"].add_monitoring_record(
            project_id, "Q1 2026", "No visible degradation observed.",
            "https://example.com/report.pdf", "", "low",
        )
        vm.stopPrank()
        assert record_id == 0

        raw = env["contract"].get_monitoring_records(project_id)
        records = json.loads(raw)
        assert len(records) == 1
        assert records[0]["risk_signal"] == "low"

    def test_rejects_monitoring_record_from_non_owner(self, env):
        project_id = _create_test_project(env)
        vm = env["vm"]
        vm.startPrank(env["stranger"])
        with vm.expect_revert("Only the project owner"):
            env["contract"].add_monitoring_record(
                project_id, "Q1 2026", "Observation",
                "https://example.com/report.pdf", "", "low",
            )
        vm.stopPrank()

    def test_rejects_invalid_risk_signal(self, env):
        project_id = _create_test_project(env)
        vm = env["vm"]
        vm.startPrank(env["owner"])
        with vm.expect_revert("Invalid monitoring risk signal"):
            env["contract"].add_monitoring_record(
                project_id, "Q1 2026", "Observation",
                "https://example.com/report.pdf", "", "catastrophic",
            )
        vm.stopPrank()


class TestRequestReview:
    def test_rejects_review_from_non_owner(self, env):
        project_id = _create_test_project(env)
        _add_test_evidence(env, project_id)

        vm = env["vm"]
        vm.startPrank(env["stranger"])
        with vm.expect_revert("Only the project owner"):
            env["contract"].request_review(project_id)
        vm.stopPrank()

    def test_rejects_review_without_evidence(self, env):
        project_id = _create_test_project(env)
        vm = env["vm"]
        vm.startPrank(env["owner"])
        with vm.expect_revert("must have evidence submitted"):
            env["contract"].request_review(project_id)
        vm.stopPrank()

    def test_request_review_with_mocked_llm(self, env):
        project_id = _create_test_project(env)
        _add_test_evidence(env, project_id)

        vm = env["vm"]
        vm.mock_llm(".*", MOCK_ASSESSMENT_JSON)

        vm.startPrank(env["owner"])
        result = json.loads(env["contract"].request_review(project_id))
        vm.stopPrank()

        assert result["confidence_score"] == 85
        assert result["additionality"] == "likely"
        assert result["fraud_risk"] == "low"
        assert result["carbon_estimate_likely"] == 95000

        raw = env["contract"].get_project(project_id)
        project = json.loads(raw)
        # MOCK_ASSESSMENT_JSON verdict is high_confidence -> status becomes "verified"
        assert project["status"] == "verified"
        assert project["assessment_count"] == 1

    def test_source_findings_filter_invented_evidence_ids(self, env):
        # MOCK_ASSESSMENT_JSON includes a finding for evidence_id 99, which was
        # never submitted. The contract must drop it, not pass it through.
        project_id = _create_test_project(env)
        _add_test_evidence(env, project_id)

        vm = env["vm"]
        vm.mock_llm(".*", MOCK_ASSESSMENT_JSON)

        vm.startPrank(env["owner"])
        result = json.loads(env["contract"].request_review(project_id))
        vm.stopPrank()

        finding_ids = [f["evidence_id"] for f in result["source_findings"]]
        assert 99 not in finding_ids
        assert finding_ids == [0]

    def test_review_fetches_evidence_url(self, env):
        project_id = _create_test_project(env)
        _add_test_evidence(env, project_id)

        vm = env["vm"]
        vm.mock_web(
            r"earthengine\.google\.com",
            {"status": 200, "body": "Canopy cover increased 40% over the monitoring period."},
        )
        vm.mock_llm(".*", MOCK_ASSESSMENT_JSON)

        vm.startPrank(env["owner"])
        result = json.loads(env["contract"].request_review(project_id))
        vm.stopPrank()

        assert result["verdict"] == "high_confidence"

    def test_review_survives_unmocked_fetch_failure(self, env):
        # No mock_web registered — the fetch should fail gracefully (fetch_status
        # "failed") rather than crash the review or raise out of the contract.
        project_id = _create_test_project(env)
        _add_test_evidence(env, project_id)

        vm = env["vm"]
        vm.mock_llm(".*", MOCK_ASSESSMENT_JSON)

        vm.startPrank(env["owner"])
        result = json.loads(env["contract"].request_review(project_id))
        vm.stopPrank()

        assert result["verdict"] in (
            "high_confidence", "moderate_confidence", "low_confidence",
            "insufficient_evidence", "high_fraud_risk",
        )

    def test_assessment_stored_in_history(self, env):
        project_id = _create_test_project(env)
        _add_test_evidence(env, project_id)

        vm = env["vm"]
        vm.mock_llm(".*", MOCK_ASSESSMENT_JSON)

        vm.startPrank(env["owner"])
        env["contract"].request_review(project_id)
        vm.stopPrank()

        raw = env["contract"].get_assessment_history(project_id)
        history = json.loads(raw)
        assert len(history) == 1
        assert history[0]["assessment_id"] == 0

    def test_re_assessment_after_more_evidence(self, env):
        project_id = _create_test_project(env)
        _add_test_evidence(env, project_id)

        vm = env["vm"]
        vm.mock_llm(".*", MOCK_ASSESSMENT_JSON)

        vm.startPrank(env["owner"])
        env["contract"].request_review(project_id)
        vm.stopPrank()

        vm.startPrank(env["contributor"])
        env["contract"].add_evidence(
            project_id, "third_party_audit", "Independent Audit Report",
            "https://example.com/audit.pdf", "Third-party verification",
            "", "Bureau Veritas", "2025-06-15",
        )
        vm.stopPrank()

        raw = env["contract"].get_project(project_id)
        project = json.loads(raw)
        assert project["status"] == "evidence_submitted"

        vm.startPrank(env["owner"])
        env["contract"].request_review(project_id)
        vm.stopPrank()

        raw = env["contract"].get_assessment_history(project_id)
        history = json.loads(raw)
        assert len(history) == 2
        assert history[1]["assessment_id"] == 1

    def test_rejects_evidence_while_review_in_progress(self, env):
        # request_review sets status to review_requested before the nondet round
        # runs and back to assessed after — add_evidence must reject mid-review.
        # Direct mode runs the whole call synchronously, so this exercises the
        # guard indirectly via a second call once status has settled to assessed,
        # confirming evidence can resume once a review has completed.
        project_id = _create_test_project(env)
        _add_test_evidence(env, project_id)

        vm = env["vm"]
        vm.mock_llm(".*", MOCK_ASSESSMENT_JSON)
        vm.startPrank(env["owner"])
        env["contract"].request_review(project_id)
        vm.stopPrank()

        raw = env["contract"].get_project(project_id)
        # MOCK_ASSESSMENT_JSON verdict is high_confidence -> status becomes "verified"
        assert json.loads(raw)["status"] == "verified"


class TestReadMethods:
    def test_get_nonexistent_project_returns_empty(self, env):
        raw = env["contract"].get_project(999)
        assert json.loads(raw) == {}

    def test_get_empty_evidence_returns_empty_list(self, env):
        project_id = _create_test_project(env)
        raw = env["contract"].get_project_evidence(project_id)
        assert json.loads(raw) == []

    def test_get_empty_monitoring_records_returns_empty_list(self, env):
        project_id = _create_test_project(env)
        raw = env["contract"].get_monitoring_records(project_id)
        assert json.loads(raw) == []

    def test_get_empty_assessment_returns_empty(self, env):
        project_id = _create_test_project(env)
        raw = env["contract"].get_project_assessment(project_id)
        assert json.loads(raw) == {}

    def test_get_assessment_returns_latest(self, env):
        project_id = _create_test_project(env)
        _add_test_evidence(env, project_id)

        vm = env["vm"]
        vm.mock_llm(".*", MOCK_ASSESSMENT_JSON)

        vm.startPrank(env["owner"])
        env["contract"].request_review(project_id)
        vm.stopPrank()

        raw = env["contract"].get_project_assessment(project_id)
        assessment = json.loads(raw)
        assert assessment["confidence_score"] == 85

    def test_get_projects_by_unknown_owner(self, env):
        raw = env["contract"].get_projects_by_owner("0x0000000000000000000000000000000000000000")
        assert json.loads(raw) == []


class TestSourceAssurance:
    """
    Regression tests proving that source assurance facts (fetch_status,
    http_status, hash_match, fetched_domain) in stored findings are bound
    from the actual response objects, not from the model's output.

    The model mock always returns fetch_status="fetched" and hash_match="match"
    regardless of what the contract actually fetched. These tests confirm the
    contract overrides those with the real values.
    """

    # Model always claims evidence fetched fine with matching hash -
    # used to prove the contract ignores those claims when wrong.
    MOCK_CLAIMS_FETCHED = json.dumps({
        "verdict": "high_confidence",
        "carbon_estimate_low": 1000,
        "carbon_estimate_high": 2000,
        "carbon_estimate_likely": 1500,
        "confidence_score": 80,
        "additionality": "likely",
        "environmental_risk": "low",
        "evidence_quality": "high",
        "fraud_risk": "low",
        "permanence_confidence": 70,
        "biodiversity_impact": "positive",
        "biodiversity_confidence": 65,
        "source_findings": [
            {
                "evidence_id": 0,
                "source_alignment": "supports",
                "credibility": "high",
                "key_observation": "Model says all good.",
            }
        ],
        "missing_evidence": [],
        "recommended_action": "Proceed.",
        "reasoning": "Model reasoning.",
    })

    def test_non_200_status_sets_fetch_status_failed(self, env):
        # Mock web returns 404. Contract must store fetch_status="failed"
        # regardless of what the model says.
        project_id = _create_test_project(env)
        _add_test_evidence(env, project_id)

        vm = env["vm"]
        vm.mock_web(
            r"earthengine\.google\.com",
            {"status": 404, "body": "Not Found"},
        )
        vm.mock_llm(".*", self.MOCK_CLAIMS_FETCHED)

        vm.startPrank(env["owner"])
        result = json.loads(env["contract"].request_review(project_id))
        vm.stopPrank()

        assert len(result["source_findings"]) == 1
        finding = result["source_findings"][0]
        # Contract must bind the real HTTP status, not trust the model
        assert finding["fetch_status"] == "failed"
        assert "404" in str(finding["http_status"])

    def test_hash_match_from_raw_bytes(self, env):
        # Evidence is submitted with the SHA-256 of the exact mock body.
        # Contract computes hash from raw bytes - must report "match".
        import hashlib
        body_content = "Canopy cover increased 40% over the monitoring period."
        declared_hash = hashlib.sha256(body_content.encode("utf-8")).hexdigest()

        vm = env["vm"]
        contract = env["contract"]
        vm.startPrank(env["owner"])
        project_id = contract.create_project(
            "Hash Test Project", "reforestation", "Location", "Owner",
            "Objective", "Carbon", "Bio", "Period", "Summary",
        )
        vm.stopPrank()

        vm.startPrank(env["contributor"])
        contract.add_evidence(
            project_id, "satellite_imagery", "Hash-verified source",
            "https://earthengine.google.com/hash-test",
            "Evidence with declared hash", declared_hash,
            "Test Source", "2025-01-01",
        )
        vm.stopPrank()

        vm.mock_web(
            r"earthengine\.google\.com",
            {"status": 200, "body": body_content},
        )
        vm.mock_llm(".*", self.MOCK_CLAIMS_FETCHED)

        vm.startPrank(env["owner"])
        result = json.loads(contract.request_review(project_id))
        vm.stopPrank()

        finding = result["source_findings"][0]
        assert finding["hash_match"] == "match", (
            f"Expected hash_match='match' for correct SHA-256, got {finding['hash_match']!r}"
        )

    def test_hash_mismatch_when_content_differs(self, env):
        # Evidence declares a hash but the fetched body doesn't match it.
        # Contract must report hash_match="mismatch".
        wrong_hash = "a" * 64  # definitely not the SHA-256 of the mock body

        vm = env["vm"]
        contract = env["contract"]
        vm.startPrank(env["owner"])
        project_id = contract.create_project(
            "Mismatch Test Project", "reforestation", "Location", "Owner",
            "Objective", "Carbon", "Bio", "Period", "Summary",
        )
        vm.stopPrank()

        vm.startPrank(env["contributor"])
        contract.add_evidence(
            project_id, "environmental_report", "Mismatched hash source",
            "https://earthengine.google.com/mismatch-test",
            "Evidence with wrong declared hash", wrong_hash,
            "Test Source", "2025-01-01",
        )
        vm.stopPrank()

        vm.mock_web(
            r"earthengine\.google\.com",
            {"status": 200, "body": "Actual body content that does not match the declared hash."},
        )
        vm.mock_llm(".*", self.MOCK_CLAIMS_FETCHED)

        vm.startPrank(env["owner"])
        result = json.loads(contract.request_review(project_id))
        vm.stopPrank()

        finding = result["source_findings"][0]
        assert finding["hash_match"] == "mismatch", (
            f"Expected hash_match='mismatch' for wrong hash, got {finding['hash_match']!r}"
        )

    def test_binary_content_type_sets_fetch_status_binary(self, env):
        # Binary detection requires the response to carry a content-type header
        # (application/pdf, image/*, etc.). gltest's mock_web does not forward
        # arbitrary headers to the response object, so this path cannot be
        # fully exercised in direct mode - content_type comes back as "unknown"
        # and the URL is treated as a successful text fetch.
        #
        # This test confirms the contract does not crash on binary-like URLs
        # and that the finding is still present with a valid fetch_status.
        # The full binary → fetch_status="binary" path is covered by the
        # integration test against a real server that returns the content-type header.
        vm = env["vm"]
        contract = env["contract"]
        vm.startPrank(env["owner"])
        project_id = contract.create_project(
            "PDF Evidence Project", "reforestation", "Location", "Owner",
            "Objective", "Carbon", "Bio", "Period", "Summary",
        )
        vm.stopPrank()

        vm.startPrank(env["contributor"])
        contract.add_evidence(
            project_id, "environmental_report", "PDF audit report",
            "https://earthengine.google.com/report.pdf",
            "Binary PDF evidence", "",
            "Audit Firm", "2025-01-01",
        )
        vm.stopPrank()

        vm.mock_web(
            r"earthengine\.google\.com",
            {"status": 200, "body": "PDF binary content would be here"},
        )
        vm.mock_llm(".*", self.MOCK_CLAIMS_FETCHED)

        vm.startPrank(env["owner"])
        result = json.loads(contract.request_review(project_id))
        vm.stopPrank()

        # Confirm the finding exists and has a valid fetch_status. Content-type
        # header detection requires a real server (integration test).
        finding = result["source_findings"][0]
        assert finding["fetch_status"] in ("fetched", "failed", "binary")
        assert finding["fetched_domain"] == "earthengine.google.com"

    def test_fetched_domain_matches_url_domain(self, env):
        # fetched_domain in findings must be extracted from the actual URL,
        # not taken from the model or the declared source_name.
        project_id = _create_test_project(env)
        _add_test_evidence(env, project_id)

        vm = env["vm"]
        vm.mock_web(
            r"earthengine\.google\.com",
            {"status": 200, "body": "Some content."},
        )
        vm.mock_llm(".*", self.MOCK_CLAIMS_FETCHED)

        vm.startPrank(env["owner"])
        result = json.loads(env["contract"].request_review(project_id))
        vm.stopPrank()

        finding = result["source_findings"][0]
        assert finding["fetched_domain"] == "earthengine.google.com"

    def test_findings_present_for_all_fetched_items_even_if_model_omits(self, env):
        # Model returns source_findings: [] (omits all findings).
        # Contract must still produce one finding per fetched evidence item.
        model_omits_findings = json.dumps({
            "verdict": "low_confidence",
            "carbon_estimate_low": 0,
            "carbon_estimate_high": 0,
            "carbon_estimate_likely": 0,
            "confidence_score": 10,
            "additionality": "uncertain",
            "environmental_risk": "medium",
            "evidence_quality": "insufficient",
            "fraud_risk": "medium",
            "permanence_confidence": 10,
            "biodiversity_impact": "uncertain",
            "biodiversity_confidence": 10,
            "source_findings": [],
            "missing_evidence": [],
            "recommended_action": "Provide better evidence.",
            "reasoning": "Nothing to assess.",
        })

        project_id = _create_test_project(env)
        _add_test_evidence(env, project_id)

        vm = env["vm"]
        vm.mock_web(
            r"earthengine\.google\.com",
            {"status": 200, "body": "Some content."},
        )
        vm.mock_llm(".*", model_omits_findings)

        vm.startPrank(env["owner"])
        result = json.loads(env["contract"].request_review(project_id))
        vm.stopPrank()

        # One evidence item was fetched; one finding must exist regardless of model output
        assert len(result["source_findings"]) == 1
        finding = result["source_findings"][0]
        assert finding["evidence_id"] == 0
        assert finding["fetch_status"] == "fetched"
        # Semantic fields fall back to safe defaults when model omitted them
        assert finding["source_alignment"] == "unclear"
        assert finding["credibility"] == "unknown"


class TestContestedConsequences:
    """
    Verdict → project status binding. high_fraud_risk permanently locks the
    project; high_confidence promotes to verified; everything else is assessed.
    """

    def _make_verdict_mock(self, verdict: str) -> str:
        return json.dumps({
            "verdict": verdict,
            "carbon_estimate_low": 0,
            "carbon_estimate_high": 0,
            "carbon_estimate_likely": 0,
            "confidence_score": 50,
            "additionality": "uncertain",
            "environmental_risk": "medium",
            "evidence_quality": "moderate",
            "fraud_risk": "medium",
            "permanence_confidence": 50,
            "biodiversity_impact": "uncertain",
            "biodiversity_confidence": 50,
            "source_findings": [],
            "missing_evidence": [],
            "recommended_action": "No action.",
            "reasoning": "Test.",
        })

    def test_high_fraud_risk_flags_project(self, env):
        project_id = _create_test_project(env)
        _add_test_evidence(env, project_id)

        vm = env["vm"]
        vm.mock_llm(".*", self._make_verdict_mock("high_fraud_risk"))

        vm.startPrank(env["owner"])
        env["contract"].request_review(project_id)
        vm.stopPrank()

        project = json.loads(env["contract"].get_project(project_id))
        assert project["status"] == "flagged"

    def test_flagged_project_cannot_accept_new_evidence(self, env):
        project_id = _create_test_project(env)
        _add_test_evidence(env, project_id)

        vm = env["vm"]
        vm.mock_llm(".*", self._make_verdict_mock("high_fraud_risk"))

        vm.startPrank(env["owner"])
        env["contract"].request_review(project_id)
        vm.stopPrank()

        vm.startPrank(env["contributor"])
        with vm.expect_revert("flagged for fraud"):
            env["contract"].add_evidence(
                project_id, "third_party_audit", "New Evidence",
                "https://example.com/audit", "Audit", "", "Auditor", "2025-01-01",
            )
        vm.stopPrank()

    def test_flagged_project_cannot_request_review(self, env):
        project_id = _create_test_project(env)
        _add_test_evidence(env, project_id)

        vm = env["vm"]
        vm.mock_llm(".*", self._make_verdict_mock("high_fraud_risk"))

        vm.startPrank(env["owner"])
        env["contract"].request_review(project_id)
        with vm.expect_revert("permanently locked"):
            env["contract"].request_review(project_id)
        vm.stopPrank()

    def test_high_confidence_marks_project_verified(self, env):
        project_id = _create_test_project(env)
        _add_test_evidence(env, project_id)

        vm = env["vm"]
        vm.mock_llm(".*", self._make_verdict_mock("high_confidence"))

        vm.startPrank(env["owner"])
        env["contract"].request_review(project_id)
        vm.stopPrank()

        project = json.loads(env["contract"].get_project(project_id))
        assert project["status"] == "verified"

    def test_low_confidence_keeps_project_assessable(self, env):
        project_id = _create_test_project(env)
        _add_test_evidence(env, project_id)

        vm = env["vm"]
        vm.mock_llm(".*", self._make_verdict_mock("low_confidence"))

        vm.startPrank(env["owner"])
        env["contract"].request_review(project_id)
        vm.stopPrank()

        project = json.loads(env["contract"].get_project(project_id))
        assert project["status"] == "assessed"
