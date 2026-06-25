# CarbonTrust Protocol - Contract Tests (Direct Mode)
# Run: pip install genlayer-test && pytest tests/contract/ -v

import json
import pytest
from genlayer_test.direct import VMContext, deploy_contract, create_test_addresses

CONTRACT_PATH = "contracts/carbon_trust_protocol.py"

MOCK_ASSESSMENT_JSON = json.dumps({
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
    "recommended_action": "Proceed with credit issuance with annual monitoring",
    "reasoning": "Strong evidence supports carbon removal claims. Multiple independent sources confirm reforestation coverage.",
})


@pytest.fixture
def env():
    vm = VMContext()
    addresses = create_test_addresses(3)
    owner = addresses[0]
    contributor = addresses[1]
    stranger = addresses[2]
    with vm.activate():
        vm.startPrank(owner)
        contract = deploy_contract(CONTRACT_PATH, vm)
        vm.stopPrank()
        yield {
            "vm": vm,
            "contract": contract,
            "owner": owner,
            "contributor": contributor,
            "stranger": stranger,
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
        assert project["owner"] == str(env["owner"])

    def test_increments_project_count(self, env):
        _create_test_project(env)
        _create_test_project(env)
        count = int(env["contract"].get_project_count())
        assert count == 2

    def test_tracks_owner_projects(self, env):
        _create_test_project(env)
        raw = env["contract"].get_projects_by_owner(str(env["owner"]))
        ids = json.loads(raw)
        assert 1 in ids

    def test_rejects_empty_title(self, env):
        vm = env["vm"]
        vm.startPrank(env["owner"])
        vm.expect_revert("Title is required")
        env["contract"].create_project(
            "", "reforestation", "Location", "Owner", "Objective",
            "Carbon", "Bio", "Period", "Summary",
        )
        vm.stopPrank()

    def test_rejects_invalid_project_type(self, env):
        vm = env["vm"]
        vm.startPrank(env["owner"])
        vm.expect_revert("Invalid project type")
        env["contract"].create_project(
            "Title", "invalid_type", "Location", "Owner", "Objective",
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
        assert evidence_list[0]["submitter"] == str(env["contributor"])

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
        vm.expect_revert("does not exist")
        env["contract"].add_evidence(
            999, "satellite_imagery", "Title",
            "https://example.com", "Desc", "", "Source", "2025-01-01",
        )
        vm.stopPrank()

    def test_rejects_invalid_evidence_type(self, env):
        project_id = _create_test_project(env)
        vm = env["vm"]
        vm.startPrank(env["contributor"])
        vm.expect_revert("Invalid evidence type")
        env["contract"].add_evidence(
            project_id, "invalid_type", "Title",
            "https://example.com", "Desc", "", "Source", "2025-01-01",
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


class TestRequestReview:
    def test_rejects_review_from_non_owner(self, env):
        project_id = _create_test_project(env)
        _add_test_evidence(env, project_id)

        vm = env["vm"]
        vm.startPrank(env["stranger"])
        vm.expect_revert("Only the project owner")
        env["contract"].request_review(project_id)
        vm.stopPrank()

    def test_rejects_review_without_evidence(self, env):
        project_id = _create_test_project(env)
        vm = env["vm"]
        vm.startPrank(env["owner"])
        vm.expect_revert("must have evidence submitted")
        env["contract"].request_review(project_id)
        vm.stopPrank()

    def test_request_review_with_mocked_llm(self, env):
        project_id = _create_test_project(env)
        _add_test_evidence(env, project_id)

        vm = env["vm"]
        vm.mock_llm(".*", MOCK_ASSESSMENT_JSON)

        vm.startPrank(env["owner"])
        result = env["contract"].request_review(project_id)
        vm.stopPrank()

        assert result["confidence_score"] == 85
        assert result["additionality"] == "likely"
        assert result["fraud_risk"] == "low"
        assert result["carbon_estimate_likely"] == 95000

        raw = env["contract"].get_project(project_id)
        project = json.loads(raw)
        assert project["status"] == "assessed"
        assert project["assessment_count"] == 1

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


class TestReadMethods:
    def test_get_nonexistent_project_returns_empty(self, env):
        raw = env["contract"].get_project(999)
        assert json.loads(raw) == {}

    def test_get_empty_evidence_returns_empty_list(self, env):
        project_id = _create_test_project(env)
        raw = env["contract"].get_project_evidence(project_id)
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
