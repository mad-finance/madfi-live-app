import { Contract, providers } from 'ethers';
import BadgesABI from './BadgesABI.json';
import { Badges } from './BadgesType';

const SISMO_CLUBSPACE_BADGE_TOKEN = 10000035;
const SISMO_BADGES_NETWORK = 'matic';
const SISMO_BADGES_CONTRACT = '0x71a7089C56DFf528f330Bc0116C0917cd05B51Fc'; // polygon
const { NEXT_PUBLIC_ALCHEMY_KEY } = process.env;

export default async (address: string) => {
  if (!address) return false;

  const provider = new providers.AlchemyProvider(SISMO_BADGES_NETWORK, NEXT_PUBLIC_ALCHEMY_KEY);
  const badgesContract = new Contract(SISMO_BADGES_CONTRACT, BadgesABI, provider) as Badges;
  const balance = await badgesContract.balanceOf(address, SISMO_CLUBSPACE_BADGE_TOKEN);

  return balance.gt(0);
};
