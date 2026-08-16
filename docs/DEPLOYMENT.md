# CarbonTrust Protocol - Deployment Guide

## Contract (StudioNet) — DEPLOYED

**Contract Address:** `0x6B83B4f0c9584D631525eD109d72E613aCF7b3F6`

**Explorer:** https://explorer-studio.genlayer.com

**Verification:**
1. Visit https://explorer-studio.genlayer.com
2. Search for `0x6B83B4f0c9584D631525eD109d72E613aCF7b3F6`
3. Verify contract methods and state

## Frontend (Vercel)

### Deploy Steps
1. Push this repo to GitHub
2. Go to https://vercel.com/new
3. Import the GitHub repository
4. Set framework preset to **Next.js**
5. Add environment variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_GENLAYER_RPC_URL` | `https://studio.genlayer.com/api` |
| `NEXT_PUBLIC_GENLAYER_CHAIN_ID` | `61999` |
| `NEXT_PUBLIC_GENLAYER_EXPLORER_URL` | `https://explorer-studio.genlayer.com` |
| `NEXT_PUBLIC_CONTRACT_ADDRESS` | `0x6B83B4f0c9584D631525eD109d72E613aCF7b3F6` |

6. Click Deploy

### Post-Deploy Verification
1. Visit the deployed URL
2. Connect MetaMask wallet
3. Verify network switches to GenLayer StudioNet (Chain ID 61999)
4. Navigate to Explore page — should load projects from contract
5. Create a test project to verify write operations

## Local Development

```bash
npm install --force
npm run dev
```

Open http://localhost:3000
