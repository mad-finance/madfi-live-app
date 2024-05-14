// import { FC, Fragment, useEffect, useState, useCallback, useMemo, useRef } from "react";
// import { Dialog, Menu, Popover, Transition } from "@headlessui/react";
// import { useSigner, useNetwork, useSwitchNetwork, useAccount } from "wagmi";
// import { isEmpty } from "lodash/lang";
// import toast from "react-hot-toast";
// import { use } from "use-minimal-state";
// import { useDebounce } from "use-debounce";
// import { classNames } from "@/lib/utils/classNames";
// import { buildLensShareUrl } from "@infinity-keys/react-lens-share-button";
// import { uniqBy } from "lodash/array";
// import { sortBy } from "lodash/collection";
// import { Profile, useGetProfilesOwned, useGetProfileByHandle } from "@/services/lens/getProfile";
// import { fieldNamePrivy, getUrlForImageFromIpfs, wait } from "@/utils";
// import { LensProfile, reactionsEntries } from "@/components/LensProfile";
// import { ConnectWallet } from "@/components/ConnectWallet";
// import useIsMounted from "@/hooks/useIsMounted";
// import useUnload from "@/hooks/useUnload";
// import { useGetTracksFromPlaylist } from "@/services/spinamp/getPlaylists";
// import { useLensLogin, useLensRefresh } from "@/hooks/useLensLogin";
// import { getProfileByHandle } from "@/services/lens/getProfile";
// import { doesFollow, useDoesFollow } from "@/services/lens/doesFollow";
// import { followProfileGasless, ZERO_ADDRESS } from "@/services/lens/gaslessTxs";
// import useGetClubspaceDrop from "@/hooks/useGetClubspaceDrop";
// import { HostCard } from "./HostCard";
// import { FeaturedDecentNFT } from "./FeaturedDecentNFT";
// import { FeaturedSoundNFT } from "./FeaturedSoundNFT";
// import { LiveAudioPlayer } from "./LiveAudioPlayer";
// import LensSvg from "@/assets/svg/lens.svg";
// import {
//   SITE_URL,
//   LENSTER_URL,
//   ALLOWED_CHAIN_IDS,
//   APP_NAME,
//   DROP_PROTOCOL_DECENT,
//   DROP_PROTOCOL_SOUND,
//   NEXT_PUBLIC_SITE_URL,
// } from "@/lib/consts";
// import { addToGuestList, logAction, logOverwriteAction } from "@madfi/ts-sdk";
// import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

// // import * as mockIdentities from "@/constants/mockIdentities.json";
// import DirectToClaims from "./DirectToClaims";
// import useENS from "@/hooks/useENS";
// import { FavorStatus, joinGroup } from "@/lib/claim-without-semaphore/claims";
// import axios from "axios";
// import ClaimFavorModal from "./ClaimFavorModal";
// import PinnedLensPost from "./PinnedLensPost";

// export type GateData = {
//   tier: string;
//   collectCurrency: {
//     address: string;
//     symbol: string;
//   };
//   collectFee: string;
// };

// export type SpaceType = "video" | "discussion" | "playlist";

// export type ClubSpaceObject = {
//   clubSpaceId: string;
//   createdAt: number;
//   creatorAddress: string;
//   creatorLensHandle: string;
//   creatorLensProfileId: string;
//   drop: any; // { protocol, ...data }
//   endAt: number;
//   lensPubId: string;
//   semGroupIdHex: string;
//   spinampPlaylistId: string;
//   streamURL?: string;
//   // currentTrackId?: string;
//   queuedTrackIds: [string];
//   partyFavorContractAddress: string;
//   pinnedLensPost?: string;
//   gated: GateData | string | undefined;
//   handle: string | undefined;
//   spaceType: SpaceType;
// };

// type LensProfileObject = {
//   id: string;
//   name: string;
//   bio: string;
//   picture: any;
//   handle: string;
//   coverPicture: any;
//   ownedBy: string;
//   stats: any;
// };

// type Props = {
//   isHost: boolean;
//   clubSpaceObject: ClubSpaceObject;
//   defaultProfile?: LensProfileObject;
//   address?: string;
//   isLoadingEntry: boolean;
//   setIsLoadingEntry: (x: boolean) => void;
//   handle: boolean;
//   hasBadge: boolean;
//   playerVolume: number;
//   setPlayerVolume: () => void;
// };

// const MUSIC_VOLUME_WHEN_PAUSED = 0;
// const MUSIC_VOLUME_WHEN_SPEAKING = 0.2;

