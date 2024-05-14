import { env } from "@/env.mjs";
import {
  ControlBar,
  LiveKitRoom,
  ParticipantLoop,
  RoomAudioRenderer,
  RoomName,
  useParticipants,
  useToken,
} from "@livekit/components-react";
import { useState, useMemo } from "react";
import { DiscussionParticipant } from "@/components/discussionSpace/DiscussionParticipant"
import { PinnedPromotionDialog } from "@/components/videoSpace/PinnedPromotionDialog";

const liveKitUrl = env.NEXT_PUBLIC_LIVEPEER_URL;

export const LiveDiscussion = ({
  roomName,
  isHost,
  userIdentity,
  space,
  defaultProfile,
}: {
  roomName: string;
  isHost?: boolean;
  userIdentity: string;
  space: any;
  defaultProfile: DefaultLensProfile | undefined;
}) => {
  const metadata = useMemo(() => {
    try {
      let str = JSON.stringify({
        defaultProfile: defaultProfile ?? undefined,
        isHost: isHost ?? undefined,
      });
      return str;
    } catch (err) {
      console.log("failed to stringify metadata");
      return undefined;
    }
  }, [isHost, defaultProfile]);

  const token = useToken(env.NEXT_PUBLIC_LK_TOKEN_ENDPOINT, roomName, {
    userInfo: {
      identity: userIdentity,
      name: userIdentity,
      metadata,
    },
  });

  const [tryToConnect, setTryToConnect] = useState(false);
  const [connected, setConnected] = useState(false);

  return (
    <div data-lk-theme="default" className="relative w-full h-screen max-h-screen overflow-hidden">
      <LiveKitRoom
        token={token}
        serverUrl={liveKitUrl}
        connect={tryToConnect}
        video={false}
        audio={isHost}
        // simulateParticipants={5}
        onConnected={() => setConnected(true)}
        onDisconnected={() => {
          setTryToConnect(false);
          setConnected(false);
        }}
      >
        <div className="grid place-content-center h-full">
          <button
            className="lk-button"
            onClick={() => {
              setTryToConnect(true);
            }}
          >
            Enter Room
          </button>

          <div
            className="w-full max-w-full bottom-0 absolute px-8 h-[80%] p-4 bg-slate-600 transition-all duration-1000 grid grid-rows-[min-content_1fr_min-content]"
            style={{ bottom: connected ? "0px" : "-100%" }}
          >
            <h1 className="mb-4">
              {`Space hosted by @${space.handle}`}
            </h1>
            <Stage />
            <div className="flex flex-1 gap-2 w-full items-center justify-center">
              <ControlBar variation="minimal" controls={{ microphone: true, camera: false, screenShare: false }} />
              <PinnedPromotionDialog space={space} />
            </div>
            <RoomAudioRenderer />
          </div>
        </div>
      </LiveKitRoom>
    </div>
  );
};

const Stage = () => {
  const participants = useParticipants();

  return (
    <div className="">
      <div className="grid grid-cols-8 grid-rows-[auto] w-full h-full justify-center">
        <ParticipantLoop participants={participants}>
          <DiscussionParticipant />
        </ParticipantLoop>
      </div>
    </div>
  );
};

export default LiveDiscussion;
