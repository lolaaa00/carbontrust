export const GENLAYER_CHAIN = {
  id: 61999,
  name: "GenLayer StudioNet",
  currency: {
    name: "GEN Token",
    symbol: "GEN",
    decimals: 18,
  },
  rpcUrl: "https://studio.genlayer.com/api",
  explorerUrl: "https://explorer-studio.genlayer.com",
  testnet: true,
} as const;

export const GENLAYER_CHAIN_ID_HEX = `0x${GENLAYER_CHAIN.id.toString(16)}` as const;