// /**
//  * This component takes club space data object and handles any live aspects with streamr
//  * - connect to the streamr pub/sub client
//  * - load the history for profiles that joined and left
//  * - attempt to log an impression to privy store + join goody bag semaphore group
//  * - party
//  */
// const LiveSpace: FC<Props> = ({
//   isHost,
//   clubSpaceObject,
//   defaultProfile,
//   address,
//   isLoadingEntry,
//   setIsLoadingEntry,
//   handle,
//   hasBadge,
//   playerVolume,
//   setPlayerVolume,
// }) => {
//   const isMounted = useIsMounted();
//   const { data: signer } = useSigner();
//   const { connector: activeConnector, isConnected } = useAccount();
//   const { chain } = useNetwork();
//   const [
//     state,
//     {
//       enterRoom,
//       leaveRoom,
//       setProps,
//       updateInfo,
//       sendReaction,
//       retryMic,
//       addSpeaker,
//       removeSpeaker,
//       retryAudio,
//       addModerator,
//     },
//   ] = useJam();
//   const [currentReaction, setCurrentReaction] = useState<{ type: string; handle: string; reactionUnicode: string }[]>();
//   const [drawerProfile, setDrawerProfile] = useState<any>({});
//   const [doesFollowDrawerProfile, setDoesFollowDrawerProfile] = useState<boolean>(false);
//   const [isFollowingAction, setIsFollowingAction] = useState<boolean>(false);
//   const [audienceLoaded, setAudienceLoaded] = useState<boolean>(false);
//   const [audience, setAudience] = useState(null);
//   const [isOpen, setIsOpen] = useState<boolean>(false);
//   const [userInteracted, setUserInteracted] = useState<boolean>(false);
//   const [isHostOpen, setIsHostOpen] = useState<boolean>(false);
//   const { data: ensData, isLoading: isLoadingENS } = useENS(address);
//   const { switchNetworkAsync } = useSwitchNetwork({ onSuccess: (data) => onFollowClick(true, undefined, true) });
//   const [sendingReaction, setSendingReaction] = useState<boolean>(false);
//   const [debouncedSendingReaction] = useDebounce(sendingReaction, 5000);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [previousVolume, setPreviousVolume] = useState(playerVolume);
//   const [startTime, setStartTime] = useState(Date.now());
//   const hasJoined = useRef(false);

//   const updateTimeSpent = (currentTrackIndex: number) => {
//     logOverwriteAction(
//       address,
//       fieldNamePrivy(clubSpaceObject.clubSpaceId),
//       {
//         action: "time_spent",
//         songsListened: currentTrackIndex,
//         time: Date.now() - startTime,
//       },
//       "time_spent"
//     );
//   };

//   useEffect(() => {
//     logOverwriteAction(
//       address,
//       fieldNamePrivy(clubSpaceObject.clubSpaceId),
//       {
//         action: "joined",
//         time: Date.now(),
//       },
//       "joined"
//     );
//   }, []);

//   // @TODO: should really merge these two hook calls
//   // - first run tries to do the refresh call
//   // - all other runs force the login call
//   const { data: lensRefreshData } = useLensRefresh();
//   const { data: lensLoginData, refetch: loginWithLens } = useLensLogin();
//   const { data: doesFollowCreator, refetch: refetchDoesFollowCreator } = useDoesFollow(
//     {},
//     { followerAddress: address, profileId: clubSpaceObject.creatorLensProfileId }
//   );
//   const { data: creatorLensProfile } = useGetProfileByHandle(
//     {},
//     clubSpaceObject.creatorLensHandle,
//     "creatorLensProfile"
//   );
//   const { data: featuredDrop, isLoading: isLoadingFeauredDrop } = useGetClubspaceDrop(
//     {},
//     { drop: clubSpaceObject.drop, signer }
//   );
//   const { data: playlistTracks, isLoading: isLoadingPlaylistTracks } = useGetTracksFromPlaylist(
//     {},
//     clubSpaceObject.spinampPlaylistId
//   );

//   const shareURL = useMemo(
//     () =>
//       buildLensShareUrl({
//         postBody: "Join this space!",
//         url: `${NEXT_PUBLIC_SITE_URL}/live/${clubSpaceObject.handle}`,
//       }),
//     [clubSpaceObject]
//   );

//   const lensterPostURL = useMemo(
//     () =>
//       clubSpaceObject.lensPubId === "0"
//         ? undefined
//         : `${LENSTER_URL}/posts/${clubSpaceObject.creatorLensProfileId}-${clubSpaceObject.lensPubId}`,
//     [clubSpaceObject]
//   );

//   let [
//     reactions,
//     handRaised,
//     identities,
//     room,
//     speaking,
//     iSpeak,
//     iModerate,
//     iMayEnter,
//     myIdentity,
//     myAudio,
//     micMuted,
//     inRoom,
//     peers,
//     peerState,
//     myPeerState,
//     hasMicFailed,
//     audioPlayError,
//     isSomeMicOn,
//     forceSoundMuted,
//   ] = use(state, [
//     "reactions",
//     "handRaised",
//     "identities",
//     "room",
//     "speaking",
//     "iAmSpeaker",
//     "iAmModerator",
//     "iAmAuthorized",
//     "myIdentity",
//     "myAudio",
//     "micMuted",
//     "inRoom",
//     "peers",
//     "peerState",
//     "myPeerState",
//     "hasMicFailed",
//     "audioPlayError",
//     "isSomeMicOn",
//     "forceSoundMuted",
//   ]);

//   const myInfo = myIdentity.info;
//   const myPeerId = useMemo(() => {
//     return myInfo.id;
//   }, [myIdentity]);
//   const micOn = myAudio?.active;

