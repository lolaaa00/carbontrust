# CarbonTrust Protocol — Submission

## What it does

CarbonTrust turns a claimed environmental outcome — a reforestation project, a
mangrove restoration, a renewable build-out — into a confidence-scored,
source-attested verdict instead of a self-reported number. A project owner
registers a claim and attaches public evidence URLs (satellite imagery,
audits, government permits, surveys). Anyone can request a review; the
GenLayer contract fetches each evidence URL itself, verifies its integrity,
and asks an independent validator set to judge it. A result is only written
once validators reach equivalence on the verdict.

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

## Reviewer feedback — corrections made

The team requested: verify response status, content hashes, source identity,
and binary evidence before presenting the assessment as source-attested, and
connect the agreed result to a concrete contested consequence.

### The architectural fix

The core problem was that fetch facts (`fetch_status`, `http_status`,
`hash_match`) were being asked of the model inside `exec_prompt` — the model
could omit or rewrite them. The fix is structural:

Inside the `evaluate()` closure, all evidence URLs are fetched first. The
response objects are used to compute a `fetch_records` dict of authoritative
facts **before** the model is called. After `exec_prompt` returns,
`_bind_source_findings()` overwrites the model's source_findings with the
values from `fetch_records`. The model can only influence semantic fields
(`source_alignment`, `credibility`, `key_observation`) — it cannot override
what the contract actually observed.

### HTTP response status

Non-200 responses immediately set `fetch_status: "failed"` with a clear
message. The model prompt includes explicit scoring rules: 4xx = broken or
access-denied, 5xx = server fault, both reduce credibility to unknown.
**The stored finding always reflects the real HTTP status, not the model's
claim about it.**

### Content hash from raw bytes

`content_hash` on evidence records is now verified against the actual fetched
body. The hash is computed via `_safe_raw_body()` which returns raw bytes
**before** any UTF-8 decoding — computing the hash from already-decoded text
would produce a different result than a hash declared against the raw file.
Each source finding carries `hash_match: match | mismatch | not_provided`.
A mismatch signals tampering or link rot. **The hash result comes from the
response object, not from the model.**

### Source identity

The domain of the fetched URL is extracted from the actual URL and stored as
`fetched_domain` in every finding. It is surfaced to the model in the prompt
so it can reason about mismatches (declared "NASA Satellite Data" but fetched
from a personal blog), but the domain value in the stored finding is bound
from the URL — the model cannot change it.

### Binary evidence (PDFs, images)

Content-Type is read from the response. Binary responses (PDF, image/*,
audio/*, video/*, octet-stream) get `fetch_status: "binary"` — text extraction
is skipped, the hash match still runs as the sole integrity check, and the
model prompt addresses binary evidence scoring explicitly: without a matching
hash, binary evidence must be treated as unverifiable (credibility: unknown).

### Concrete contested consequence

`request_review` now sets project status based on the agreed verdict:

- `high_confidence` → `verified`
- `high_fraud_risk` → `flagged` — permanently locked. No further evidence
  submissions, monitoring records, or re-review requests are permitted. The UI
  shows a fraud banner and hides Add Evidence on flagged projects.
- All other verdicts → `assessed` (retryable with new evidence)

## How to use it

1. Visit the live URL below
2. No wallet needed to browse — Explore works read-only
3. To write: connect MetaMask, or click "Continue without a wallet" for an
   instant browser-generated identity (acknowledge the one-time warning, it's
   not custody-grade)
4. Create a project, attach evidence URLs (optionally with SHA-256 hashes for
   integrity verification), request a review, watch it move through real
   GenLayer consensus stages in the UI

## Live measured results

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

A second run via the automated integration test used a stronger evidence case
(a real, on-topic Wikipedia page fetched during a full create → evidence →
review cycle) and settled in **229.63s** with **5 validators voting
MAJORITY_AGREE → ACCEPTED**.

## Evidence

- **Live app:** https://carbontrust0.vercel.app
- **GitHub (full source):** https://github.com/lolaaa00/carbontrust
- **Deployed contract:** `0x75cD4D068C6f15e780f6c6e6d8c32Fca26b3045F`
- **Explorer:** https://explorer-studio.genlayer.com/address/0x75cD4D068C6f15e780f6c6e6d8c32Fca26b3045F
- **Decision record:** [docs/DECISION_RECORD.md](docs/DECISION_RECORD.md)
- **Architecture:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Contract reference:** [docs/CONTRACT.md](docs/CONTRACT.md)

## Tests

- `genvm-lint`: clean, 0 errors (11 methods, 4 write / 7 view)
- **41/41** direct-mode contract tests passing (`tests/contract/`) — including:
  - `TestSourceAssurance`: 404 response forces `fetch_status: failed` regardless
    of model output; SHA-256 from raw bytes gives `hash_match: match`;
    wrong declared hash gives `hash_match: mismatch`; `fetched_domain` matches
    URL domain not model claim; findings present for all fetched items even when
    model omits them entirely
  - `TestContestedConsequences`: `high_fraud_risk` → `flagged` + evidence lock;
    `high_confidence` → `verified`; flagged project rejects re-review
- 1/1 integration test passing against real StudioNet consensus
  (`tests/integration/`), 229.63s, real validators, real URL fetch
- `npm run verify:schema`: every frontend call matches the deployed contract

## Honest limits

- **Binary content-type detection requires a real server.** `gltest`'s
  `mock_web` does not forward `content-type` headers to the response object,
  so `fetch_status: "binary"` is verified in the integration test (real server)
  rather than direct mode. The contract logic is in place and tested with real
  responses.
- **Native GEN is not used.** A deliberate scope choice explained in the
  decision record, with the natural extension (escrow tied to verdicts) named
  there.
- **StudioNet's 30 req/min rate limit is real and undocumented.** Discovered by
  hitting it directly during integration testing. The frontend does not yet
  show a friendly message if a user's actions trigger it.
- **No demo video yet.**

---

*Contract source at `contracts/carbon_trust_protocol.py`. The source assurance
architecture — `_fetch_with_assurance` computing authoritative facts from raw
responses, `_bind_source_findings` overriding model output with those facts —
is the core of what makes the assessment source-attested rather than
model-reported.*
