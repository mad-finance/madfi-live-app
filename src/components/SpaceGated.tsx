import Link from "next/link";
import { useMemo } from "react";
import { useAccount } from "wagmi";
import LensLogoIcon from "@/assets/svg/lens-logo-icon.svg";
import { TIER_GATED_BADGE_HOLDERS, MADFI_SITE_URL } from "@/lib/consts";
import { Button } from "@/components/ui";
import { ConnectWallet } from "@/components/ConnectWallet";

export const SpaceGated = ({
  handle,
  gated,
  creatorLensHandle,
}: {
  handle: string;
  gated: { tier: string };
  creatorLensHandle: string;
}) => {
  const { isConnected } = useAccount();

  const requirement = useMemo(() => {
    if (gated?.tier === TIER_GATED_BADGE_HOLDERS) {
      return "To join, you must be a member of their Social Club";
    }
  }, [gated]);

  return (
    <div className="bg-background flex-1 min-h-screen">
      <div className="abs-center items-center">
        <div className="sm:border-l sm:border-gray-200 sm:pl-6 gap-y-12">
          <h1 className="animate-move-txt-bg gradient-txt text-4xl font-bold tracking-tight sm:text-5xl">
            This livestream is gated
          </h1>
          <p className="mt-1 text-base text-gray-500">hosted by @{handle}</p>
        </div>

        <h2 className="mt-8 my-4 text-3xl font-bold tracking-tight sm:text-2xl md:text-4xl text-center mt-12 mb-12">
          {requirement}
        </h2>

        <div className="items-center justify-center mt-8">
          {!isConnected ? <ConnectWallet /> : (
            <Link href={`${MADFI_SITE_URL}/creators/${creatorLensHandle}`} target="_blank">
              <Button size="lg">
                Go to Social Club
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
