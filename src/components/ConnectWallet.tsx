import { FC, useMemo } from "react";
import '@rainbow-me/rainbowkit/styles.css';
import { ConnectButton as RainbowButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";

import { Button } from "./ui";
import { shortAddress } from "@/utils";
import useENS from "@/hooks/useENS";
import { VALID_CHAIN } from "@/lib/consts";

interface Props {
  className?: string;
  setOpenSignInModal?: (b: boolean) => void;
  autoLensLogin?: boolean;
  authenticatedProfile: any;
  signingIn?: any;
  logout?: any;
}

export const ConnectWallet: FC<Props> = ({ className, setOpenSignInModal, authenticatedProfile, signingIn, logout }) => {
  const isAuthenticated = !!authenticatedProfile?.id;

  // logout from lens
  const onDisconnect = async () => {
    if (authenticatedProfile) {
      await logout();
    }
  };
  const { address } = useAccount({ onDisconnect });
  const { data: ensData, isLoading: loadingENS } = useENS(address);
  const ensName = ensData?.handle;

  const identity = useMemo(() => {
    if (authenticatedProfile)
      return authenticatedProfile!.handle?.suggestedFormatted?.localName || authenticatedProfile!.handle?.localName
    if (!loadingENS && ensName) return ensName;

    if (address) return shortAddress(address);
  }, [authenticatedProfile, loadingENS, address]);

  return (
    <>
      <RainbowButton.Custom>
        {({ account, chain, openAccountModal, openChainModal, openConnectModal, authenticationStatus, mounted }) => {
          // Note: If your app doesn't use authentication, you
          // can remove all 'authenticationStatus' checks
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus || authenticationStatus === 'authenticated')

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                'style': {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <Button
                      className={`${className}`}
                      onClick={openConnectModal}
                    >
                      Connect
                    </Button>
                  );
                }

                if (mounted && account && chain.unsupported) {
                  return (
                    <Button className={`${className}`} onClick={openChainModal}>
                      Switch to {VALID_CHAIN.name}
                    </Button>
                  );
                }

                if (!isAuthenticated && setOpenSignInModal) {
                  return (
                    <Button
                      className={`${className}`}
                      onClick={() => setOpenSignInModal(true)}
                      disabled={signingIn}
                    >
                      Login with Lens
                    </Button>
                  )
                }

                return (
                  <div className="flex gap-3">
                    <Button
                      className={`${className}`}
                      onClick={openAccountModal}
                    // iconStart={<Wallet />}
                    >
                      <span className="flex items-center">
                        <span className="">
                          {identity}
                        </span>
                      </span>
                    </Button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </RainbowButton.Custom>
    </>
  );
};
