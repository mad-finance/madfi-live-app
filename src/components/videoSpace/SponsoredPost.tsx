import { Button } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { useAuthenticatedProfileId } from "@/hooks/useLensLogin";
import { BONSAI_TOKEN_ADDRESS, BONSAI_TOKEN_DECIMALS, IS_PRODUCTION, JSON_RPC_URL_ALCHEMY_MAP, TIP_ACTION_MODULE_EVENT_ABI, VALID_CHAIN_ID } from "@/lib/consts";
import { LENS_ENVIRONMENT } from "@/services/lens/client";
import { getPost } from "@/services/lens/getPost";
import actWithActionHandler from "@/services/madfi/actWithActionHandler";
import { kFormatter, parsePublicationLink, roundedToFixed, wait } from "@/utils";
import { ProfileId, useProfile } from "@lens-protocol/react-web";
import { useChat } from "@livekit/components-react";
import { useSupportedActionModule } from "@madfi/widgets-react";
import { groupBy } from "lodash/collection";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { createPublicClient, decodeEventLog, formatUnits, http, parseUnits } from "viem";
import { polygon, polygonMumbai } from "viem/chains";
import { useAccount, useBalance, useNetwork, useSwitchNetwork, useWalletClient } from "wagmi";
import PinnedLensPost from "../PinnedLensPost";
import { getProfilesOwnedMultiple } from "@/services/lens/getProfile";
import { MAX_UINT, getApprovalAmount, approveToken } from "@/services/erc20/approvals";
import { confetti } from "@tsparticles/confetti"

