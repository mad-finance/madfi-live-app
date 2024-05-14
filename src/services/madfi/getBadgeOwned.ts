import request, { gql } from 'graphql-request';
import { apiUrls } from '@/constants/apiUrls';

const BADGE_OWNED_FOR_COLLECTION = gql`
  query ($collectionId: String!, $owner: String!) {
    madSbtTokens(where:{collection_:{collectionId: $collectionId}, owner: $owner}) {
      tokenId
    }
  }
`

export default async (collectionId: string, owner: string): Promise<string> => {
  try {
    const { madSbtTokens } = await request({
      url: apiUrls.madfiSubgraph,
      document: BADGE_OWNED_FOR_COLLECTION,
      variables: { collectionId, owner }
    });

    return madSbtTokens?.length ? madSbtTokens[0].tokenId : null;
  } catch (error) {
    console.log(error);
  }
};
