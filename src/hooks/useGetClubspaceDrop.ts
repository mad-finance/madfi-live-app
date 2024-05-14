import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { DROP_PROTOCOL_SOUND } from "@/lib/consts";
import getSoundNFT from "@/services/sound/getSoundNFT";

export default (options: UseQueryOptions = {}, { drop, signer }) => {
  if (!drop) {
    return {
      data: undefined,
      isLoading: false,
      isError: false,
      error: undefined,
    };
  }

  const result = useQuery<Profile[]>(
    ["clubspace-drop", drop.contractAddress],
    async () => {
      let data;

      if (drop.protocol === DROP_PROTOCOL_SOUND) {
        data = await getSoundNFT(drop.contractAddress);
      } else {
        throw new Error("invalid value for drop.protocol: ");
      }

      data.protocol = drop.protocol;

      return data;
    },
    {
      ...(options as any),
      enabled: !!(drop && signer),
    }
  );

  return result;
};
