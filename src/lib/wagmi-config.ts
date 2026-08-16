import { createConfig, http, cookieStorage, createStorage } from "wagmi";
import { defineChain } from "viem";
import { injected, walletConnect, coinbaseWallet } from "wagmi/connectors";

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

const projectId =
  (import.meta.env["VITE_WALLETCONNECT_PROJECT_ID"] as string | undefined) ??
  "b3ce19879c40d8676152b270ce496113";

export const hasWalletConnect = Boolean(projectId);

const connectors = [
  injected(),
  ...(projectId ? [walletConnect({ projectId, showQrModal: true })] : []),
  coinbaseWallet({ appName: "AZOX Gaming Hub" }),
];

export const wagmiConfig = createConfig({
  chains: [robinhoodTestnet],
  connectors,
  ssr: true,
  storage: createStorage({ storage: cookieStorage }),
  transports: {
    [robinhoodTestnet.id]: http("https://rpc.testnet.chain.robinhood.com"),
  },
});
