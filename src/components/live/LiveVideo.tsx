import { env } from "@/env.mjs";
import { LiveKitRoom, RoomAudioRenderer, useToken } from "@livekit/components-react";
import { useEffect, useMemo, useState } from "react";
// import jwt, { type JwtPayload } from "jwt-decode";
// import { ParticipantList } from "../videoSpace/ParticipantList";
import useIsMounted from "@/hooks/useIsMounted";
import { DefaultLensProfile } from "@/types/lens";
import { useAccount } from "wagmi";
import Chat from "../Chat";
import { Footer } from "../MadfiFooter";
import { HostInfo } from "../videoSpace/HostInfo";
import SponsoredPost from "../videoSpace/SponsoredPost";
import { Stage } from "../videoSpace/Stage";

const liveKitUrl = env.NEXT_PUBLIC_LIVEPEER_URL;

export const LiveVideo = ({
  roomName,
  userIdentity,
  defaultProfile,
  ensData,
  space,
}: {
  roomName: string;
  userIdentity: string;
  defaultProfile?: DefaultLensProfile;
  ensData?: any;
  space: any;
}) => {
  const { address, isConnected } = useAccount();
  const isMounted = useIsMounted();
  const [tryToConnect, setTryToConnect] = useState(false);
  const [connected, setConnected] = useState(false);
  const [chatOpacity, setChatOpacity] = useState(1);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    if (isMounted) {
      setTryToConnect(true);
    }
  }, [isMounted]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const metadata = useMemo(() => {
    if (!isConnected) return;

    try {
      let str = JSON.stringify({
        defaultProfile: defaultProfile ?? undefined,
        ensData: ensData ?? undefined,
        address,
      });
      return str;
    } catch (err) {
      console.log("failed to stringify metadata");
      return undefined;
    }
  }, [defaultProfile, ensData, address, isConnected]);

  const userInfo = useMemo(() => {
    return {
      identity: userIdentity,
      name: userIdentity,
      metadata,
      creatorAddress: space.creatorAddress,
    };
  }, [userIdentity, metadata, space]);

  const toggleChatOpacity = () => {
    setChatOpacity(chatOpacity === 1 ? 0 : 1)
  }

  const token = useToken(env.NEXT_PUBLIC_LK_TOKEN_ENDPOINT, roomName, { userInfo });

  return (
    <div
      className="w-full bg-background"
      style={{ height: 'calc(100vh - 88px)' }}
    >
      <LiveKitRoom
        token={token}
        serverUrl={liveKitUrl}
        connect={tryToConnect}
        audio={true}
        // simulateParticipants={2}
        onConnected={() => setConnected(true)}
        onDisconnected={() => {
          setTryToConnect(false);
          setConnected(false);
        }}
      >
        <div className="flex md:max-w-[85%] max-width-[100%] mx-auto items-center w-full h-[100%] min-[1921px]:h-[80%] md:mb-18">
          <div className="flex md:gap-9 flex-1 h-full md:h-auto">
            <div className="flex-1 max-w-fit h-full md:h-auto">
              <div className="relative h-full md:h-auto" onClick={toggleChatOpacity}>
                <Stage isMobile={isMobile} space={space} />
              </div>
              <div className={`w-full pt-[24px] pb-[24px] ${space.creatorAddress !== address ? 'md:mt-16' : 'md:mt-8'}`}>
                <HostInfo space={space} />
              </div>
              <RoomAudioRenderer />
            </div>

            <div className="w-full max-w-sm rounded-2xl pt-4 max-h-[80%]">
              <SponsoredPost opacity={isMobile ? chatOpacity : 1} space={space} />
              <Chat isMobile={isMobile} opacityToggled={toggleChatOpacity} opacity={chatOpacity} viewerName={userIdentity} />
            </div>
          </div>
          {/* <DebugMode /> */}
        </div>
      </LiveKitRoom>
      <span className="md:block hidden">
        <Footer />
      </span>
    </div>
  );
};

export default LiveVideo;
