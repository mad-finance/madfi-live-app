import React from "react";
import { useAccount } from "wagmi";
import { Profile } from "@/services/lens/getProfile";
import { getUrlForImageFromIpfs } from "@/utils";
import { useIsAuthenticated } from "@/hooks/useLensLogin";

interface HostProps {
  profile: Profile;
  drawerProfileId: string;
  doesFollowDrawerProfile: boolean;
  onFollowClick: (drawerProfileId: string) => void;
  isHost: boolean;
  loginWithLens: (options: any, something: boolean) => void;
  isFollowingAction: boolean;
}

export const HostCard = ({ profile, drawerProfileId, doesFollowDrawerProfile, onFollowClick, isHost, loginWithLens, isFollowingAction }: HostProps) => {
  const { isConnected } = useAccount();
  const { data: isAuthenticated } = useIsAuthenticated();

  const coverPic = profile.coverPicture?.original?.url
    ? getUrlForImageFromIpfs(profile.coverPicture?.original?.url)
    : "/default-cover.jpg";

  const profilePic = profile.picture?.original?.url
    ? getUrlForImageFromIpfs(profile.picture?.original?.url)
    : (profile.picture?.uri || "");

  return (
    <>
      <div>
        <div className="flex w-full justify-center">
          <div className="max-w-[20rem] min-w-[17rem]">
            <div className="bg-slate-800 shadow-xl rounded-lg">
              <div className="photo-wrapper p-2 pt-0 relative">
                <img className="absolute t-0 left-0 right-0 w-full h-full object-cover" src={coverPic} alt="" />
                <img
                  className="w-16 h-16 rounded-full mx-auto relative top-10 outline outline-offset-0 outline-1 outline-gray-50"
                  src={profilePic}
                  alt={profile.handle.localName}
                />
              </div>
              <div className="p-2 pt-10">
                <h3 className="text-center text-xl text-gray-300 font-medium leading-8 -mb-2">
                  @{profile.handle.localName}
                </h3>
                <div className="text-center text-gray-400 text-md font-semibold mb-1">
                  <p>{profile.id}</p>
                </div>
                <p className="text-sm text-white mb-0 p-4 text-center">
                  {profile.bio || <em>No bio provided.</em>}
                </p>

                <div className="flex justify-center mb-8 text-sm gap-x-4">
                  <div className="flex gap-x-2">
                    <span>
                      <strong>{profile.stats.following}</strong>
                    </span>
                    <span className="text-gray-400">following</span>
                  </div>

                  <div className="flex gap-x-2">
                    <span>
                      <strong>{profile.stats.followers}</strong>
                    </span>
                    <span className="text-gray-400">
                      {profile.stats.followers === 1 ? "follower" : "followers"}
                    </span>
                  </div>
                </div>

                {!isHost && isConnected ? (
                  <div className="text-center my-3 px-3">
                    {
                      isAuthenticated
                        ? <button
                            className="btn btn-lens"
                            onClick={() => {
                              onFollowClick(profile.id);
                            }}
                            disabled={doesFollowDrawerProfile || isFollowingAction}
                          >
                            {doesFollowDrawerProfile ? "Following" : "Follow"}
                          </button>
                        : null
                    }
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
