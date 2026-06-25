# CarbonTrust Protocol

Decentralized environmental intelligence and carbon-impact consensus network.

CarbonTrust transforms public environmental evidence into transparent,
confidence-scored impact assessments using a GenLayer Intelligent Contract.

## Features

- Register environmental projects and their impact claims
- Attach public evidence with optional SHA-256 integrity hashes
- Request AI-validator consensus assessments
- Review carbon estimates, confidence, biodiversity, and risk indicators
- Browse projects and assessment history on-chain

## Stack

- Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui
- GenLayerJS and MetaMask
- GenLayer Intelligent Contract written in Python
- GenLayer StudioNet

## Getting Started

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

The supplied `.env.example` configures:

- GenLayer StudioNet RPC
- Chain ID `61999`
- GenLayer explorer
- Deployed CarbonTrust contract

Use a test-only wallet when interacting with StudioNet.

## Build

```bash
npm run build
```

## Contract Tests

```bash
pip install genlayer-test pytest
pytest tests/contract/ -v
```

## Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [Contract](docs/CONTRACT.md)
- [Deployment](docs/DEPLOYMENT.md)

## License

MIT
