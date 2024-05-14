import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { useAccount } from "wagmi";
import hasClubspaceBadge from "@/services/sismo/hasClubspaceBadge";

export default (options: UseQueryOptions = {}) => {
  const { address } = useAccount();

  const result = useQuery<boolean>(
    ["sismo-has-badge", address],
    async () => {
      return await hasClubspaceBadge(address);
    },
    {
      ...(options as any),
      enabled: !!address,
    }
  );

  return result;
};
