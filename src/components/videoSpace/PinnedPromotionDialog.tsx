import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { useCallback } from "react";
import { ShoppingBag } from "lucide-react";
import { useWalletClient } from "wagmi";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import useGetClubspaceDrop from "@/hooks/useGetClubspaceDrop";
import { FeaturedSoundNFT } from "./../FeaturedSoundNFT";
import PinnedLensPost from "./../PinnedLensPost";
import { DROP_PROTOCOL_SOUND } from "@/lib/consts";

export const PinnedPromotionDialog = ({ space }) => {
  const { data: walletClient } = useWalletClient();
  const { data: featuredDrop, isLoading: isLoadingFeauredDrop } = useGetClubspaceDrop(
    {},
    { drop: space.drop, signer: walletClient }
  );

  const DummyDecent = useCallback(
    () => (
      <SkeletonTheme baseColor="rgb(85,13,69)" highlightColor="#8B8A8C">
        <div>
          <h2 className="my-4 text-4xl font-bold tracking-tight sm:text-2xl md:text-5xl drop-shadow-sm text-center">
            Featured Drop
          </h2>
          <div className="flex w-full justify-center relative">
            <div className="max-w-[20rem] min-w-[17rem]">
              <div className="bg-slate-800 shadow-xl rounded-lg relative">
                <div className="photo-wrapper p-2 pt-0 overflow-hidden">
                  <Skeleton
                    width={272}
                    height={262}
                    className="!absolute t-0 left-0 right-0 w-full h-full object-cover opacity-50 rounded-md"
                  />
                </div>

                <div className="p-2 pt-4 relative">
                  <h3 className="text-center text-xl text-gray-300 font-medium leading-8 -mb-2">
                    <Skeleton className="max-w-[75%]" height={14} />
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-white mb-0 p-4 text-center">
                    <Skeleton className="max-w-[55%]" height={4} />
                  </p>

                  <div className="text-center text-gray-400 text-sm font-semibold mb-5 -mt-2">
                    <p>
                      <Skeleton className="max-w-[55%]" height={4} />
                    </p>
                  </div>

                  <div className="text-center text-gray-400 text-sm font-semibold mb-2 -mt-2">
                    <p>
                      <Skeleton className="max-w-[80%]" height={8} />
                    </p>
                  </div>

                  <div className="flex justify-center mb-0 text-sm gap-x-4">
                    <div className="flex gap-x-2">
                      <span>
                        <strong>
                          <strong>
                            <Skeleton className="w-full" height={3} />
                          </strong>
                        </strong>
                      </span>
                    </div>

                    <div className="flex gap-x-2">
                      <span>
                        <strong>
                          <Skeleton className="w-full" height={3} />
                        </strong>
                      </span>
                    </div>
                  </div>

                  <div className="text-center mb-3 mt-2 px-3">
                    <Skeleton className="btn" height={40} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex w-full justify-center relative grid-cols-2 gap-4 mt-2">
            <Skeleton className="btn" height={35} width={95} />
            <Skeleton className="btn" height={45} width={160} />
          </div>
        </div>
      </SkeletonTheme>
    ),
    []
  );

  return (
    <Dialog>
      <DialogTrigger className="z-30 bg-background rounded-lg p-2 py-[0.62rem] hover:bg-foreground">
        <ShoppingBag size={24} className="ml-2 mr-2" />
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogDescription className="space-y-4">
            {isLoadingFeauredDrop ? (
              <>{DummyDecent()}</>
            ) : (
              <>
                {featuredDrop?.protocol === DROP_PROTOCOL_SOUND && (
                  <p>
                    <FeaturedSoundNFT {...featuredDrop} semGroupIdHex={space.clubSpaceId} />
                  </p>
                )}
                {space.pinnedLensPost && (
                    <PinnedLensPost url={space.pinnedLensPost} />
                )}
              </>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
