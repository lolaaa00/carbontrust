# CarbonTrust Protocol - Architecture

## Overview
CarbonTrust is a decentralized environmental intelligence platform powered by GenLayer
Intelligent Contracts and AI consensus.

## Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Wallet**: `genlayer-js`, hand-rolled two-path provider (`src/components/wallet/wallet-provider.tsx`) —
  injected EIP-1193 wallet (MetaMask etc.) via `window.ethereum`, or a browser-generated
  account (`generatePrivateKey`/`createAccount`) persisted in `localStorage` when none is
  installed. No wagmi, RainbowKit, or viem dependency.
- **Contract**: GenLayer Intelligent Contract (Python), `contracts/carbon_trust_protocol.py`
- **Deployment**: Vercel (frontend), GenLayer StudioNet (contract)

## Architecture
- No backend server, no route handlers holding state
- No centralized database — the contract is the canonical source of truth
- Frontend reads/writes contract state directly via `genlayer-js`'s `createClient`
- Reads use a shared read-only client (`src/lib/contract/client.ts`); writes use whichever
  client the active wallet mode produced, so the address the UI displays is always the
  address that signs

## Non-determinism

`request_review` is the only path that touches consensus. It runs one non-deterministic
round (`gl.eq_principle.prompt_comparative`) that:
1. Fetches each submitted evidence URL contract-side (`gl.nondet.web.get`, capped at 12
   fetches per review)
2. Asks the model to assess the project against that fetched content plus on-chain
   metadata (`gl.nondet.exec_prompt`)
3. Validators compare results using an 11-rule equivalence principle (banded verdicts and
   numeric ranges, not exact-string matching) before the result is written

Everything else — project/evidence/monitoring-record creation, access control, storage,
status transitions — is deterministic.
