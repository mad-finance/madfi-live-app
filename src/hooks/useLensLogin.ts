import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useAccount, useWalletClient } from "wagmi";
import { useGetProfilesOwned } from "@/services/lens/getProfile";
import { lensClient } from "@/services/lens/client";

export const getAccessToken = async () => {
  const accessTokenResult = await lensClient.authentication.getAccessToken();
  return accessTokenResult.unwrap();
};

export const useAuthenticatedAccessToken = () => {
  const result = useQuery(
    ["lens-authenticated-access-token"],
    async () => {
      return await getAccessToken();
    },
    {
      enabled: true,
    }
  );

  return result;
}

export const useAuthenticatedProfileId = () => {
  const result = useQuery(
    ["lens-authenticated-profileId"],
    async () => {
      return await lensClient.authentication.getProfileId();
    },
    {
      enabled: true,
    }
  );

  return result;
}

export const useIsAuthenticated = () => {
  const result = useQuery(
    ["lens-authenticated"],
    async () => {
      return await lensClient.authentication.isAuthenticated();
    },
    {
      enabled: true,
    }
  );

  return result;
};