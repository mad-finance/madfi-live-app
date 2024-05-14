import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { TIER_GATED_BADGE_HOLDERS } from "@/lib/consts";
// import { hasCollectedPost } from "@/services/lens/getPost";
import getBadgeOwned from "@/services/madfi/getBadgeOwned";

export default (
  address: string,
  gated?: { tier?: string, collectionId?: string },
  options?: UseQueryOptions = {}
) => {
  const result = useQuery<any>(
    ['meets-gated-condition', address],
    async () => {
      if (!gated?.tier) return true;

      if (gated.tier === TIER_GATED_BADGE_HOLDERS) {
        const tokenId = await getBadgeOwned(gated.collectionId, address.toLowerCase());
        return !!tokenId;
      }
    },
    {
      ...(options as any),
      enabled: !!address,
    }
  );

  return result;
};
