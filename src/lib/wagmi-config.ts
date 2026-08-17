import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { defineChain } from "viem";

export const robinhoodTestnet = defineChain({
  id: 46630,
  name: "Robinhood Chain Testnet",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.testnet.chain.robinhood.com"] },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://explorer.testnet.chain.robinhood.com",
    },
  },
  testnet: true,
});

// WalletConnect Project IDs are publishable client identifiers (not secrets),
// so a hardcoded default keeps the app booting even without an env override.
const DEFAULT_WALLETCONNECT_PROJECT_ID = "be9bcbf74fc2ea216bd558ee88a70feb";

const projectId =
  (import.meta.env["VITE_WALLETCONNECT_PROJECT_ID"] as string | undefined) ||
  DEFAULT_WALLETCONNECT_PROJECT_ID;


export const wagmiConfig = getDefaultConfig({
  appName: "AZOX Gaming Hub",
  projectId,
  chains: [robinhoodTestnet],
  ssr: true,
});
