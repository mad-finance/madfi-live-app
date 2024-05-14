import { apiUrls } from "@/constants/apiUrls";
import { useQuery } from "@tanstack/react-query";
import request, { gql } from "graphql-request";
import { omit, broadcastRequest } from "./gaslessTxs";
import { getAccessToken } from "@/hooks/useLensLogin";

const GET_PROFILE_MANAGERS = gql`
  query profileManagers($profileId: ProfileId!) {
    profileManagers(request: { for: $profileId}) {
      items {
        address
      }
    }
  }
`;

const MUTATE_CHANGE_PROFILE_MANAGER = gql`
  mutation createChangeProfileManagersTypedData(
    $options: TypedDataOptions,
    $request: ChangeProfileManagersRequest!
  ) {
    createChangeProfileManagersTypedData(
      options: $options,
      request: $request
    ) {
      id
      expiresAt
      typedData {
        types {
          ChangeDelegatedExecutorsConfig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          delegatorProfileId
          delegatedExecutors
          approvals
          configNumber
          switchToGivenConfig
        }
      }
    }
  }

`;

export const enableProfileManagerGasless = async (signer: any, contractAddress: string) => {
  const accessToken = await getAccessToken();
  if (!accessToken) throw new Error('Must sign-in with Lens');

  const { createChangeProfileManagersTypedData } = await request({
    url: apiUrls.lensAPI,
    document: MUTATE_CHANGE_PROFILE_MANAGER,
    variables: { request: { changeManagers: { address: contractAddress, action: 'ADD' } } },
    requestHeaders: { "x-access-token": accessToken },
  });
  const typedData = createChangeProfileManagersTypedData.typedData;
  const signature = await signer._signTypedData(
    omit(typedData.domain, "__typename"),
    omit(typedData.types, "__typename"),
    omit(typedData.value, "__typename")
  );
  await broadcastRequest(
    { id: [createChangeProfileManagersTypedData.id], signature: [signature] },
    accessToken
  );
};

export const getProfileManagers = async (profileId: string) => {
  try {
    const { profileManagers } = await request({
      url: apiUrls.lensAPI,
      document: GET_PROFILE_MANAGERS,
      variables: { profileId },
    });

    return profileManagers?.items?.map(({ address }) => address) || [];
  } catch (error) {
    console.log(error);
  }
};

export const useIsProfileManager = (profileId: string, contractAddress: string) => {
  const result = useQuery<boolean>(
    ['is-profile-manager', `${profileId}/${contractAddress}`],
    async () => {
      const profileManagers = await getProfileManagers(profileId);

      return profileManagers.includes(contractAddress);
    },
    {
      enabled: !!profileId && !!contractAddress,
    }
  );

  return result;
};