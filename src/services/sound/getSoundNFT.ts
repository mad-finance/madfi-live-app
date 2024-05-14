// import { SoundClient } from '@soundxyz/sdk';
// import { SoundAPI } from '@soundxyz/sdk/api'
// import { kebabCase } from 'lodash/string';
// import { providers } from 'ethers'
// import { IS_PRODUCTION, JSON_RPC_URL_ALCHEMY_MAP } from '@/lib/consts';
// import { isOpenEdition } from './utils';

// TODO: update to latest sound sdk interface
export default async (editionAddress: string) => {
  // try {
  //   // const chainId = IS_PRODUCTION ? 1 : 5; // mainnet, goerli
  //   const chainId = 1;
  //   const provider = new providers.JsonRpcProvider(JSON_RPC_URL_ALCHEMY_MAP[chainId]);
  //   const soundAPI = SoundAPI({ apiKey: process.env.NEXT_PUBLIC_SOUND_API_KEY });
  //   const client = SoundClient({ provider, soundAPI });

  //   const isAddressSoundEdition = await client.isSoundEdition({ editionAddress });
  //   if (!isAddressSoundEdition) return;

  //   const [contractInfo, [mintSchedule]] = await Promise.all([
  //     client.editionInfo({ contractAddress: editionAddress }).api,
  //     client.activeMintSchedules({ editionAddress })
  //   ]);

  //   const mintInfo = mintSchedule ? {
  //     isFinalSoldOut: mintSchedule.maxMintableUpper === mintSchedule.totalMinted,
  //     publicMintStart: mintSchedule.startTime, // timestamp
  //     finalSaleScheduleEndTimestamp: mintSchedule.endTime, // timestamp
  //     numSold: mintSchedule.totalMinted,
  //     quantity: mintSchedule.maxMintableUpper,
  //     isOpenEdition: isOpenEdition(mintSchedule.maxMintableUpper),
  //     price: mintSchedule.price, // BigNumber
  //   } : {};

  //   const externalUrl = contractInfo.webappUri ||
  //     `https://www.sound.xyz/${contractInfo.artist.soundHandle}/${kebabCase(contractInfo.title)}`;

  //   const now = Math.floor(Date.now() / 1000); // sec
  //   const saleIsActive = !mintSchedule.mintPaused &&
  //     !mintInfo.isFinalSoldOut &&
  //     mintInfo.publicMintStart <= now &&
  //     now < mintInfo.finalSaleScheduleEndTimestamp;

  //   return {
  //     chainId,
  //     contractAddress: editionAddress,
  //     name: contractInfo.title,
  //     description: contractInfo.behindTheMusic,
  //     coverImage: contractInfo.coverImage.url,
  //     animatedCoverImage: contractInfo.animatedCoverImage?.url,
  //     externalUrl,
  //     saleIsActive,
  //     ...mintInfo,
  //     mintSchedule,
  //   };
  // } catch (error) {
  //   console.log(error);
  // }
};
