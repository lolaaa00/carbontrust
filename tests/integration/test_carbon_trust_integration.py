# CarbonTrust Protocol - Integration Tests (real StudioNet consensus)
#
# Unlike tests/contract/ (direct mode, a simulated VM), this deploys a fresh
# contract instance to real GenLayer StudioNet and exercises real consensus -
# real gl.nondet.web.get fetches, real gl.nondet.exec_prompt calls, real
# validator voting. request_review here takes real wall-clock minutes; this
# is not the suite to run on every save.
#
# Run: PYTHONIOENCODING=utf-8 .venv/bin/python -m pytest tests/integration/ -v -s --network studionet
#
# gltest.config.yaml already defaults to studionet, so --network is optional,
# but pass it explicitly per the spec's guidance (gltest defaults to localnet
# if the flag or config default is ever missing).
#
# StudioNet enforces a 30 requests/minute rate limit per client, verified by
# hitting it directly: two separate test functions (each deploying/writing/
# polling independently) blew through 30 requests within under a minute even
# at an 8s poll interval, because a handful of back-to-back writes each cost
# several requests (submit + gas estimate + several receipt polls). The fix
# is not a faster/slower poll interval, it's fewer, spread-out requests: one
# test function sharing one contract, with explicit pacing sleeps between
# writes so request bursts don't stack inside the same rolling 60s window.

import json
import time
import pytest
from gltest import get_contract_factory
from gltest.accounts import get_accounts

# Resolved relative to gltest.config.yaml's paths.contracts ("contracts"),
# not relative to the repo root.
CONTRACT_PATH = "carbon_trust_protocol.py"

# Space out write bursts to stay well under StudioNet's 30 req/min ceiling.
RATE_LIMIT_PACING_SECONDS = 20


def test_full_project_lifecycle_reaches_real_consensus():
    """
    Deploys a fresh contract to StudioNet and walks the full real lifecycle:
    create a project, submit evidence pointing at a stable public URL,
    request a review, and wait for real validators to reach equivalence on a
    real gl.nondet.exec_prompt result. This is the test that proves the
    deployed contract's non-determinism budget actually works end to end,
    not just in the mocked VM tests/contract/ exercises.
    """
    factory = get_contract_factory(contract_file_path=CONTRACT_PATH)
    contract = factory.deploy(args=[])
    get_accounts()[0]  # confirms account fixtures resolve; sender is implicit

    time.sleep(RATE_LIMIT_PACING_SECONDS)

    contract.create_project(
        args=[
            "Congo Basin Wetland Restoration",
            "wetland_restoration",
            "Congo Basin, DRC",
            "Wetland Trust",
            "Evaluate wetland restoration and flood-risk reduction claims",
            "Estimated 40,000 tons CO2e sequestered over 15 years",
            "Positive impact on migratory bird habitat",
            "2024-2039",
            "Public satellite change-detection imagery",
        ]
    ).transact(wait_retries=40, wait_interval=8000)

    project_id = int(contract.get_project_count(args=[]).call())
    raw_project = contract.get_project(args=[project_id]).call()
    project = json.loads(raw_project)
    assert project["title"] == "Congo Basin Wetland Restoration"
    assert project["status"] == "created"

    time.sleep(RATE_LIMIT_PACING_SECONDS)

    contract.add_evidence(
        args=[
            project_id,
            "satellite_imagery",
            "Public Wikipedia reference - Congo Basin",
            "https://en.wikipedia.org/wiki/Congo_Basin",
            "Stable public page used as a fetchable evidence source for this integration test",
            "",
            "Wikipedia",
            "2025-01-01",
        ]
    ).transact(wait_retries=40, wait_interval=8000)

    raw_project = contract.get_project(args=[project_id]).call()
    assert json.loads(raw_project)["evidence_count"] >= 1

    time.sleep(RATE_LIMIT_PACING_SECONDS)

    # The slow step: one real non-deterministic round, real validators, real
    # equivalence-principle comparison. Budget for multi-minute consensus.
    contract.request_review(args=[project_id]).transact(
        wait_retries=120, wait_interval=8000,
    )

    raw_assessment = contract.get_project_assessment(args=[project_id]).call()
    assessment = json.loads(raw_assessment)

    assert assessment != {}
    assert assessment["verdict"] in (
        "high_confidence", "moderate_confidence", "low_confidence",
        "insufficient_evidence", "high_fraud_risk",
    )
    # Real fetch of a real URL - either it succeeded or failed gracefully, but
    # either way the abstention/fetch_status plumbing is exercised for real.
    assert isinstance(assessment["source_findings"], list)

    raw_project_after = contract.get_project(args=[project_id]).call()
    assert json.loads(raw_project_after)["status"] == "assessed"