//   useEffect(() => {
//     const all = peers.concat([myPeerId]).reverse(); // to get the most recent joined at the top
//     const sorted = sortBy(all, (r) => -identities[r]?.profile?.totalFollowers || 0);
//     const allWithSpeakers = room.speakers.concat(sorted); // to get the speakers at the top;
//     const unique = uniqBy(allWithSpeakers, (p) => identities[p]?.handle);

//     setAudience(unique);
//   }, [peers, identities, myPeerId, room]);

//   useEffect(() => {
//     if (iSpeak && !isHost) {
//       toast(`You are now a speaker. Enable your mic to speak and don't forget to mute yourself after!`, { icon: "🎙" });
//     }
//   }, [isHost, iSpeak]);

//   // log impression for party favor after 3 minutes
//   useEffect(() => {
//     // TODO: the 3 minute timeout
//     // if (!isLoadingEntry && clubSpaceObject.partyFavorContractAddress !== ZERO_ADDRESS && hasJoined.current) {
//     //   axios.post(`/api/privy/get-claim-status`, { groupId: clubSpaceObject.semGroupIdHex.replace(/-/g, ''), address }).then((data) => {
//     //     if (data.data.status === FavorStatus.NOT_CLAIMABLE) {
//     //       setTimeout(() => {
//     //         joinGroup(clubSpaceObject.semGroupIdHex.replace(/-/g, ''), address);
//     //       }, 180_000);
//     //     }
//     //   });
//     // }
//     if (!isLoadingEntry) {
//       addToGuestList(APP_NAME, address);
//       setStartTime(Date.now());
//     }
//   }, [isLoadingEntry, hasJoined]);

//   // debounce the reaction sending
//   useEffect(() => {
//     // console.log("debounce!", sendingReaction);
//     if (sendingReaction && debouncedSendingReaction) {
//       setSendingReaction(false);
//     }
//   }, [debouncedSendingReaction]);

//   // only lens accounts (handle includes .lens or .test)
//   const toggleDrawer = async (peerId, { handle, profile: { id }, hasBadge }) => {
//     if ([".lens", ".test"].some((ext) => handle.includes(ext))) {
//       const [profile, { doesFollow: doesFollowData }] = await Promise.all([
//         getProfileByHandle(handle),
//         doesFollow([{ followerAddress: address, profileId: id }]),
//       ]);

//       if (profile.coverPicture) {
//         const convertedCoverPic = getUrlForImageFromIpfs(profile?.coverPicture?.original?.url);
//         profile.coverPicture.original.url = convertedCoverPic;
//       }

//       if (profile.picture) {
//         const convertedProfilePic = getUrlForImageFromIpfs(profile?.picture?.original?.url);
//         profile.picture.original.url = convertedProfilePic;
//       }

//       profile.hasBadge = hasBadge;
//       profile.peerId = peerId;

//       setDrawerProfile(profile);
//       setDoesFollowDrawerProfile(doesFollowData[0].follows);
//     }

//     setIsOpen((currentState) => !currentState);
//   };

//   const onFollowClick = async (profileId: string, isFollowDrawer = true, switched = false) => {
//     logAction(address, fieldNamePrivy(clubSpaceObject.clubSpaceId), { action: "follow_lens", profileId });

//     if (!switched && ALLOWED_CHAIN_IDS[0] !== chain.id) {
//       toast("Switching chains...");
//       try {
//         await switchNetworkAsync(ALLOWED_CHAIN_IDS[0]);
//       } catch {}
//       return;
//     } else if (switched) {
//       await wait(1000);
//     }

//     setIsFollowingAction(true);

//     toast.promise(
//       new Promise<void>(async (resolve, reject) => {
//         try {
//           const accessToken = localStorage.getItem("lens_accessToken");
//           const _signer = switched ? await activeConnector.getSigner() : signer;
//           const { txHash } = await followProfileGasless(profileId, _signer, accessToken);

//           if (txHash) {
//             isFollowDrawer ? setDoesFollowDrawerProfile(true) : await refetchDoesFollowCreator();
//           }

//           setIsFollowingAction(false);

//           resolve();
//         } catch (error) {
//           console.log(error);
//           setIsFollowingAction(false);
//           reject(error);
//         }
//       }),
//       {
//         loading: "Following profile...",
//         success: "Followed!",
//         error: (error) => {
//           try {
//             const realError = typeof error === "object" ? error.toString().split("(")[0] : "";

//             if (realError.startsWith("Error: user rejected")) {
//               return realError;
//             }
//           } catch {}

//           return "Error!";
//         },
//       }
//     );
//   };

//   function closeModal() {
//     setIsOpen(false);
//   }

//   function closeHostModal() {
//     setIsHostOpen(false);
//   }

//   useEffect(() => {
//     const join = async () => {
//       if (!inRoom) {
//         await setProps("roomId", clubSpaceObject.clubSpaceId);
//         const avatar = defaultProfile?.picture?.original?.url || defaultProfile?.picture?.uri || ensData?.avatar;