const SponsoredPost = ({ space, opacity }) => {
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const { data: authenticatedProfileId } = useAuthenticatedProfileId();
  const { data: authenticatedProfile } = useProfile({
    forProfileId: authenticatedProfileId as ProfileId,
  });
  const { data: bonsaiTokenBalanace } = useBalance({
    address,
    watch: true,
    chainId: VALID_CHAIN_ID,
    cacheTime: 5_000,
    token: BONSAI_TOKEN_ADDRESS
  });
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork({ onSuccess: (data) => sendTip(true) });
  const { send } = useChat();

  const [lensPost, setLensPost] = useState(null);
  const [lensPubId, setLensPubId] = useState(null);
  const [isTipping, setIsTipping] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(100);
  const [open, setOpen] = useState(false);

  const {
    isActionModuleSupported,
    actionModuleHandler,
    isLoading: isLoadingActionModule,
  } = useSupportedActionModule(
    LENS_ENVIRONMENT,
    lensPost,
    authenticatedProfileId,
    walletClient
  );

  useMemo(async () => {
    if (!space.pinnedLensPost) return;

    const pubId = parsePublicationLink(space.pinnedLensPost);
    const post = await getPost(pubId);

    if ((post?.profile || post?.by) && post?.metadata) {
      if (post?.by) post.profile = post.by; // HACK
      setLensPubId(pubId);
      setLensPost(post);
    }
  }, [space]);

  const tippingEnabled = useMemo(() => {
    if (isActionModuleSupported && !isLoadingActionModule) {
      const { metadata } = actionModuleHandler.getActionModuleConfig();
      return metadata?.metadata?.name === "TipActionModule";
    }
  }, [isActionModuleSupported, isLoadingActionModule, actionModuleHandler]);


  const fetchProfileHandlesForToast = async (datas) => {
    // TODO: cannot do this as their event only contains tx executor
    // const senders = datas.map(({ args }) => args.actorProfileAddress);
    // const profiles = await getProfilesOwnedMultiple(senders);

    // HACK: trying to fetch from redis cache
    const txHashes = datas.map(({ transactionHash }) => transactionHash);
    const grouped = groupBy(datas, "transactionHash");
    const response = await fetch("/api/redis/get-tippers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ txHashes }),
    });
    const tippers = await response.json();
    tippers.forEach(({ txHash, handle }) => {
      const name = handle ? `@${handle}` : "Someone";
      const amount = formatUnits(grouped[txHash][0].event.args.tipAmount, 18);
      toast(`${name} tipped ${amount} $bonsai`, { duration: 10000, icon: "🤑" });
    });
  }

  useEffect(() => {
    if (tippingEnabled) {
      const chain = IS_PRODUCTION ? polygon : polygonMumbai;
      const publicClient = createPublicClient({
        chain,
        transport: http(JSON_RPC_URL_ALCHEMY_MAP[chain.id]),
      });
      publicClient.watchContractEvent({
        address: actionModuleHandler.address,
        abi: TIP_ACTION_MODULE_EVENT_ABI,
        eventName: "TipCreated",
        onLogs: (logs: any[]) => {
          const datas: { transactionHash?: `0x${string}`, event?: { args?: any } }[] = logs
            .map((l) => {
              try {
                const event = decodeEventLog({ abi: TIP_ACTION_MODULE_EVENT_ABI, data: l.data, topics: l.topics });
                return { event, transactionHash: l.transactionHash };
              } catch { }
            })
            .filter((d) => d);

          fetchProfileHandlesForToast(datas);
        }
      })
    }
  }, [tippingEnabled]);

  const shootConfetti = () => {
    confetti({
      angle: 45,
      particleCount: 100,
      spread: 70,
      origin: { y: 0.5, x: 0.0 },
    });
    confetti({
      angle: 135,
      particleCount: 100,
      spread: 70,
      origin: { y: 0.5, x: 1 },
    });
  }

  const sendTip = async (switched = false) => {
    setIsTipping(true);

    if (!switched && VALID_CHAIN_ID !== chain.id) {
      toast("Switching chains...");
      try {
        await switchNetworkAsync(VALID_CHAIN_ID);
      } catch (error) {
        setIsTipping(false);
      }
      return;
    } else if (switched) {
      await wait(1000);
    }

    // approve $bonsai on the tip handler first
    const approvalAmount = await getApprovalAmount(BONSAI_TOKEN_ADDRESS, address, actionModuleHandler.address);
    let toastId;
    if (approvalAmount < parseUnits(selectedAmount.toString(), BONSAI_TOKEN_DECIMALS)) {
      toastId = toast.loading("Approving tokens...");
      await approveToken(walletClient, BONSAI_TOKEN_ADDRESS, actionModuleHandler.address);
    }

    toastId = toast.loading("Sending tip", { id: toastId });

    let success = false
    try {
      const txHash = await actWithActionHandler(
        actionModuleHandler,
        walletClient,
        authenticatedProfile,
        {
          currency: BONSAI_TOKEN_ADDRESS,
          currencyDecimals: BONSAI_TOKEN_DECIMALS,
          tipAmountEther: selectedAmount.toString()
        }
      );
      shootConfetti()
      toast.success("Tipped!", { id: toastId, duration: 5000 });

      setOpen(false);
      setIsTipping(false);

      // HOTFIX: until open action sends the actor in the event, cache the txId => profileHandle
      await fetch("/api/redis/set-tipper", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ txHash, profileHandle: authenticatedProfile.handle?.localName, spaceExp: space.exp }),
      });
      success = true
    } catch (error) {
      console.log(error);
      setOpen(false);
      toast.error("Failed to send", { id: toastId });
    }
  };

  if (!space.pinnedLensPost) return (
    <div className="rounded-t-2xl min-w-[20rem] max-w-full min-h-[3rem] bg-black m-auto p-4 -mt-4 drop-shadow-sm cursor-pointer">
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div
          className="transition ease-in-out duration-300 absolute top-[24px] right-[12px] md:static rounded-2xl md:rounded-t-2xl md:rounded-b-none min-w-[20rem] max-w-full max-h-[7.8rem] bg-black m-auto bg-opacity-30 md:bg-opacity-100 p-4 -mt-4 drop-shadow-sm cursor-pointer"
          style={{ opacity: opacity }}
        >
          {/* regular post preview */}
          {!tippingEnabled || !authenticatedProfileId && (
            <>
              <div className="flex mb-3">
                <span className="text-gray-500 text-sm">post by @{lensPost?.profile?.handle.localName}</span>
              </div>
              <p className="mb-2 truncate max-h-[2.5rem] pb-1 overflow-hidden line-clamp-2 text-left pb-2">{lensPost?.metadata?.content}</p>
              <p className="text-xs text-club-red absolute right-4 bottom-2">See more</p>
            </>
          )}
          {/* tips */}
          {tippingEnabled && authenticatedProfileId && (
            <>
              <div className="flex mb-3">
                <p className="mb-2 truncate max-h-[2.5rem] pb-1 overflow-hidden line-clamp-3 text-left pb-2">{lensPost?.metadata?.content}</p>
              </div>
              <p className="text-xs text-club-red absolute right-4 bottom-2">Tip $bonsai</p>
            </>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg md:max-w-xl max-h-screen">
        <DialogHeader>
          <DialogDescription className="space-y-4">
            {lensPost && (!tippingEnabled || !authenticatedProfileId) && (
              <PinnedLensPost
                url={space.pinnedLensPost}
                small={false}
                pubData={lensPost}
              />
            )}
            {tippingEnabled && authenticatedProfileId && (
              <div className="gap-y-8">
                <h2 className="my-4 text-3xl font-bold tracking-tight sm:text-2xl md:text-4xl drop-shadow-sm text-center drop-shadow-sm">
                  Send a $bonsai tip
                </h2>
                <div className="flex justify-center mb-4 text-sm gap-x-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center my-3 px-3">
                      <Button variant={selectedAmount === 50 ? "default" : "white"} onClick={() => setSelectedAmount(50)} disabled={isTipping}>
                        50
                      </Button>
                    </div>
                    <div className="text-center my-3 px-3">
                      <Button variant={selectedAmount === 100 ? "default" : "white"} onClick={() => setSelectedAmount(100)} disabled={isTipping}>
                        100
                      </Button>
                    </div>
                    <div className="text-center my-3 px-3">
                      <Button variant={selectedAmount === 250 ? "default" : "white"} onClick={() => setSelectedAmount(250)} disabled={isTipping}>
                        250
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="text-center my-3 px-3 mt-8">
                  <p className="text-lg text-secondary/70">
                    Balance: {bonsaiTokenBalanace?.formatted ? kFormatter(parseFloat(roundedToFixed(parseFloat(bonsaiTokenBalanace.formatted)))) : 0.0}{" $bonsai"}
                  </p>
                </div>
                <div className="text-center my-3 px-3 mt-8">
                  <Button onClick={sendTip} disabled={isTipping} size="lg">
                    Send tip
                  </Button>
                </div>
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default SponsoredPost;
