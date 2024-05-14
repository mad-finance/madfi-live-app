import { env } from "@/env.mjs";
import { polygon, polygonMumbai } from "viem/chains";

export const IS_PRODUCTION = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";
export const APP_NAME = "MadFi";
export const VALID_CHAIN_ID = IS_PRODUCTION ? 137 : 80001; // for common lens stuff
export const VALID_CHAIN = IS_PRODUCTION ? polygon : polygonMumbai;

export const REDIS_SPACE_PREFIX = "space_v2";
export const REDIS_STREAM_PREFIX = "stream";

// [seconds] 2hr exp for spaces; once the key is gone, the space has ended
export const REDIS_SPACE_EXP = 7200;

export const LOCALSTORAGE_DEFAULT_PROFILE_ID = "DEFAULT_PROFILE_ID";
export const NEXT_PUBLIC_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://live.madfi.xyz";
export const LENSTER_URL = IS_PRODUCTION ? "https://hey.xyz" : "https://testnet.hey.xyz";
export const MADFI_SITE_URL = IS_PRODUCTION ? 'https://madfi.xyz' : 'https://testnet.madfi.xyz';
export const MADFI_BANNER_IMAGE_SMALL =
  "https://link.storjshare.io/raw/jvnvg6pove7qyyfbyo5hqggdis6a/misc%2Fmadfi-banner.jpeg";

export const LENS_HUB_V2_PREVIEW_ADDRESS = '0xC1E77eE73403B8a7478884915aA599932A677870';
export const LENSHUB_PROXY = IS_PRODUCTION
  ? "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"
  : LENS_HUB_V2_PREVIEW_ADDRESS; // TODO: they might change this after the migration

export const FREE_COLLECT_MODULE = IS_PRODUCTION
  ? "0x23b9467334bEb345aAa6fd1545538F3d54436e96"
  : "0x0BE6bD7092ee83D44a6eC1D949626FeE48caB30c";

export const VERIFIER_ADDRESS = IS_PRODUCTION
  ? "0xd78722b20b3215975184e50519e5703163f7c7f4"
  : "0xD643ed715d367d63Eec28272c3ED70a755A1Dc70";

// polygon
export const MULTIRECIPIENT_COLLECT_MODULE = '0xfa9dA21D0A18C7B7dE4566481c1e8952371F880a';

export const LIVEPEER_STUDIO_API = "https://livepeer.studio/api";
export const MADFI_API_URL = process.env.MADFI_API_URL || "api.madfi.xyz";

export const SPACE_API_URL = env.NEXT_PUBLIC_SPACE_API_URL;

export const JSON_RPC_URL_POKT = IS_PRODUCTION
  ? process.env.NEXT_PUBLIC_POKT_RPC_POLYGON
  : process.env.NEXT_PUBLIC_POKT_RPC_MUMBAI;

export const JSON_RPC_URL_ALCHEMY = IS_PRODUCTION
  ? process.env.NEXT_PUBLIC_ALCHEMY_RPC_POLYGON
  : process.env.NEXT_PUBLIC_ALCHEMY_RPC_MUMBAI;

export const JSON_RPC_URL_ALCHEMY_MAP = {
  80001: process.env.NEXT_PUBLIC_ALCHEMY_RPC_MUMBAI,
  137: process.env.NEXT_PUBLIC_ALCHEMY_RPC_POLYGON,
  1: process.env.NEXT_PUBLIC_ALCHEMY_RPC_MAINNET,
  5: process.env.NEXT_PUBLIC_ALCHEMY_RPC_GOERLI,
  10: process.env.NEXT_PUBLIC_ALCHEMY_RPC_OPTIMISM,
};

export const CURRENCY_MAP = {
  80001: "MATIC (MUMBAI)",
  137: "MATIC",
  1: "ETH",
  5: "ETH (GOERLI)",
  10: "ETH (OPTIMISM)",
};

export const CHAIN_NAME_MAP = {
  80001: "Mumbai",
  137: "Polygon",
  1: "Ethereum",
  5: "Goerli",
  10: "Optimism",
};

export const ALLOWED_CHAIN_IDS = IS_PRODUCTION ? [137, 1, 10] : [80001, 5];
export const LENS_CHAIN_ID = IS_PRODUCTION ? 137 : 80001;

export const DROP_PROTOCOL_DECENT = "DECENT_XYZ";
export const DROP_PROTOCOL_SOUND = "SOUND_XYZ";

export const TIER_OPEN = 'TIER_OPEN';
export const TIER_GATED_LENS_COLLECT = 'GATED_LENS_COLLECT';
export const TIER_GATED_BADGE_HOLDERS = 'BADGE_HOLDERS';
export const CLUBSPACE_SERVICE_FEE_PCT = 20;
export const CLUBSPACE_SERVICE_FEE_RECIPIENT = '0x7F0408bc8Dfe90C09072D8ccF3a1C544737BcDB6';

export const LENS_COLLECT_PAYMENT_TOKENS = IS_PRODUCTION
  ? [
      { symbol: "USDC", address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174" },
      { symbol: "WMATIC", address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270" },
    ]
  : [
      { symbol: "WMATIC", address: "0x9c3c9283d3e44854697cd22d3faa240cfb032889" },
    ];

export const REWARD_ENGAGEMENT_ACTION_MODULE = IS_PRODUCTION
  ? ""
  : "0xDBFAb3E615F9aD0ce056dDa90a04A569315ed5cb";

export const MAD_SBT_CONTRACT_ADDRESS = IS_PRODUCTION
  ? ""
  : "0x31A1bb7c375e457523441d064961c1ddED687dC6";

export const BONSAI_TOKEN_ADDRESS = "0x3d2bD0e15829AA5C362a4144FdF4A1112fa29B5c";
export const BONSAI_TOKEN_DECIMALS = 18;

export const TIP_ACTION_MODULE_EVENT_ABI = [{
  "type": "event",
  "name": "TipCreated",
  "inputs": [
    {
      "name": "transactionExecutor",
      "type": "address",
      "indexed": true,
      "internalType": "address"
    },
    {
      "name": "tipReceiver",
      "type": "address",
      "indexed": true,
      "internalType": "address"
    },
    {
      "name": "currency",
      "type": "address",
      "indexed": true,
      "internalType": "address"
    },
    {
      "name": "tipAmount",
      "type": "uint256",
      "indexed": false,
      "internalType": "uint256"
    }
  ],
  "anonymous": false
}]