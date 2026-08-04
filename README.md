# CarbonTrust Protocol

Decentralized environmental intelligence and carbon-impact consensus network.

CarbonTrust transforms public environmental evidence into transparent,
confidence-scored impact assessments using a GenLayer Intelligent Contract. A
project owner registers a claim (a reforestation effort, a renewable energy
build-out, a wetland restoration), attaches public evidence URLs, and requests a
review. The contract fetches that evidence itself and asks an AI validator set to
judge it — carbon estimate range, confidence, additionality, fraud risk,
biodiversity impact — with the result only accepted once independent validators
reach equivalent conclusions.

## Why this needs GenLayer, not a backend

Delete the consensus layer and you're left with one of two shapes: either the
project owner scores their own claim (obviously untrustworthy — they're
incentivized to claim the strongest possible impact), or a single centralized
reviewer scores it on a server somewhere, and every credit buyer, funder, or
regulator relying on that number has to trust that one party and has no way to
verify the reasoning. Neither is what a carbon-impact assessment needs to be
useful to a stranger. Judging whether fetched evidence supports a claimed
environmental outcome is also irreducibly semantic — it requires reading source
content and weighing credibility, not parsing a value out of a price feed. See
[docs/DECISION_RECORD.md](docs/DECISION_RECORD.md) for the fuller gate-by-gate
reasoning and the alternative ideas this was chosen over.

## How consensus is used

`request_review` runs exactly one non-deterministic round:

1. `gl.nondet.web.get` fetches every submitted evidence URL contract-side
   (capped at 12 per review) — evidence content is never trusted from the
   submitter, it's fetched and read directly
2. `gl.nondet.exec_prompt` asks the model to assess the project against that
   fetched content plus on-chain metadata, returning a banded/enumerated verdict
   (not a raw float) — confidence in 0-100, verdict as one of five categories,
   risk as low/medium/high/critical, etc.
3. Validators compare results using `gl.eq_principle.prompt_comparative` against
   an 11-rule prose equivalence principle, so wording can differ but the
   directional judgment can't:

   > Two CarbonTrust assessments are equivalent if they reach the same
   > directional environmental judgment. verdict must match exactly, except
   > moderate_confidence and low_confidence may be considered equivalent when
   > confidence_score differs by 15 or fewer points. carbon_estimate_likely must
   > be within 35 percent when both estimates are above zero. confidence_score
   > must be within 15 points. [...] reasoning may differ in wording, but must
   > not contradict the core verdict, risk, confidence, additionality, or fraud
   > conclusions.

   Full text in `_evaluate_environmental_evidence` in
   [contracts/carbon_trust_protocol.py](contracts/carbon_trust_protocol.py).

Everything else — creating a project, submitting evidence, submitting a
monitoring record, access control, storage, status transitions — is
deterministic. That's deliberate: the model is only ever asked what the fetched
evidence says, never what the contract should do next. Deterministic gatekeeping
around a narrow, justified non-determinism budget (two `gl.nondet.*` calls per
review) is what makes the one nondet round trustworthy rather than a black box.

`insufficient_evidence` is a first-class verdict, not a forced guess — weak,
conflicting, or unfetchable evidence is preserved as uncertainty rather than
resolved into false confidence.

## Two-wallet model

- **Injected wallet** (MetaMask or any EIP-1193 provider) is used when present —
  `connect()` requests accounts, switches/adds the GenLayer StudioNet chain, and
  signs locally.
- **No injected wallet** → a browser-generated account (`generatePrivateKey` /
  `createAccount` from `genlayer-js`) is created after an explicit warning is
  acknowledged, persisted in `localStorage`, and used immediately — zero
  friction, no extension required. Export/import let you move the key to
  another device; it is explicitly *not* custody-grade, and the UI says so
  before it's used.
- Reads and writes always share one identity: whichever mode is active supplies
  both the address the UI displays and the client that signs writes. See
  `src/components/wallet/wallet-provider.tsx`.

## Transaction lifecycle

