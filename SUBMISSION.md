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

## Reviewer feedback — corrections made (v0.3.0)

The team requested improvements to source assurance: verify response status,
content hashes, source identity, and binary evidence before presenting the
assessment as source-attested, and connect the agreed result to a concrete
contested consequence. All four were addressed and redeployed.

### HTTP response status verification

**Before:** Non-200 responses passed through as "fetched" regardless of status
code. The model received the body (or an empty string) with no penalty applied.

**After:** The HTTP status code is now parsed. Any non-200 response immediately
sets `fetch_status: "failed"` with a clear error message. The model prompt
includes explicit scoring rules: 4xx means broken/access-denied (credibility:
unknown), 5xx means server fault — both reduce evidence quality toward
insufficient.

### Content hash verification

**Before:** `content_hash` on evidence records was stored on-chain and shown to
the model as claimed metadata. Nothing verified it against the actual fetched
bytes.

**After:** At fetch time, the contract SHA-256-hashes the actual response body
and compares it to the declared hash. Each source finding in the assessment now
carries `hash_match: match | mismatch | not_provided`. A mismatch signals
tampering or link rot and is surfaced to the model as a credibility flag. The
UI renders hash match results in the Source Assurance section of every
assessment.

### Source identity cross-check

**Before:** The submitter-declared `source_name` (e.g. "NASA Satellite Data")
was shown to the model but never checked against what was actually fetched.

**After:** The domain of the fetched URL is extracted and surfaced alongside the
declared source name in the model's prompt. The model is explicitly instructed
to treat clear mismatches (e.g. declared "NASA" but fetched from a personal
blog) as a credibility flag.

### Binary evidence (PDFs, images)

**Before:** PDFs and images returned binary bytes that `_safe_body` decoded as
garbled text or an empty string, silently. The model had no way to know the
content was unreadable.

**After:** Content-Type is read from the response. Binary responses (PDF,
image/*, audio/*, video/*, octet-stream) get `fetch_status: "binary"` — text
extraction is skipped, the hash match still runs as the sole integrity check,
and the model prompt addresses binary evidence scoring explicitly: without a
matching hash, binary evidence must be treated as unverifiable (credibility:
unknown).

### Concrete contested consequence

**Before:** Every project ended in `status: "assessed"` regardless of verdict.
The consensus result was written to storage and displayed, but nothing changed
in response to it.

**After:** `request_review` now sets project status based on the agreed verdict:

- `high_confidence` → `verified`
- `high_fraud_risk` → `flagged` — permanently locked. No further evidence
  submissions or re-review requests are permitted once validators agree on
  fraud. The UI shows a fraud banner and hides Add Evidence on flagged
  projects.
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
- **Deployed contract (v0.3.0):** `0x024a1A94060BF56Ec36F219CD9f665ABF820d094`
- **Explorer:** https://explorer-studio.genlayer.com/address/0x024a1A94060BF56Ec36F219CD9f665ABF820d094
- **Decision record:** [docs/DECISION_RECORD.md](docs/DECISION_RECORD.md)
- **Architecture:** [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)
- **Contract reference:** [docs/CONTRACT.md](docs/CONTRACT.md)

## Tests

- `genvm-lint`: clean, 0 errors (11 methods, 4 write / 7 view)
- 30/30 direct-mode contract tests passing (`tests/contract/`) — including
  invented-evidence-ID filtering, fetch path with `mock_web`, and graceful
  failure on unmocked fetches
- 1/1 integration test passing against real StudioNet consensus
  (`tests/integration/`), 229.63s, real validators, real URL fetch
- `npm run verify:schema`: every frontend call matches the deployed contract

## Honest limits

- **Binary content hash covers integrity, not semantics.** For PDFs and images,
  the contract records `fetch_status: "binary"` and runs the hash check. A
  matching hash confirms the file has not changed since it was declared; it does
  not tell the model what the file contains.
- **Native GEN is not used.** A deliberate scope choice explained in the
  decision record, with the natural extension (escrow tied to verdicts) named
  there.
- **StudioNet's 30 req/min rate limit is real and undocumented.** Discovered by
  hitting it directly during integration testing. The frontend does not yet show
  a friendly message if a user's actions trigger it.
- **No demo video yet.**

---

*Contract redeployed to v0.3.0 at the address above after addressing all
reviewer feedback on source assurance. Prior version (v0.2.18) was itself a
redeploy after fixes found by running real infrastructure tests: an
access-control bug where evidence submission was incorrectly owner-only, and
Unicode characters in contract comments that broke schema fetch over the wire.*
