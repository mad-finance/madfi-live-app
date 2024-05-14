import { utils } from "ethers";
import { REWARD_ENGAGEMENT_ACTION_MODULE } from "@/lib/consts";

export const getPublicationActionParams = (
  pointedProfileId: string,
  pointedPubId: string,
  actorProfileId: string,
  actionType: "COMMENT" | "MIRROR" | "QUOTE"
) => {
  const mirrorParams = {
    profileId: actorProfileId,
    metadataURI: "", // TODO
    pointedProfileId,
    pointedPubId,
    referrerProfileIds: [],
    referrerPubIds: [],
    referenceModuleData: "0x"
  };

  let encodedActionParams: any; // the encoded struct for comment|mirror|quote
  if (actionType === "MIRROR") {
    encodedActionParams = utils.defaultAbiCoder.encode(
      ['tuple(uint256 profileId, string metadataURI, uint16 pointedProfileId, uint8 pointedPubId, uint256[] referrerProfileIds, uint256[] referrerPubIds, string referenceModuleData)'],
      [mirrorParams]
    );
  }

  return {
    publicationActedProfileId: pointedProfileId,
    publicationActedId: pointedPubId,
    actorProfileId,
    referrerProfileIds: [],
    referrerPubIds: [],
    referrerPubTypes: [],
    actionModuleAddress: REWARD_ENGAGEMENT_ACTION_MODULE,
    actionModuleData: encodedActionParams,
  };
};