Writes are polled through the real GenLayer consensus stages — PROPOSING,
COMMITTING, REVEALING, ACCEPTED/FINALIZED — rather than a single generic
spinner (`src/components/shared/transaction-status.tsx`,
`src/lib/wallet/hooks.ts`'s `useTransactionFlow`). `UNDETERMINED`,
`VALIDATORS_TIMEOUT`, and `LEADER_TIMEOUT` are surfaced as retryable outcomes
with a Retry action, not failures — nothing was written in those cases.
`ACCEPTED` is shown as still-appealable; only `FINALIZED` is final.

## Features

- Register environmental projects and their impact claims
- Anyone can attach public evidence to any project — not just the owner. Evidence
  types include `third_party_audit` and `community_observation`, which only make
  sense coming from someone other than the project owner
- Attach public evidence with optional content hashes (stored and shown to the
  model as claimed metadata; not independently verified against fetched bytes —
  see Honest limits)
- Owner-only: attach ongoing monitoring records against a project over time
- Owner-only: request AI-validator consensus assessments
- Review carbon estimates, confidence, biodiversity, and risk indicators
- Browse projects and assessment history on-chain, with deep links to every
  project (`/projects/[id]`) and assessment (`/consensus/[id]`)
- Read-only browsing works with no wallet connected at all

## Stack

- Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- `genlayer-js` — no wagmi, RainbowKit, or viem
- GenLayer Intelligent Contract written in Python
- GenLayer StudioNet

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full breakdown.

## Getting Started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3003](http://localhost:3003).

## Environment

The supplied `.env.example` configures:

- GenLayer StudioNet RPC
- Chain ID `61999`
- GenLayer explorer
- Deployed CarbonTrust contract: `0x990BF630724c1B636b19412B97Dc75F3F79CEFC7`
  ([view on explorer](https://explorer-studio.genlayer.com))

Use a test-only wallet when interacting with StudioNet.

## Build

```bash
npm run build
```

## Verify the frontend matches the deployed contract

```bash
npm run verify:schema
```

Fetches the real on-chain schema via `getContractSchema` and checks every
`functionName`/arity used in `src/lib/contract/{reads,writes}.ts` against it.
Run this after any contract redeploy, before submitting.

## Contract Tests

The system Python on most machines is too old for the GenLayer toolchain
(`genlayer_py` needs 3.12+). Use [uv](https://docs.astral.sh/uv/) to get an
isolated, correct interpreter without touching system Python:

```bash
uv venv .venv --python 3.12
uv pip install --python .venv/bin/python genlayer-test genvm-linter pytest
PYTHONIOENCODING=utf-8 .venv/bin/genvm-lint check contracts/carbon_trust_protocol.py --json
PYTHONIOENCODING=utf-8 .venv/bin/python -m pytest tests/contract/ -v
```

Both have been run and pass as of this writing: `genvm-lint` reports `ok: true`
(11 methods, 4 write / 7 view, zero errors — one informational note that a
newer `py-genlayer` runner exists). `tests/contract/test_carbon_trust.py` has
**30 passing direct-mode tests**, including the evidence-fetch path (`mock_web`,
both a successful fetch and an unmocked/failed one) and a check that the
contract discards a model-invented `evidence_id` in `source_findings` rather
than trusting it.

`tests/integration/` (real StudioNet consensus via `gltest --network
studionet`) does not exist yet — direct-mode tests only. Real consensus runs
take minutes each; run that pass separately before submitting and record the
result here.

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Contract](docs/CONTRACT.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Decision record](docs/DECISION_RECORD.md) — the idea space this was chosen
  from and how it clears the submission gates

## Honest limits

- **No live frontend URL yet.** The contract is deployed to StudioNet (address
  above); the frontend has not yet been deployed to Vercel and verified end to
  end on a public URL. Deploy steps are in
  [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
- **Content hashes aren't verified.** `content_hash` on evidence and monitoring
  records is stored and shown to the model as claimed metadata, but nothing in
  the contract computes a hash of the fetched body and compares it — treat it
  as a claim, not a proof, until that's added.
- **No monitoring-record UI yet.** `add_monitoring_record` and
  `get_monitoring_records` exist on the contract and are wired in
  `src/lib/contract/{reads,writes}.ts`, but there is no form/page to submit one
  from the frontend yet — only project creation and evidence submission have UI.
- **No integration tests against real StudioNet consensus yet.** `genvm-lint`
  and 30 direct-mode tests pass (see Contract Tests above); a `gltest
  tests/integration/ --network studionet` pass exercising real multi-minute
  consensus has not been written or run.
- **No demo video or public post yet.**
- **Native GEN is not used anywhere in this contract.** The decision record
  names value-bearing alternatives that were considered and why this one was
  picked over them; extending `request_review`'s verdict into an escrow/refund
  path is the natural next step if this continues past submission.

## License

MIT
