import { useState } from "react";
import { useRouter } from "next/router";
import { useLogin, useLogout, useProfile, ProfileId } from "@lens-protocol/react-web";
import { useAuthenticatedProfileId } from "@/hooks/useLensLogin";

import { ConnectWallet } from "./ConnectWallet";
import LoginWithLensModal from "./LoginWithLensModal";

const MADFI_DASHBOARD = 'https://madfi.xyz/dashboard';

export const Header = () => {
  const { route } = useRouter();
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const { execute: login, loading: signingIn } = useLogin();
  const { execute: logout } = useLogout();
  const { data: authenticatedProfileId } = useAuthenticatedProfileId();
  const { data: authenticatedProfile } = useProfile({
    forProfileId: authenticatedProfileId as ProfileId,
  });

  if (route === '/') return null;

  return (
    <header className="bg-black shadow-sm">
      <nav className="max-w-[85%] mx-auto items-center w-full" aria-label="Top">
        <div className="flex w-full items-center justify-between py-6">
          <div className="flex items-center">
            <div className="w-max">
              <a className="w-full" href={MADFI_DASHBOARD}>
                <div className="text-normal font-extrabold uppercase text-4xl font-ownersx">
                  <span className="text-primary">MAD</span>
                  <span className="text-secondary">FI</span>
                </div>
              </a>
            </div>
          </div>
          <div className="hidden lg:block">
            { /** <SearchApp />  */}
          </div>
          <ConnectWallet
            setOpenSignInModal={setOpenLoginModal}
            authenticatedProfile={authenticatedProfile}
            signingIn={signingIn}
            logout={logout}
          />
        </div>
      </nav>
      <LoginWithLensModal
        openLoginModal={openLoginModal}
        setOpenLoginModal={setOpenLoginModal}
        login={login}
        authenticatedProfile={authenticatedProfile}
        signingIn={signingIn}
      />
    </header>
  );
};