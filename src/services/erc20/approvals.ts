import { erc20ABI } from "wagmi";
import { IS_PRODUCTION, JSON_RPC_URL_ALCHEMY_MAP } from "@/lib/consts";
import { WalletClient, createPublicClient, http } from "viem";
import { polygon, polygonMumbai } from "viem/chains";

export const MAX_UINT = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

const setupPublicClient = () => {
  const chain = IS_PRODUCTION ? polygon : polygonMumbai;
  return createPublicClient({
    chain,
    transport: http(JSON_RPC_URL_ALCHEMY_MAP[chain.id]),
  });
};

export const getApprovalAmount = async (
  tokenAddress: `0x${string}`,
  userAddress: `0x${string}`,
  operatorAddress: `0x${string}`
) => {
  const publicClient = setupPublicClient();
  const allowance = await publicClient.readContract({
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "allowance",
    args: [userAddress, operatorAddress],
  });
  return allowance;
};

export const approveToken = async (
  walletClient: WalletClient,
  tokenAddress: `0x${string}`,
  operatorAddress: `0x${string}`
) => {
  const [account] = await walletClient.getAddresses();
  const hash = await walletClient.writeContract({
    account: account,
    chain: IS_PRODUCTION ? polygon : polygonMumbai,
    address: tokenAddress,
    abi: erc20ABI,
    functionName: "approve",
    args: [operatorAddress, MAX_UINT],
  });
  const publicClient = setupPublicClient();
  await publicClient.waitForTransactionReceipt({ hash });
};
