# Decision Record

This record documents the idea space CarbonTrust was chosen from and checks it against
the submission gates. It is written after the initial build, not before — that is worth
saying plainly rather than pretending otherwise, and the self-audit at the end reflects
that honestly.

## Candidates considered

1. **CarbonTrust** (chosen) — evidence-backed environmental impact assessment. Owners
   submit project claims and public evidence URLs; a consensus round fetches that
   evidence and produces a banded verdict (confidence, carbon-estimate range, fraud
   risk, biodiversity impact). Capability: web fetch + LLM judgment.
2. **On-chain grant/RFP escrow with staked disputes** — a funder deposits GEN into an
   escrow tied to a milestone claim; a grantee submits evidence of completion; consensus
   judges whether the milestone was met and releases or slashes the stake. Capability:
   native GEN (escrow, slashing) + web fetch + LLM judgment.
3. **Reputation-staked marketplace reviews** — reviewers stake GEN behind a review;
   consensus fetches the linked receipt/order page and judges whether the review is
   consistent with real evidence of a purchase, slashing stakes behind unsupported
   reviews. Capability: native GEN (staking, slashing) + web fetch.
4. **Document-photo insurance claims triage** — a claimant uploads a photo of visible
   damage; consensus uses `exec_prompt(images=[...])` to assess severity against the
   claimed damage description and a policy's covered-peril list. Capability: images.
5. **Satellite/aerial change-detection auditor** — periodic monitoring photos of a site
   (deforestation, construction, mining) compared against prior submissions using
   image-based nondet review to flag material change. Capability: images + web fetch.
6. **Semantic duplicate-claim detector using on-chain embeddings** — before a project can
   register a claim, `genlayer_embeddings`/`VecDB`/`knn` checks it against previously
   registered claims for semantic overlap (same land parcel claimed twice under
   different wording), flagging likely duplicates for human review. Capability:
   embeddings/VecDB.
7. **Cross-contract audit trail for existing EVM carbon-credit tokens** — a factory
   contract that reads an existing ERC-20-style credit token's on-chain history via EVM
   interop and produces an independent consensus opinion on whether issuance events
   match the token's stated methodology, without trusting the token issuer's own
   metadata. Capability: EVM interop, cross-contract composition.
8. **Community fact-check bounty pool** — anyone can post a GEN bounty behind a
   fact-checkable public claim (e.g. "this news article's central statistic is
   accurate"); consensus fetches cited sources and judges the claim, paying the bounty
   to whichever side (poster or a challenger) consensus agrees with. Capability: native
   GEN (bounty pool, payout) + web fetch + LLM judgment.

**Capability spread across the set:** web fetch appears in 5 of 8; native GEN in 3 (#2,
#3, #8); images in 2 (#4, #5); embeddings/VecDB in 1 (#6); EVM interop in 1 (#7). At
least three distinct capabilities and at least two value-bearing candidates are
represented, per the spread requirement — though the chosen idea itself (CarbonTrust)
does not use native GEN. That is a real gap, called out below rather than glossed over.

## Why CarbonTrust, not #2 or #8 (the value-bearing alternatives)

#2 and #8 are structurally stronger demonstrations of "why a blockchain" — money and
judgment sharing a trust domain is the hardest case to fake. CarbonTrust was chosen
instead because the underlying problem (trusting a claimed environmental outcome) is one
with a real, identifiable stakeholder gap today — carbon-credit buyers, grant funders,
and land regulators currently rely on self-reported claims or a single paid auditor —
and because it does not require also designing a safe, testable value-custody model in
the same pass. In hindsight, per Gate F below, the two ideas are not mutually exclusive:
CarbonTrust's assessment step is a natural precursor to a future escrow/insurance layer
built on top of its verdicts (see "Path beyond submission").

## Self-audit

- **Distinct capabilities actually represented in the set:** 5 (web fetch, native GEN,
  images, embeddings/VecDB, EVM interop) — not just "fetch a web page and judge it"
  repeated eight times.
- **Which two candidates are really the same idea twice:** #3 and #8 are both
  "stake GEN behind a claim, consensus judges it, stake moves accordingly" — a
  reputation-marketplace variant and a bounty-pool variant of the same escrow-and-judge
  pattern. #2 is a third variant of that same pattern applied to grant milestones.
  Three of the eight are the same underlying mechanic with different UI framing, which
  is a real observation, not a comfortable one.
- **What would have been picked if web access did not exist:** #4 (image-based insurance
  triage) or #6 (embeddings duplicate-detector) — both stand on their own without any
  `web.get` call, which is evidence the set wasn't purely a "fetch a page" default.
- **Honest gap:** CarbonTrust never touches native GEN. The value-bearing alternatives
  (#2, #3, #8) exist in this record specifically so that omission is visible, not
  hidden. If this project continues past submission, the most natural extension is
  wiring #2's escrow pattern on top of CarbonTrust's existing verdicts (see below).

## Gates

- **Gate A — counterfactual.** Delete GenLayer: a single reviewer, or the project owner
  themselves, would decide whether a claimed environmental outcome is credible, and
  every counterparty (credit buyer, regulator, funder) would have to trust that single
  party's judgment with no fetched, verifiable evidence trail. That is the exact failure
  mode the gate asks about.
- **Gate B — two distrusting parties.** Project owners (incentivized to claim the
  strongest possible impact) vs. anyone relying on the assessment (credit buyers,
  funders, regulators, the public) — their interests are opposed by construction.
- **Gate C — irreducibly semantic.** "Does this evidence support this carbon/biodiversity
  claim" cannot be answered by a regex or a price feed; it requires reading fetched
  content, weighing source credibility, and judging additionality and permanence risk.
- **Gate D — evidence the contract fetches itself.** `_fetch_public_evidence` calls
  `gl.nondet.web.get(url)` contract-side for every submitted evidence URL (capped at 12
  per review); user-submitted metadata is never treated as fact on its own.
- **Gate E — would a stranger use this twice?** Yes for the intended user (a project
  owner adding evidence over time, or a credit buyer checking multiple projects before
  buying) — monitoring records exist specifically so a project accumulates evidence
  across multiple periods, not just a single one-shot claim.
- **Gate F — path beyond submission.** The most direct extension is value: wrap
  `request_review`'s verdict in an escrow/insurance layer (candidate #2 above) where a
  `high_confidence` verdict releases funds and a `high_fraud_risk` verdict triggers a
  refund or slashing path. That reuses the existing consensus logic rather than
  replacing it.
- **Gate G — latency budget.** One nondet round, one equivalence-principle comparison,
  up to 12 fetches. Per the spec's measured StudioNet numbers this lands in the
  multi-minute range, not multi-round — `request_review` is deliberately a separate
  transaction from evidence submission, so a user filling in a form is never the one
  waiting on validators.
