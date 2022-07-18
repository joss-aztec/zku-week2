import "@rainbow-me/rainbowkit/styles.css";
import {
  RainbowKitProvider,
  wallet,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit";
import { configureChains, createClient, WagmiConfig, chain } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import React from "react";

const { chains, provider, webSocketProvider } = configureChains(
  [chain.localhost],
  [
    jsonRpcProvider({ rpc: () => ({ http: "http://localhost:8545" }) }),
    publicProvider(),
  ]
);

const connectors = connectorsForWallets([
  { groupName: "Supported", wallets: [wallet.metaMask({ chains })] },
]);

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

export function RainbowAndWagmiProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  );
}