//         await updateInfo({
//           handle,
//           hasBadge,
//           profile: {
//             avatar,
//             name: defaultProfile?.name,
//             totalFollowers: defaultProfile?.stats?.totalFollowers,
//             id: defaultProfile?.id,
//           },
//         });
//         console.log(`JOINING: ${clubSpaceObject.clubSpaceId}`);
//         await enterRoom(clubSpaceObject.clubSpaceId);
//         console.log("JOINED");
//         // TODO: the 3 minute timeout
//         axios
//           .post(`/api/privy/get-claim-status`, { groupId: clubSpaceObject.semGroupIdHex.replace(/-/g, ""), address })
//           .then((data) => {
//             if (data.data.status === FavorStatus.NOT_CLAIMABLE) {
//               joinGroup(clubSpaceObject.semGroupIdHex.replace(/-/g, ""), address);
//             }
//           });
//       }
//     };

//     if (
//       isMounted &&
//       (isLoadingEntry || !inRoom) &&
//       handle &&
//       (clubSpaceObject.streamURL || clubSpaceObject.emptyPlaylist) &&
//       !isEmpty(creatorLensProfile) &&
//       (!isEmpty(featuredDrop) || clubSpaceObject.pinnedLensPost)
//     ) {
//       if (!hasJoined.current) {
//         hasJoined.current = true;
//         join();
//       }
//     } else {
//       // @TODO: maybe wait for other data to load as well
//       setIsLoadingEntry(false);
//     }
//   }, [
//     clubSpaceObject.clubSpaceId,
//     defaultProfile?.id,
//     defaultProfile?.name,
//     defaultProfile?.picture?.uri,
//     defaultProfile?.picture?.original?.url,
//     defaultProfile?.stats?.totalFollowers,
//     enterRoom,
//     handle,
//     isLoadingEntry,
//     isMounted,
//     setIsLoadingEntry,
//     setProps,
//     updateInfo,
//     creatorLensProfile,
//     isConnected,
//     inRoom,
//     featuredDrop,
//   ]);

//   // HACK: when the room is created from the clubspace-sdk
//   useEffect(() => {
//     if (isMounted && inRoom && isHost) {
//       if (!iSpeak) addSpeaker(clubSpaceObject.clubSpaceId, myPeerId, process.env.NEXT_PUBLIC_CLUBSPACE_API_KEY_1);
//       if (!iModerate) addModerator(clubSpaceObject.clubSpaceId, myPeerId, process.env.NEXT_PUBLIC_CLUBSPACE_API_KEY_1);
//     }
//   }, [isMounted, inRoom, isHost, myPeerId, iSpeak, iModerate]);

//   // HACK: when the playlist is empty but we need audio on
//   useEffect(() => {
//     if (userInteracted && audioPlayError) {
//       retryAudio();
//     }
//   }, [userInteracted, audioPlayError]);

//   const startListening = () => {
//     setProps("userInteracted", true);
//     setProps("forceSoundMuted", false);
//     setUserInteracted(true);
//   };

//   useEffect(() => {
//     // if we have our mic on its already lower, or if the player is paused no need to do anything
//     if (!micMuted || forceSoundMuted || playerVolume === MUSIC_VOLUME_WHEN_PAUSED) return;
//     if (clubSpaceObject.emptyPlaylist) return;

//     if (isSomeMicOn) {
//       const lowerVolume = Math.min(MUSIC_VOLUME_WHEN_SPEAKING, playerVolume);
//       setPreviousVolume(playerVolume);
//       setPlayerVolume(lowerVolume);
//     } else {
//       // @TODO: little slope on the increment
//       setPlayerVolume(previousVolume);
//     }
//   }, [isSomeMicOn]);

//   const toggleSpeaking = () => {
//     if (!isHost && !iSpeak) return; // for sanity

//     if (micOn) {
//       setProps("micMuted", !micMuted);
//       const icon = micMuted ? "🎙" : "🔇";
//       toast(`You are ${micMuted ? "now" : "no longer"} speaking`, { icon });

//       if (forceSoundMuted) return;
//       if (clubSpaceObject.emptyPlaylist) return;

//       if (micMuted) {
//         if (playerVolume === MUSIC_VOLUME_WHEN_SPEAKING) return; // already muted

//         const lowerVolume = Math.min(MUSIC_VOLUME_WHEN_SPEAKING, playerVolume);
//         setPreviousVolume(playerVolume);
//         setPlayerVolume(lowerVolume);
//       } else {
//         setPlayerVolume(previousVolume);
//       }
//     } else {
//       // @TODO: we should not lower the volume + nofif until micOn
//       retryMic().then(() => {
//         if (!clubSpaceObject.emptyPlaylist) {
//           const lowerVolume = Math.min(MUSIC_VOLUME_WHEN_SPEAKING, playerVolume);
//           setPreviousVolume(playerVolume);
//           setPlayerVolume(lowerVolume);
//         }

//         setProps("micMuted", false);
//         if (audioPlayError) {
//           setProps("userInteracted", true);
//           retryAudio();
//         }
//         toast(`You are now speaking`, { icon: "🎙" });
//       });
//     }
//   };

