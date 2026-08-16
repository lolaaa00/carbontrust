# CarbonTrust Protocol — Submission

## What it does

CarbonTrust turns a claimed environmental outcome — a reforestation project, a
mangrove restoration, a renewable build-out — into a confidence-scored,
source-attested verdict instead of a self-reported number. A project owner
registers a claim and attaches public evidence URLs (satellite imagery,
audits, government permits, surveys). Anyone can request a review; the
GenLayer contract fetches each evidence URL itself, asks an independent
validator set to judge it, and only writes a result once the validators reach
equivalence on the verdict.

## Who it's for

Carbon credit buyers, grant funders, and land regulators who currently have
to either trust a project's own claims or pay for a single centralized
auditor. CarbonTrust gives them a verifiable, source-attested judgment
instead.

## Why GenLayer

Delete the consensus layer and there are only two shapes left: the project
owner scores their own claim, or one centralized reviewer scores it with no
way for anyone else to verify the reasoning. Judging whether fetched evidence
actually supports an environmental claim is irreducibly semantic — it can't
be reduced to a regex or a price feed. The full gate-by-gate reasoning,
including the alternative ideas (several of them value-bearing) this was
chosen over, is in [docs/DECISION_RECORD.md](docs/DECISION_RECORD.md).

## How to use it

1. Visit the live URL below
2. No wallet needed to browse — Explore works read-only
3. To write: connect MetaMask, or click "Continue without a wallet" for an
   instant browser-generated identity (acknowledge the one-time warning, it's
   not custody-grade)
4. Create a project, attach evidence, request a review, watch it move through
   real GenLayer consensus stages in the UI

## One measured result

On the live deployed site, with a deliberately weak test case (a generic
Wikipedia reference page, not evidence of a real project's implementation),
the contract's real consensus round returned:

- **Verdict: Very Low Confidence, 18%**
- **Evidence Quality: Insufficient**
- **Additionality: Uncertain**
- **Carbon estimate: collapsed to ~0 tCO2e** despite a claimed 10,000
- **Reasoning (verbatim):** "The only fetched source is a general reference
  page about the Sundarbans and does not substantiate that this project
  exists, is being implemented, or has achieved measurable carbon
  sequestration or biodiversity gains... confidence is very low and a
  conservative estimate is appropriate."

This is the contract correctly refusing to inflate confidence on weak,
non-project-specific evidence — the exact abstention behavior it was built
for, observed on real infrastructure, not asserted.

A second, unrelated real run (via the automated integration test) used a
stronger evidence case (a real, on-topic Wikipedia page fetched during a full
create → evidence → review cycle) and settled in **229.63s** with **5
validators voting MAJORITY_AGREE → ACCEPTED**.

## Evidence

- **Live app:** https://carbontrust0.vercel.app
- **GitHub (full source):** https://github.com/lolaaa00/carbontrust
- **Deployed contract:** `0x6B83B4f0c9584D631525eD109d72E613aCF7b3F6`
- **Explorer:** https://explorer-studio.genlayer.com/address/0x6B83B4f0c9584D631525eD109d72E613aCF7b3F6
- **Decision record:** [docs/DECISION_RECORD.md](docs/DECISION_RECORD.md)
- **Architecture:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Contract reference:** [docs/CONTRACT.md](docs/CONTRACT.md)

## Tests

- `genvm-lint`: clean, 0 errors
- 30/30 direct-mode contract tests passing (`tests/contract/`)
- 1/1 integration test passing against real StudioNet consensus
  (`tests/integration/`), 229.63s, real validators
- `npm run verify:schema`: every frontend call matches the deployed contract

## Honest limits

- Native GEN (value/staking/escrow) is not used in this contract — a
  deliberate scope choice, explained in the decision record, with the
  natural extension (escrow tied to verdicts) named there
- Evidence `content_hash` is stored and shown to the model as a claim but not
  independently verified against fetched bytes
- StudioNet enforces an undocumented 30 requests/minute rate limit; the
  frontend does not yet show a friendly message if a user's actions trigger it
- No demo video yet

---

*Contract redeployed at the address above after fixes found by actually
running tests against live infrastructure — including an access-control bug
where evidence submission was incorrectly owner-only, contradicting both the
frontend and the evidence-type set itself (`third_party_audit`,
`community_observation`).*
