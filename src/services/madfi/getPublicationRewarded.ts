import request, { gql } from 'graphql-request';
import { apiUrls } from '@/constants/apiUrls';

const PUBLICATION_REWARDED = gql`
  query ($profileId: String!, $pubId: String!) {
    publicationRewardEngagements(where:{profileId:$profileId, pubId:$pubId}){
        profileId
        pubId
        actionType
        collectionId
        rewardUnits
        limit
        claimed
      }
  }
`;

// profileId and pubId will be in hex (coming from parsed lens url)
export default async (profileId: string, pubId: string) => {
  try {
    const { publicationRewardEngagements } = await request({
      url: apiUrls.madfiSubgraph,
      document: PUBLICATION_REWARDED,
      variables: {
        profileId: parseInt(profileId, 16).toString(),
        pubId: parseInt(pubId, 16).toString()
      }
    });

    return publicationRewardEngagements?.length ? publicationRewardEngagements[0] : {};
  } catch (error) {
    console.log(error);
  }
};