//   const toggleSpeaker = (peerId) => {
//     closeModal();
//     if (room.speakers.includes(peerId)) {
//       removeSpeaker(clubSpaceObject.clubSpaceId, peerId);
//       toast(`Speaker has been removed`, { icon: "➖" });
//     } else {
//       addSpeaker(clubSpaceObject.clubSpaceId, peerId);
//       toast(`Speaker has been added`, { icon: "➕" });
//     }
//   };

//   const DummyCard = useCallback(
//     () => (
//       <div>
//         <Skeleton circle className="mx-auto block w-full" height={48} width={48} />
//         <Skeleton height={4} width={48} />
//       </div>
//     ),
//     []
//   );

//   const DummyDecent = useCallback(
//     () => (
//       <SkeletonTheme baseColor="rgb(85,13,69)" highlightColor="#8B8A8C">
//         <div>
//           <h2 className="my-4 text-4xl font-bold tracking-tight sm:text-2xl md:text-5xl drop-shadow-sm text-center">
//             Featured Drop
//           </h2>
//           <div className="flex w-full justify-center relative">
//             <div className="max-w-[20rem] min-w-[17rem]">
//               <div className="bg-slate-800 shadow-xl rounded-lg relative">
//                 <div className="photo-wrapper p-2 pt-0 overflow-hidden">
//                   <Skeleton
//                     width={272}
//                     height={262}
//                     className="!absolute t-0 left-0 right-0 w-full h-full object-cover opacity-50 rounded-md"
//                   />
//                 </div>

//                 <div className="p-2 pt-4 relative">
//                   <h3 className="text-center text-xl text-gray-300 font-medium leading-8 -mb-2">
//                     <Skeleton className="max-w-[75%]" height={14} />
//                   </h3>

//                   <p className="text-sm text-gray-500 dark:text-white mb-0 p-4 text-center">
//                     <Skeleton className="max-w-[55%]" height={4} />
//                   </p>

//                   <div className="text-center text-gray-400 text-sm font-semibold mb-5 -mt-2">
//                     <p>
//                       <Skeleton className="max-w-[55%]" height={4} />
//                     </p>
//                   </div>

//                   <div className="text-center text-gray-400 text-sm font-semibold mb-2 -mt-2">
//                     <p>
//                       <Skeleton className="max-w-[80%]" height={8} />
//                     </p>
//                   </div>

//                   <div className="flex justify-center mb-0 text-sm gap-x-4">
//                     <div className="flex gap-x-2">
//                       <span>
//                         <strong>
//                           <strong>
//                             <Skeleton className="w-full" height={3} />
//                           </strong>
//                         </strong>
//                       </span>
//                     </div>

//                     <div className="flex gap-x-2">
//                       <span>
//                         <strong>
//                           <Skeleton className="w-full" height={3} />
//                         </strong>
//                       </span>
//                     </div>
//                   </div>

//                   <div className="text-center mb-3 mt-2 px-3">
//                     <Skeleton className="btn" height={40} />
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Buttons */}
//           <div className="flex w-full justify-center relative grid-cols-2 gap-4 mt-2">
//             <Skeleton className="btn" height={35} width={95} />
//             <Skeleton className="btn" height={45} width={160} />
//           </div>
//         </div>
//       </SkeletonTheme>
//     ),
//     []
//   );

//   useUnload(async () => {
//     console.log(`LEAVING`);
//     await leaveRoom(clubSpaceObject.clubSpaceId);
//   });

//   if (isLoadingEntry) return null;

//   return (
//     <>
//       <div className="relative grow flex flex-col justify-center min-h-screen">
//         <div className="grid-live items-center justify-center px-10 lg:px-14 gap-x-3">
//           <div className="grid-container w-full audience max-h-[30rem] overflow-auto !content-baseline rounded-lg">
//             {!isConnected ? (
//               <div className="justify-center md:min-w-[40rem] p-5 z-10 bg-[rgb(30, 30, 36, 0.25)] backdrop-blur-sm items-center">
//                 <p className="animate-move-txt-bg gradient-txt text-2xl mb-5">Connect your wallet to join the space</p>
//                 <ConnectWallet showBalance={false} />
//               </div>
//             ) : null}
//             {isConnected && !!myIdentity && clubSpaceObject.emptyPlaylist && !userInteracted && (
//               <div className="justify-center md:min-w-[40rem] p-5 z-10 bg-[rgb(30, 30, 36, 0.25)] backdrop-blur-sm items-center">
//                 <button
//                   onClick={startListening}
//                   className="btn !w-full mx-auto bg-almost-black border-t-[0.5px] border-t-slate-700 !text-white flex gap-x-1"
//                 >
//                   Start Listening
//                 </button>
//               </div>
//             )}
//             {!!myIdentity && audience?.length > 0 && !isEmpty(identities) ? (
//               audience?.map((peerId, index) => {
//                 return identities[peerId] ? (
//                   <LensProfile
//                     allowDrawer={[".lens", ".test"].some((ext) => identities[peerId].handle?.includes(ext))}
//                     id={identities[peerId].profile?.id}
//                     key={identities[peerId].handle}
//                     handle={identities[peerId].handle}
//                     picture={
//                       identities[peerId].profile?.avatar
//                         ? getUrlForImageFromIpfs(identities[peerId].profile.avatar)
//                         : "/anon.png"
//                     }
//                     name={identities[peerId].profile?.name}
//                     totalFollowers={identities[peerId].profile?.totalFollowers}
//                     reaction={isEmpty(reactions[peerId]) ? null : reactions[peerId][0][0]}
//                     index={index}
//                     hasBadge={identities[peerId].hasBadge}
//                     onClick={() => {
//                       toggleDrawer(peerId, identities[peerId]);
//                     }}
//                     isHost={creatorLensProfile.id === identities[peerId].profile?.id}
//                     isSpeaker={room?.speakers?.includes(peerId)}
//                     isSpeaking={speaking.has(peerId)}
//                   />
//                 ) : null;
//               })
//             ) : (
//               <SkeletonTheme baseColor="#090407" highlightColor="#8B8A8C">
//                 {Array(4).fill(<DummyCard />)}
//               </SkeletonTheme>
//             )}

