import { Contract, Signer, utils } from 'ethers';
import { LENSHUB_PROXY } from "@/lib/consts";
import { LensHubProxy } from './abi';

// input is signed type data from the lens api
export default async (signer: Signer, data: any, sig: any) => {
  const contract = new Contract(LENSHUB_PROXY, LensHubProxy, signer);

  const { v, r, s } = utils.splitSignature(sig);

  const tx = await contract.postWithSig({
    profileId: data.profileId,
    contentURI: data.contentURI,
    collectModule: data.collectModule,
    collectModuleInitData: data.collectModuleInitData,
    referenceModule: data.referenceModule,
    referenceModuleInitData: data.referenceModuleInitData,
    sig: { v, r, s, deadline: data.deadline },
  }, { gasLimit: 400_000 });
  console.log(`tx: ${tx.hash}`);

  await tx.wait();
};
