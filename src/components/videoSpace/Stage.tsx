import { cn } from "@/lib/utils/cn";
import {
  ParticipantLoop,
  TrackRefContext,
  TrackLoop,
  useLocalParticipantPermissions,
  useParticipantContext,
  useParticipants,
  useRemoteParticipant,
  useTracks
} from "@livekit/components-react";
import { LocalParticipant, RemoteParticipant, Track } from "livekit-client";
import { useMemo, useState } from "react";
import { useAccount } from "wagmi";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Icons,
} from "../ui";
import { CustomControls } from "./CustomControls";
import { ParticipantTile } from "./ParticipantTile";
import { ParticipantTileWithScreenShare } from "./ParticipantTileWithScreenShare";
import styles from "./videoSpace.module.css";

export const Stage = ({ space, isMobile }: { space: any, isMobile: boolean }) => {
  // const participants = useParticipants();
  // const tracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: true }, { source: Track.Source.ScreenShare, withPlaceholder: false }], { onlySubscribed: true });
  const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare], { onlySubscribed: true });
  const participants = useParticipants();
  const localPartipantPermissions = useLocalParticipantPermissions();
  const [isMuted, setIsMuted] = useState(false);

  const screenShareParticipant = useMemo(() => {
    return participants.find((p) => {
      return tracks.some((track) => track.source === Track.Source.ScreenShare);
    });
  }, [participants, tracks]);
  const hasScreenShare = screenShareParticipant !== undefined;
  // TODO: when being promoted to stage, we lose tracks without. trying this with `onlySubscribed = false`;
  // const tracksPublishing = useMemo(() => tracks?.filter((t) => !!t.publication?.track), [tracks]);

  // const tracksNotMuted = useMemo(() => {
  //   if (!isMuted) return tracks;
  //   return tracks.filter((t) => t.publication?.kind !== "audio" && t.source !== Track.Source.Microphone);
  // }, [tracks, isMuted]);
  // const currentTracks = tracksPublishing.length > 0 ? tracksPublishing.length : 1;
  return (
    <>
      <div
        className={cn(
          "h-full md:h-[62vh] w-[100vw] md:w-[60vw] 2xl:h-[72vh] 2xl:w-[65vw] relative bg-none md:p-4 rounded-2xl",
          `${isMobile ? `grid grid-rows-${tracks} md:grid-cols-2 gap-2 md:gap-6` : ""}`,
          { "grid grid-cols-2 gap-6": !hasScreenShare && !isMobile },
          { "flex items-end justify-end flex-col gap-4 overflow-hidden": hasScreenShare },
          !hasScreenShare && !isMobile && styles.stage
        )}
      >
        {tracks.length > 0 ? (
          <TrackLoop tracks={tracks}>
            <TrackRefContext.Consumer>
              {/* {(track) => track && <VideoTrack {...track} />} */}
              {(track) => (track && !hasScreenShare ? <ParticipantTile isMuted={isMuted} /> : <ParticipantTileWithScreenShare isMuted={isMuted} />)}
            </TrackRefContext.Consumer>
          </TrackLoop>
        ) : (
          <div className="flex items-center justify-center pl-4 pr-4">
            <h1 className="text-2xl text-center leading-10">Nothing to see here
              <br />
              If you're the host - connect your wallet & login with Lens
              <br />
              If you just got added/removed from the stage - try refreshing the page</h1>
          </div>
        )}
      </div>

      {/* NOT WORKING */}
      {/* Play/Pause */}
      {/* {!localPartipantPermissions?.canPublish && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-2 opacity-0 hover:opacity-75 flex items-center justify-center w-1/2 h-1/2">
          <Button variant="icon" size="md" onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <PlayIcon className="h-24 w-24 text-black" /> : <PauseIcon className="h-24 w-24 text-black" />}
          </Button>
        </div>
      )} */}

      <div className="absolute right-[16px] top-[40%] md:top-auto md:left-auto md:static -mt-16 flex items-center justify-center z-30 flex-1 gap-2 hover:opacity-100 opacity-50 transition-opacity duration-200">
        <ParticipantLoop participants={participants}>
          <ParticipantControls screenShareParticipant={screenShareParticipant} space={space} />
        </ParticipantLoop>
      </div>
    </>
    //  <GridLayout tracks={tracks}>
    //     <ParticipantTile />
    //     {/* {(track) => track && <VideoTrack {...track} />} */}
    //    </GridLayout>
  );
};

const ParticipantControls = ({
  screenShareParticipant,
  space,
}: {
  screenShareParticipant: LocalParticipant | RemoteParticipant;
  space: any;
}) => {
  const { address } = useAccount();
  const participant = useParticipantContext();
  const updatedParticipant = useRemoteParticipant(participant.identity, {
    // updateOnlyOn: [
    //   ParticipantEvent.ParticipantPermissionsChanged,
    //   ParticipantEvent.TrackPublished,
    //   ParticipantEvent.TrackSubscribed,
    //   ParticipantEvent.TrackUnpublished,
    //   ParticipantEvent.TrackUnsubscribed
    // ]
  });

  if (participant.name !== address) return null;
  if (!(updatedParticipant.permissions?.canPublish || participant.name === space.creatorAddress)) return null;

  return (
    <>
      <CustomControls
        controls={{
          microphone: true,
          camera: true,
          screenShare: screenShareParticipant ? participant?.identity === screenShareParticipant?.identity : true,
        }}
        className="border-none gap-2 flex items-center z-30 flex-col md:flex-row"
      />
      {/* TODO: handle ending stream gracefully */}
      {/* <EndStreamButton space={space} /> */}
    </>
  );
};

const EndStreamButton = ({ space }: { space: any }) => {
  const handleEndStream = async () => {
    try {
      const res = await fetch("/api/stream/end", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(space),
      });

      if (res.status === 200) {
        // window.location.reaload();
      }
    } catch (err) {
      console.error("failed to end stream", err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger className="z-30 bg-background rounded-lg p-2 py-[0.62rem] hover:bg-foreground">
        <>
          <span className="sr-only">End stream</span>
          <Icons.endStream className="w-6 h-6" />
        </>
      </DialogTrigger>
      <DialogContent className="max-w-[90%] sm:max-w-lg border-none">
        <>
          <DialogHeader className="mb-4">
            <DialogTitle className="mb-4">This will end the stream</DialogTitle>
          </DialogHeader>
          <DialogDescription className="">
            <p>Are you sure you want to continue?</p>
            <Button onClick={handleEndStream}>End stream</Button>
          </DialogDescription>
        </>
      </DialogContent>
    </Dialog>
  );
};

const useIsHost = (metadata: string) => {
  const isHost = useMemo(() => {
    try {
      const parsed = JSON.parse(metadata);
      return parsed?.isHost;
    } catch (err) {
      console.log("failed to parse host metadata, setting to false");
      return false;
    }
  }, [metadata]);
  return isHost;
};
