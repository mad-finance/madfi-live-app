import { connectorsForWallets, getDefaultWallets } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig } from "wagmi";
import { polygon, polygonMumbai } from "viem/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import { IS_PRODUCTION, JSON_RPC_URL_ALCHEMY_MAP } from "@/lib/consts";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!;

export const { chains, publicClient, webSocketPublicClient } = configureChains(
  IS_PRODUCTION ? [polygon] : [polygonMumbai],
  [
    jsonRpcProvider({ rpc: (chain) => ({ http: JSON_RPC_URL_ALCHEMY_MAP[chain.id] }) }),
    publicProvider(),
  ],
);

const { wallets } = getDefaultWallets({
  appName: "MadFi",
  projectId,
  chains,
});

const connectors = connectorsForWallets([...wallets]);

export const appInfo = { appName: "MadFi" };

export const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});
