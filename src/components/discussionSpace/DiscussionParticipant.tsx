import { useDataChannel, useIsSpeaking, useParticipantContext} from "@livekit/components-react";
import { useMemo, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import type { DataSendOptions, ReceivedDataMessage } from "@livekit/components-core";
import { DefaultLensProfile } from "@/types/lens";
import { classNames } from "@/lib/utils/classNames";
import { getUrlForImageFromIpfs } from "@/utils";
import { Icons } from "../ui";
import { HostSection } from "./HostSection";
import { ReactionsDialog } from "@/components/ReactionsDialog";
import getLensPictureURL from "@/lib/utils/getLensPictureURL";

const decoder = new TextDecoder();


const ReactionMsg = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="absolute bottom-0 right-0 z-20">
      <div className="opacity-0 flex items-center justify-center w-6 h-6 text-4xl rounded-full animate-fade-in-and-out-up">
        {children}
      </div>
    </div>
  );
};

export const DiscussionParticipant  = () => {
  // const { participant, source } = useTrackContext();
  const [localParticipantMessage, setLocalParticipantMessage] = useState<string | undefined>();
  const [remoteParticipantMessage, setRemoteParticipantMessage] = useState<string | undefined>();
  const participant = useParticipantContext();
  // const participants = useParticipants();
  // @TODO: to create the "request to speak" I think we just need the address
  // then we can call the getParticipant on the server to livepeer and that has
  // the metadata, which gives the sid we need to send the message only to the host
  const { metadata} = participant;

  const onMessage = (message: ReceivedDataMessage<"reactions">) => {
    setRemoteParticipantMessage(decoder.decode(message?.payload));
    // console.warn(
    //   `%cmessage || decoded ${decoder.decode(message?.payload)}`,
    //   "🐦;background: lightblue; color: #444; padding: 3px; border-radius: 5px;"
    // );
  };

  const { message, send } = useDataChannel("reactions", onMessage);

  const { defaultProfile, isHost }: { defaultProfile: DefaultLensProfile; isHost: boolean } = useMemo(() => {
    if (!!metadata) {
      try {
        console.log(metadata)
        return JSON.parse(metadata);
      } catch (err) {
        console.error("couldn't parse metadata", err);
      }
    }
    return { defaultProfile: {}, isHost: false };
  }, [metadata]);
  // console.log(`metadata from participant ${sid}\n${metadata}`);
  // const { source } = participant && participant.getTrackByName(Track.Source.Microphone);
  const { address } = useAccount();

  const isSpeaking = useIsSpeaking(participant);
  const isMuted = !participant.isMicrophoneEnabled;
  // useIsMuted(source);
  // const room = useRoomInfo();

  const participantPermissions = participant.permissions;

  const handleMessageSend = async (payload: Uint8Array, options?: DataSendOptions): Promise<void> => {
    setLocalParticipantMessage(decoder.decode(payload));
    send(payload, options);
    return;
  };

  useEffect(() => {
    // hack local message
    let timeout: NodeJS.Timeout;
    if (localParticipantMessage) {
      timeout = setTimeout(() => {
        setLocalParticipantMessage(undefined);
      }, 2000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [localParticipantMessage]);

  useEffect(() => {
    // clear remote message
    let timeout: NodeJS.Timeout;
    if (remoteParticipantMessage) {
      timeout = setTimeout(() => {
        setRemoteParticipantMessage(undefined);
      }, 2000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [remoteParticipantMessage]);

  const name = useMemo(() => defaultProfile?.handle ? `@${defaultProfile.handle.localName}` : participant.identity, [defaultProfile, participant]);

  return (
    <section className="relative min-w-0" title={name} key={name}>
      <div className="relative w-24 h-24 min-w-0">
        <div
          className={classNames(
            `rounded-full border-2 p-0.5 transition-colors duration-1000`,
            // can have just regular border as we now have access to speaking source to update in real time
            isSpeaking ? "border-tranparent" : "glowing-border-club"
          )}
        >
          <div className="z-10 grid aspect-square items-center overflow-hidden rounded-full bg-beige transition-all will-change-transform">
            <img
              src={defaultProfile?.metadata ? getLensPictureURL(defaultProfile) : "/anon.png"}
              alt={defaultProfile?.handle ? defaultProfile.handle.localName : participant.identity}
              className="fade-in"
              width={150}
              height={150}
            />
          </div>
          {localParticipantMessage && <ReactionMsg>{localParticipantMessage}</ReactionMsg>}
          {remoteParticipantMessage && message.from.identity === participant.identity && (
            <ReactionMsg>{remoteParticipantMessage}</ReactionMsg>
          )}
        </div>
        <div
          style={{ opacity: isMuted || !participantPermissions?.canPublish ? 1 : 0 }}
          className="absolute bottom-[7%] bg-red-600 right-[7%] rounded-full transition-opacity duration-200 ease-in-out p-1 z-10"
        >
          <div className="aspect-square grid place-content-center">
            <Icons.micOff className="m-1 opacity-100 w-4 h-4" />
          </div>
        </div>
      </div>
      {!isHost && participant.name !== address && <HostSection participant={participant} />}
      {participant.name === address && (
        <ReactionsDialog send={handleMessageSend} isSending={!!localParticipantMessage} />
      )}
    </section>
  );
};
