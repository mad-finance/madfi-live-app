import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useNetwork, useWalletClient, useSwitchNetwork } from "wagmi";
import { approveToken, parsePublicationLink, wait } from "@/utils";
import { getPost } from "@/services/lens/getPost";
import { collectPostGasless } from "@/services/lens/gaslessTxs";
import {
  MULTIRECIPIENT_COLLECT_MODULE,
} from "@/lib/consts";
import { getAccessToken } from "@/hooks/useLensLogin";
import PublicationContainer from "./PublicationContainer";

const PinnedLensPost = ({
  url,
  renderCollectButton = false,
  gated = null,
  onCollect = () => null,
  pubData,
}) => {
  const [lensPost, setLensPost] = useState(null);
  const [lensPubId, setLensPubId] = useState(null);
  const [isCollecting, setIsCollecting] = useState(false);

  useMemo(async () => {
    const pubId = parsePublicationLink(url);
    setLensPubId(pubId);

    if (pubData) {
      setLensPost(pubData);
    } else {
      const post = await getPost(pubId);

      if ((post?.profile || post?.by) && post?.metadata) {
        if (post?.by) post.profile = post.by; // HACK
        setLensPost(post);
      }
    }
  }, [url, pubData]);

  const collect = async () => {
    setIsCollecting(true);

    // HACK: for some reason the address isn't coming back in on polygon...
    const moduleAddress = lensPost.collectModule.contractAddress || MULTIRECIPIENT_COLLECT_MODULE;

    let toastId;
    try {
      toastId = toast.loading("Collecting post...");

      // if the allowance against the module is less than the fee, approve more
      await approveToken(gated.collectCurrency.address, gated.collectFee, walletClient, moduleAddress);

      // collect the post by signing and broadcasting
      await collectPostGasless(lensPubId, walletClient, await getAccessToken());

      toast.dismiss(toastId);
      toast.success("Post collected! You can join the ClubSpace when the tx is settled", { duration: 10_000 });

      onCollect();
    } catch (error) {
      console.log(error);
      toast.dismiss(toastId);
      toast.error("Error collecting post");
    }

    setIsCollecting(false);
  };

  return (
    <>
      {/* {renderHeader && (
        <h2 className="my-4 text-3xl font-bold tracking-tight sm:text-2xl md:text-4xl drop-shadow-sm text-center drop-shadow-sm">
          Sponsored Post
        </h2>
      )} */}
      <div className="flex justify-center pt-8 mb-4 text-sm gap-x-4">
        <PublicationContainer publicationId={lensPubId} shouldGoToPublicationPage={true} />
      </div>
      <div className="flex justify-center mt-4 mb-4 text-sm gap-x-4 pb-8">
        {/** NOT SHOWING THIS TILL WE KNOW THE CRETAOR HAS A MAD SBT BADGE */}
        {/* <div className="absolute right-8 bottom-2">
          <LivePoints creatorAddress={lensPost?.profile?.ownedBy?.address.toLowerCase()} isAuthenticated={isAuthenticated} />
        </div> */}
      </div>
      {lensPost && (
        <>
          <div className="flex justify-center mt-4 mb-4 text-sm gap-x-4">
            {(gated || renderCollectButton) && (
              <>
                <div className="flex gap-x-2">
                  <span>
                    <strong>{lensPost?.stats.totalAmountOfCollects}</strong>
                  </span>
                  <span className="text-gray-400">Collected</span>
                </div>
                <div className="flex gap-x-2">
                  <span>
                    <strong>{gated.collectFee}</strong>
                  </span>
                  <span className="text-gray-400">{gated.collectCurrency.symbol}</span>
                </div>
              </>
            )}
          </div>
          {(gated || renderCollectButton) ? (
            <div className="text-center my-3 px-3 w-60 mx-auto">
              <button className="!w-full btn" onClick={collect} disabled={isCollecting}>
                {parseFloat(gated.collectFee) === 0 ? "Free Collect" : "Collect"}{" "}
              </button>
            </div>
          ) : null}
        </>
      )}
    </>
  );
};

export default PinnedLensPost;
