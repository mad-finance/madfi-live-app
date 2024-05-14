import { apiUrls } from "@/constants/apiUrls";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { BigNumber } from "ethers";
import request, { gql } from "graphql-request";
import { lensClient } from "./client";
import { ProfileFragment as Profile } from "@lens-protocol/client";

const GET_PROFILES_OWNED = gql`
  query ($ownedBy: EthereumAddress!) {
    profiles(request: { ownedBy: [$ownedBy] }) {
      items {
        id
        name
        bio
        metadata
        isDefault
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        handle
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        ownedBy
        stats {
          totalFollowers
          totalFollowing
        }
      }
    }
  }
`;

const GET_PROFILE_HANDLE_BY_ID = gql`
  query ($id: ProfileId!) {
    profile(request: { profileId: $id }) {
      handle
    }
  }
`;

const GET_PROFILES_BY_HANDLES = gql`
  query ($request: ProfileQueryRequest!) {
    profiles(request: $request) {
      items {
        handle
        name
        bio
        stats {
          totalFollowers
        }
        coverPicture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
        picture {
          ... on NftImage {
            contractAddress
            tokenId
            uri
            verified
          }
          ... on MediaSet {
            original {
              url
              mimeType
            }
          }
          __typename
        }
      }
      pageInfo {
        prev
        next
        totalCount
      }
    }
  }
`;

export const getProfilesOwned = async (ownedBy: string): Promise<Profile[]> => {
  try {
    const profiles = await lensClient.profile.fetchAll({
      where: { ownedBy: [ownedBy] },
    })

    return profiles?.items as unknown as Profile[];
  } catch (error) {
    console.log(error);
  }
};

export const getProfilesOwnedMultiple = async (ownedBy: string[]): Promise<Profile[]> => {
  try {
    const profiles = await lensClient.profile.fetchAll({
      where: { ownedBy },
    })

    return profiles?.items as unknown as Profile[];
  } catch (error) {
    console.log(error);
  }
};

export const useGetProfilesOwned = (options: UseQueryOptions = {}, ownedBy: string) => {
  const result = useQuery(
    ['owned-profiles'],
    async () => {
      if (!ownedBy) return {};

      const profiles = await getProfilesOwned(ownedBy);

      return {
        profiles,
        defaultProfile: profiles?.length ? profiles[0] : {}
      };
    },
    {
      ...(options as any),
      enabled: true,
    }
  );

  return result;
};

export const getHandleById = async (id?: string): Promise<string> => {
  try {
    if (!id) return null;

    const { profile } = await request({
      url: apiUrls.lensAPI,
      document: GET_PROFILE_HANDLE_BY_ID,
      variables: { id: BigNumber.from(id).toHexString() },
    });

    return profile?.handle;
  } catch (error) {
    console.log(error);
  }
};

export const useGetHandleById = (options: UseQueryOptions = {}, id?: string) => {
  const result = useQuery<string>(
    ["profiles", id],
    async () => {
      const result = await getHandleById(id);

      return result;
    },
    {
      ...(options as any),
      enabled: !!id,
    }
  );

  return result;
};

export const getProfilesByHandles = async (handles?: string[], limit = 50): Promise<any> => {
  if (!handles?.length) return null;

  try {
    let cursor = null;
    let items: any[] = [];

    do {
      const _request = cursor ? { handles, limit, cursor } : { handles, limit };

      const { profiles } = await request({
        url: apiUrls.lensAPI,
        document: GET_PROFILES_BY_HANDLES,
        variables: { request: _request },
      });

      items.push(profiles!.items.map((profile) => profile));

      cursor =
        JSON.parse(profiles!.pageInfo?.next).offset != profiles!.pageInfo?.totalCount ? profiles!.pageInfo!.next : null;
    } while (cursor);

    return items.flat();
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const useGetProfilesByHandles = (options: UseQueryOptions = {}, handles?: string[]) => {
  const result = useQuery<Profile[]>(
    ["profilesByHandles", handles],
    async () => {
      const result = await getProfilesByHandles(handles);

      return result;
    },
    {
      ...(options as any),
      enabled: !!handles,
    }
  );

  return result;
};
