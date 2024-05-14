import request, { gql } from 'graphql-request';
import { apiUrls } from '@/constants/apiUrls';
import { isOpenEdition } from './utils';

const ARTIST_BY_PUBLIC_ADDRESS = gql`
  query Artist ($publicAddress: Address!) {
    userByAddress (publicAddress: $publicAddress) {
      artist {
        releases {
          edges {
            node {
              artist {
                name
              }
              coverImage {
                url
              }
              isFinalSoldOut
              numSold
              price
              title
              finalQuantity
              quantity
              quantityUpperBound
              contractAddress
              finalSaleScheduleEndTimestamp
              publicMintStart
            }
          }
        }
      }
    }
  }
`;

export default async (address: string) => {
  try {
    const { userByAddress } = await request({
      url: apiUrls.soundxyz,
      document: ARTIST_BY_PUBLIC_ADDRESS,
      variables: { publicAddress: address },
      requestHeaders: { 'X-Sound-Client-Key': process.env.NEXT_PUBLIC_SOUND_API_KEY }
    });

    return userByAddress?.artist?.releases?.edges?.map(({ node }) =>
      ({ ...node, isOpenEdition: isOpenEdition(node.quantityUpperBound) })
    );
  } catch (error) {
    console.log(error);
  }
};
