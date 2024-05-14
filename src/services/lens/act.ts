import { Contract, Signer } from 'ethers';
import { omit } from "lodash/object";
import { OnchainReferrer, RelaySuccessFragment } from "@lens-protocol/client";
import { LENSHUB_PROXY } from "@/lib/consts";
import { lensClient } from "@/services/lens/client";
import { LensHubProxy } from './abi';

// input the `Types.ProcessActionParams` struct for ILensProtocol#act()
// derive that from the `@/services/madfi/rewardEngagementAction`
export const actOnchain = async (signer: Signer, processActionParams: any) => {
  const contract = new Contract(LENSHUB_PROXY, LensHubProxy, signer);

  const tx = await contract.act(processActionParams, { gasLimit: 400_000 });
  console.log(`tx: ${tx.hash}`);

  await tx.wait();
};

// NOTE: this assume the given `actionModule` has `metadata.sponsoredApproved` = true
// NOTE: this assumes that the passed in `lensClient` is authenticated (see: https://docs.lens.xyz/docs/login)
// NOTE: this assumes the app is whitelisted to use gasless
export const actWithSignedTypedata = async (
  walletClient: any,
  publicationId: string,
  actionModule: `0x${string}`,
  actionModuleData: string,
  referrers?: OnchainReferrer[]
): Promise<any> => {
  try {
    const typedDataResult = await lensClient.publication.actions.createActOnTypedData({
      actOn: {
        unknownOpenAction: {
          address: actionModule,
          data: actionModuleData
        }
      },
      for: publicationId,
      referrers: referrers || []
    });

    const { id, typedData } = typedDataResult.unwrap();

    const [account] = await walletClient.getAddresses();
    const signedTypedData = await walletClient.signTypedData({
      account,
      domain: omit(typedData.domain, "__typename"),
      types: omit(typedData.types, "__typename"),
      primaryType: "Act",
      message: omit(typedData.value, "__typename"),
    });

    const broadcastResult = await lensClient.transaction.broadcastOnchain({ id, signature: signedTypedData });
    const broadcastResultValue = broadcastResult.unwrap();

    if (broadcastResultValue.__typename === "RelayError") throw new Error("RelayError");

    return (broadcastResultValue as RelaySuccessFragment).txHash;
  } catch (error) {
    console.log(error);
  }
}

export const actSignless = async (publicationId: string, actionModule: `0x${string}`, actionModuleData: string) => {
  try {
    const broadcastResult = await lensClient.publication.actions.actOn({
      actOn: {
        unknownOpenAction: { address: actionModule, data: actionModuleData }
      },
      for: publicationId
    });

    const broadcastResultValue = broadcastResult.unwrap();

    if (broadcastResultValue.__typename === "RelayError") throw new Error("RelayError");

    return (broadcastResultValue as RelaySuccessFragment).txHash;
  } catch (error) {
    console.log(error);
  }
}
