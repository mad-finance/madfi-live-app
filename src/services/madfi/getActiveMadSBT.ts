import request, { gql } from 'graphql-request';
import { apiUrls } from '@/constants/apiUrls';

// TODO: should really use MadCreator.activeMadSBT instead :shrug:
const COLLECTION_FOR_CREATOR = gql`
  query ($creator: String!) {
    madSbtCollections(where:{creator:$creator}) {
      collectionId
    }
  }
`;

// profileId and pubId will be in hex (coming from parsed lens url)
export default async (creator: string): Promise<string> => {
  try {
    const { madSbtCollections } = await request({
      url: apiUrls.madfiSubgraph,
      document: COLLECTION_FOR_CREATOR,
      variables: { creator }
    });

    return madSbtCollections?.length ? madSbtCollections[0].collectionId : null;
  } catch (error) {
    console.log(error);
  }
};
