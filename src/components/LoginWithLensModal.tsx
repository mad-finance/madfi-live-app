import { useAccount } from "wagmi";
import { disconnect } from "@wagmi/core";
import { formatProfilePicture } from "@madfi/widgets-react";
import { CheckCircleIcon } from "@heroicons/react/solid";
import toast from "react-hot-toast";
import { useOwnedHandles, useProfiles, useLogin, useLazyProfile, Profile } from "@lens-protocol/react-web";

import { Dialog, DialogHeader, DialogContent } from '@/components/ui/Dialog';
import { Button } from "@/components/ui";

const LoginWithLensModal = ({ openLoginModal, setOpenLoginModal, authenticatedProfile, login, signingIn }) => {
  const { address } = useAccount();
  const { data: handles } = useOwnedHandles({ for: address });
  const { data: profiles } = useProfiles({ where: { handles: handles?.map(({ fullHandle }) => fullHandle) }});
  const { execute: fetchProfile } = useLazyProfile();

  const signInWithLens = async (handle: string) => {
    let toastId = toast.loading("Signing in with Lens");
    const profileResult = await fetchProfile({ forHandle: handle });

    if (profileResult.isFailure()) {
      toast.error(profileResult.error.message, { id: toastId });
      return;
    }

    const profile = profileResult.value;

    const loginResult = await login({
      address: address,
      profileId: profile.id,
    });

    if (loginResult.isFailure()) {
      toast.error(loginResult.error.message, { id: toastId });
      return;
    }

    toast.success("Signed in with Lens", { id: toastId });

    setOpenLoginModal(false)
  };

  return (
    <Dialog open={openLoginModal} onOpenChange={setOpenLoginModal}>
      <DialogContent className="w-3/4 flex flex-col gap-4 pt-4">
        <DialogHeader className="text-5xl uppercase text-center font-owners font-bold">
          Login with Lens
        </DialogHeader>

        <h2 className="font-bold text-xl mt-2">Profiles Owned</h2>

        {/* PROFILE SELECTION */}
        <div className="flex flex-col md:flex-row md:gap-x-12 w-full gap-y-6 pb-4">
          {profiles && profiles.length
            ? profiles.map((profile: Profile) => (
              <div className="md:w-1/2" key={profile.id}>
                <div className="card bg-background p-4 rounded-sm shadow-sm max-h-fit rounded-lg shadow-lg flex flex-col gap-6">
                  <div className="flex w-full items-center justify-between">
                    <img
                      src={formatProfilePicture(profile).metadata.picture.url}
                      alt={profile?.id}
                      className="rounded-sm w-20 h-20"
                    />
                    <div className="flex flex-col">
                      {authenticatedProfile?.id === profile.id && (
                        <div className="flex flex-col justify-center items-center">
                          <CheckCircleIcon className="h-8 w-8 text-white" />
                          <span>Logged in</span>
                        </div>
                      )}
                      {!authenticatedProfile?.id && (
                        <Button
                          className="md:px-12"
                          onClick={() => signInWithLens(profile.handle.fullHandle)}
                          disabled={signingIn}
                        >
                          Login
                        </Button>
                      )}
                    </div>
                  </div>
                  <div className="flex w-full justify-between items-center">
                    <h3 className="font-bold">
                      {profile?.metadata?.displayName || ""}
                    </h3>
                    <span className="text-sm">{profile?.handle?.suggestedFormatted?.full}</span>
                  </div>
                </div>
              </div>
            ))
            : null}
          <div className="flex justify-center mt-4 mb-4 text-sm gap-x-4 pb-8">
            <div className="absolute right-8 bottom-2">
              <span
                className="link link-hover mb-8 cursor-pointer"
                onClick={async () => { await disconnect(); setOpenLoginModal(false); }}
              >
                Switch wallets
              </span>

            </div>
          </div>
        </div>

        {/* PFP SELECTION */}
        <h2 className="font-bold text-xl">Token-bound accounts</h2>
        <p className="font-light italic mt-2">Coming soon</p>
      </DialogContent>
    </Dialog>
  );
};

export default LoginWithLensModal;
