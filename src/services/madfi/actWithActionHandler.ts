import { ActionHandler } from "@madfi/lens-oa-client";
import { IS_PRODUCTION } from "@/lib/consts";
import { actWithSignedTypedata, actOnchain, actSignless } from "../lens/act";

const actWithActionHandler = async (actionModuleHandler: ActionHandler, walletClient: any, authenticatedProfile: any, moduleActData: any): Promise<string> => {
  const { metadata } = actionModuleHandler.getActionModuleConfig();
  const useGasless = !IS_PRODUCTION || metadata?.sponsoredApproved;
  const useSignless = authenticatedProfile?.signless && (!IS_PRODUCTION || metadata?.signlessApproved);

  const actionModuleData = actionModuleHandler.encodeModuleActData(moduleActData);

  let tx;
  if (useSignless) {
    tx = await actSignless(
      actionModuleHandler.publicationId!,
      actionModuleHandler.address,
      actionModuleData
    );
  } else if (useGasless) {
    tx = await actWithSignedTypedata(
      walletClient,
      actionModuleHandler.publicationId!,
      actionModuleHandler.address,
      actionModuleData
    );
  } else {
    const pointedProfileId = actionModuleHandler.profileId;
    const pointedPubId = actionModuleHandler.pubId
    const actorProfileId = authenticatedProfile.id;
    tx = await actOnchain(walletClient, {
      publicationActedProfileId: pointedProfileId,
      publicationActedId: pointedPubId,
      actorProfileId,
      referrerProfileIds: [],
      referrerPubIds: [],
      referrerPubTypes: [],
      actionModuleAddress: actionModuleHandler.address,
      actionModuleData,
    });
  }
  console.log(`tx: ${tx}`)

  if (!tx) throw new Error("Failed");

  return tx;
}

export default actWithActionHandler;