//             {/* {mockIdentities.identities.map(({ id, handle, profile }, index) => (
//               <LensProfile
//                 key={handle}
//                 handle={handle}
//                 picture={profile ? getUrlForImageFromIpfs(profile.avatar) : ""}
//                 name={profile?.name}
//                 totalFollowers={profile?.totalFollowers}
//                 index={index}
//                 onClick={toggleDrawer}
//               />
//             ))} */}
//           </div>
//           <div className="decent-nft flex flex-col gap-y-3">
//             {isLoadingFeauredDrop ? (
//               <>{DummyDecent()}</>
//             ) : (
//               <>
//                 {featuredDrop?.protocol === DROP_PROTOCOL_DECENT && (
//                   <FeaturedDecentNFT {...featuredDrop} semGroupIdHex={clubSpaceObject.clubSpaceId} />
//                 )}
//                 {featuredDrop?.protocol === DROP_PROTOCOL_SOUND && (
//                   <p>
//                     <FeaturedSoundNFT {...featuredDrop} semGroupIdHex={clubSpaceObject.clubSpaceId} />
//                   </p>
//                 )}
//                 {clubSpaceObject.pinnedLensPost && (
//                   <PinnedLensPost url={clubSpaceObject.pinnedLensPost} small={!!clubSpaceObject.drop} />
//                 )}
//               </>
//             )}
//             {creatorLensProfile && (
//               <>
//                 {(isHost || iSpeak) && (
//                   <div className="flex flex w-full justify-center relative grid-cols-2 gap-4">
//                     <div>
//                       <button
//                         onClick={toggleSpeaking}
//                         className="btn !w-full mx-auto bg-almost-black border-t-[0.5px] border-t-slate-700 !text-white flex gap-x-1"
//                       >
//                         <>
//                           {micOn && micMuted && (
//                             <span className="!w-16">
//                               {/*<MicOffSvg
//                                 className="w-5 h-5 mr-2 opacity-80 inline-block"
//                                 stroke={roomColors.buttonPrimary}
//                               />*/}
//                               🎙 Speak
//                             </span>
//                           )}
//                           {micOn && !micMuted && (
//                             <span className="!w-16">
//                               {/*<MicOnSvg
//                                 className="w-5 h-5 mr-2 opacity-80 inline-block"
//                                 stroke={roomColors.buttonPrimary}
//                               />*/}
//                               🚫 Mute
//                             </span>
//                           )}
//                           {!micOn && <>Enable Mic</>}
//                         </>
//                       </button>
//                     </div>
//                     <div>
//                       <button
//                         onClick={() => setIsHostOpen(true)}
//                         className={`btn !w-auto mx-auto bg-almost-black !text-white flex gap-x-2 relative justify-between items-center ${
//                           isSomeMicOn ? "glowing-border-club" : ""
//                         }`}
//                       >
//                         <img
//                           className="w-8 h-8 rounded-full outline outline-offset-0 outline-1 outline-gray-50"
//                           src={getUrlForImageFromIpfs(creatorLensProfile.picture?.original?.url)}
//                           alt=""
//                         />
//                         <span>@{creatorLensProfile.handle}</span>
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {!isHost && !iSpeak && (
//                   <button
//                     onClick={() => setIsHostOpen(true)}
//                     className={`btn !w-auto mx-auto bg-almost-black !text-white flex gap-x-2 relative justify-between items-center ${
//                       isSomeMicOn ? "glowing-border-club" : ""
//                     }`}
//                   >
//                     <img
//                       className="w-8 h-8 rounded-full outline outline-offset-0 outline-1 outline-gray-50"
//                       src={getUrlForImageFromIpfs(creatorLensProfile.picture?.original?.url)}
//                       alt=""
//                     />
//                     <span>@{creatorLensProfile.handle}</span>
//                   </button>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//         <div className="bg-live-page-player bg-cover bg-no-repeat blur-[70px] inset-0 absolute z-[-1] lg:max-h-[50vh] max-h-[25vh] "></div>

//         {/* Button group (reactions, share, comment) */}

//         {!isLoadingPlaylistTracks && !clubSpaceObject.emptyPlaylist && (
//           <>
//             {playlistTracks?.length && clubSpaceObject.streamURL ? (
//               <LiveAudioPlayer
//                 playlistTracks={playlistTracks}
//                 streamURL={clubSpaceObject.streamURL}
//                 playerUUID={clubSpaceObject.playerUUID}
//                 queuedTrackIds={clubSpaceObject.queuedTrackIds}
//                 currentTrackId={clubSpaceObject.queuedTrackIds[0]}
//                 updateTimeSpent={updateTimeSpent}
//                 jamAudioPlayError={audioPlayError}
//               />
//             ) : (
//               <DirectToClaims address={address} />
//             )}
//           </>
//         )}

//         {/* isHost ? */}

//         <div className="flex left-1/2 transform -translate-x-1/2 relative w-[150px] items-baseline -mt-4">
//           {handle && (
//             <Popover
//               className={({ open }) =>
//                 classNames(
//                   open ? "inset-0 z-40 overflow-y-auto" : "",
//                   "mx-auto shadow-sm lg:static bottom-0 lg:overflow-y-visible"
//                 )
//               }
//             >
//               {({ open }) => {
//                 return (
//                   <>
//                     <Menu as="div" className="relative flex-shrink-0 mb-32">
//                       <div className="flex mt-10 items-center mx-auto">
//                         <Menu.Button
//                           title="Use these wisely..."
//                           disabled={sendingReaction}
//                           className="text-club-red !bg-transparent focus:outline-none rounded-lg text-sm text-center inline-flex items-center relative"
//                         >
//                           <svg
//                             xmlns="http://www.w3.org/2000/svg"
//                             viewBox="0 0 24 24"
//                             fill={!sendingReaction ? "currentColor" : "gray"}
//                             className="w-7 h-7"
//                           >
//                             <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
//                           </svg>

//                           <span className="sr-only">Response icon heart-shape</span>
//                         </Menu.Button>
//                       </div>

//                       <Transition
//                         as={Fragment}
//                         enter="transition ease-out duration-100"
//                         enterFrom="transform opacity-0 scale-95"
//                         enterTo="transform opacity-100 scale-100"
//                         leave="transition ease-in duration-75"
//                         leaveFrom="transform opacity-100 scale-100"
//                         leaveTo="transform opacity-0 scale-95"
//                       >
//                         <Menu.Items className="absolute z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 p-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none flex gap-4 flex-wrap left-1/2 transform -translate-x-1/2">
//                           {reactionsEntries.map(([key, value]) => (
//                             <Menu.Item key={key}>
//                               {({ active }) => (
//                                 <button
//                                   onClick={() => {
//                                     try {
//                                       sendReaction(value);
//                                     } catch (error) {
//                                       console.log(error);
//                                     } finally {
//                                       setSendingReaction(true);
//                                     }
//                                   }}
//                                 >
//                                   {value}
//                                 </button>
//                               )}
//                             </Menu.Item>
//                           ))}
//                         </Menu.Items>
//                       </Transition>
//                     </Menu>

//                     <Popover.Panel className="" aria-label="Global"></Popover.Panel>
//                   </>
//                 );
//               }}
//             </Popover>
//           )}

//           <button
//             className={`text-white !bg-transparent focus:outline-none rounded-lg text-sm text-center inline-flex items-center relative ml-5 ${
//               lensterPostURL ? "" : "mr-7"
//             }`}
//             onClick={() => window.open(shareURL, "_blank")}
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 24 24"
//               strokeWidth={1.5}
//               stroke="currentColor"
//               className="w-7 h-7"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
//               />
//             </svg>

//             <span className="sr-only">Share icon</span>
//           </button>

//           {lensterPostURL && (
//             <button
//               className={
//                 "text-white focus:ring-4 focus:outline-none font-medium rounded-full text-sm py-2 px-6 text-center inline-flex items-center mr-2  focus:ring-indigo-800 !m-0 max-h-[40px]"
//               }
//               onClick={() => window.open(lensterPostURL, "_blank")}
//             >
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 strokeWidth={1.5}
//                 stroke="currentColor"
//                 className="w-7 h-7"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
//                 />
//               </svg>
//             </button>
//           )}
//           {clubSpaceObject.partyFavorContractAddress !== ZERO_ADDRESS && isConnected && (
//             <button
//               onClick={() => setModalOpen(true)}
//               className="text-white !bg-transparent focus:outline-none rounded-lg text-[32px] text-center inline-flex items-center relative"
//             >
//               🎁
//             </button>
//           )}
//         </div>
//       </div>

//       {/* Start Drawer */}

//       <Transition appear show={isOpen} as={Fragment}>
//         <Dialog as="div" className="relative z-10" onClose={closeModal}>
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-black bg-opacity-25" />
//           </Transition.Child>

//           <div className="fixed bottom-[-20px] left-1/2 transform -translate-x-1/2 w-[375px]">
//             <div className="flex min-h-full items-center justify-center p-4 text-center">
//               <Transition.Child
//                 as={Fragment}
//                 enter="ease-out duration-300 transform"
//                 enterFrom="opacity-0 scale-95 translate-y-[100%]"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200 transform"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95 translate-y-[100%]"
//               >
//                 <Dialog.Panel className="relative w-full max-w-md transform overflow-hidden rounded-tl-[35px] rounded-tr-[35px] bg-black p-6 text-left align-middle shadow-xl transition-all min-h-[20rem] pt-[155px]">
//                   <div className={`absolute top-0 right-0 h-[125px] w-full shimmer`}>
//                     <img
//                       className="absolute t-0 left-0 right-0 w-full h-full object-cover"
//                       src={drawerProfile?.coverPicture?.original?.url || "/default-cover.jpg"}
//                       alt=""
//                     />
//                     <img
//                       src={drawerProfile?.picture?.original?.url || "/anon.png"}
//                       alt=""
//                       className={`rounded-full w-12 h-12 aspect-square relative border-black-[4px] top-3/4 left-[5%] outline outline-offset-0 outline-2 ${
//                         drawerProfile?.hasBadge ? "outline-red-600" : "outline-black"
//                       }`}
//                     />
//                   </div>
//                   <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
//                     <div className="flex justify-between items-center">
//                       <div className="flex flex-col">
//                         <div className="mb-[-3px] text-white">
//                           <span>{drawerProfile?.name}</span>
//                         </div>
//                         <div className="text-gray-500">@{drawerProfile?.handle}</div>
//                         {drawerProfile?.hasBadge ? (
//                           <span className="text-sm badge-holder mt-1">✔️ ClubSpace Badge Holder</span>
//                         ) : null}
//                       </div>
//                     </div>
//                   </Dialog.Title>
//                   <div className="mt-2">
//                     <p className="text-sm text-white mb-6">{drawerProfile.bio || <em>No bio provided.</em>}</p>

//                     {defaultProfile?.id && drawerProfile?.id !== defaultProfile?.id && (
//                       <button
//                         className="!w-auto btn mb-4"
//                         onClick={() => {
//                           onFollowClick(drawerProfile.id);
//                         }}
//                         disabled={doesFollowDrawerProfile || isFollowingAction}
//                       >
//                         <LensSvg height={20} className={"pr-3"} />
//                         {doesFollowDrawerProfile ? "Following" : "Follow"}
//                       </button>
//                     )}

//                     {/**
//                       <button className="flex gap-x-4 items-center">
//                         <Envelope />
//                         <span>Send Direct Message</span>
//                       </button>
//                       */}

//                     {isHost && room && drawerProfile.peerId !== myPeerId && (
//                       <button className="!w-auto btn" onClick={() => toggleSpeaker(drawerProfile.peerId)}>
//                         {room?.speakers?.includes(drawerProfile.peerId) ? "Remove Speaker" : "Promote to Speaker"}
//                       </button>
//                     )}
//                   </div>
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>

//       {/* Start Host Modal */}

//       <Transition appear show={isHostOpen} as={Fragment}>
//         <Dialog as="div" className="relative z-10" onClose={closeHostModal}>
//           <Transition.Child
//             as={Fragment}
//             enter="ease-out duration-300"
//             enterFrom="opacity-0"
//             enterTo="opacity-100"
//             leave="ease-in duration-200"
//             leaveFrom="opacity-100"
//             leaveTo="opacity-0"
//           >
//             <div className="fixed inset-0 bg-black bg-opacity-25" />
//           </Transition.Child>

//           <div className="fixed inset-0 overflow-y-auto">
//             <div className="flex min-h-full items-center justify-center p-4 text-center">
//               <Transition.Child
//                 as={Fragment}
//                 enter="ease-out duration-300"
//                 enterFrom="opacity-0 scale-95"
//                 enterTo="opacity-100 scale-100"
//                 leave="ease-in duration-200"
//                 leaveFrom="opacity-100 scale-100"
//                 leaveTo="opacity-0 scale-95"
//               >
//                 <Dialog.Panel className="transform overflow-hidden rounded-2xl bg-none text-left align-middle shadow-xl transition-all">
//                   {creatorLensProfile && (
//                     <HostCard
//                       profile={creatorLensProfile}
//                       drawerProfileId={creatorLensProfile.id}
//                       doesFollowDrawerProfile={doesFollowCreator}
//                       onFollowClick={onFollowClick}
//                       isFollowingAction={isFollowingAction}
//                       isHost={isHost}
//                       loginWithLens={loginWithLens}
//                     />
//                   )}
//                 </Dialog.Panel>
//               </Transition.Child>
//             </div>
//           </div>
//         </Dialog>
//       </Transition>
//       {clubSpaceObject.partyFavorContractAddress !== ZERO_ADDRESS && (
//         <ClaimFavorModal
//           isOpen={modalOpen}
//           setIsOpen={setModalOpen}
//           semGroupIdHex={clubSpaceObject.semGroupIdHex.replace(/-/g, "")}
//           address={address}
//         />
//       )}
//     </>
//   );
// };

// export default LiveSpace;
