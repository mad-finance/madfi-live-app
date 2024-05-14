import { IS_PRODUCTION } from '../lib/consts';

const MADFI_TESTNET_SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/mad-finance/testnet-madfi-subgraph";
const MADFI_SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/mad-finance/madfi-subgraph";

export const apiUrls = {
  lensAPI: IS_PRODUCTION ? "https://api-v2.lens.dev" : "https://api-v2-mumbai.lens.dev",
  pinataGateway: "https://madfinance.mypinata.cloud/ipfs",
  ipfs: "https://ipfs.io/ipfs",
  soundxyz: "https://api.sound.xyz/graphql",
  lensGateway: "https://lens.infura-ipfs.io/ipfs",
  madfiSubgraph: IS_PRODUCTION ? MADFI_SUBGRAPH_URL : MADFI_TESTNET_SUBGRAPH_URL,
};
