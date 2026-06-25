# CarbonTrust Protocol - Architecture

## Overview
CarbonTrust is a decentralized environmental intelligence platform powered by GenLayer
Intelligent Contracts and AI consensus.

## Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS, shadcn/ui
- **Wallet**: wagmi v2, RainbowKit, viem
- **Contract**: GenLayer Intelligent Contract (Python)
- **Deployment**: Vercel (frontend), StudioNet (contract)

## Architecture
- No backend server
- No centralized database
- Contract is the canonical source of truth
- Frontend reads/writes contract state via wallet
