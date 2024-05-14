import { cn } from "@/lib/utils/cn";
import getLensPictureURL from "@/lib/utils/getLensPictureURL";
import { DefaultLensProfile } from "@/types/lens";
import { isParticipantSourcePinned, type TrackReferenceOrPlaceholder } from "@livekit/components-core";
import {
  AudioTrack,
  FocusToggle,
  ParticipantContextIfNeeded,
  ParticipantName,
  ParticipantTileProps,
  TrackMutedIndicator,
  useEnsureParticipant,
  useMaybeLayoutContext,
  useTrackRefContext,
  useParticipantTile,
  VideoTrack
} from "@livekit/components-react";
import { Track } from "livekit-client";
import { ReactNode, useCallback } from "react";
import styles from "./videoSpace.module.css";

interface ParticipantTilePropsExtended extends ParticipantTileProps {
  isMuted: boolean; // mutes all tracks
}

export const ParticipantTile = ({
  participant,
  children,
  source = Track.Source.Camera,
  onParticipantClick,
  publication,
  disableSpeakingIndicator,
  isMuted,
  ...htmlProps
}: ParticipantTilePropsExtended): ReactNode => {
  const p = useEnsureParticipant(participant);
  const trackRef: TrackReferenceOrPlaceholder = useTrackRefContext() ?? {
    participant: p,
    source,
    publication,
  };

  const { elementProps } = useParticipantTile<HTMLDivElement>({
    participant: trackRef.participant,
    htmlProps,
    source: trackRef.source,
    publication: trackRef.publication,
    disableSpeakingIndicator,
    onParticipantClick,
  });

  const layoutContext = useMaybeLayoutContext();

  const handleSubscribe = useCallback(
    (subscribed: boolean) => {
      if (
        trackRef.source &&
        !subscribed &&
        layoutContext &&
        layoutContext.pin.dispatch &&
        isParticipantSourcePinned(trackRef.participant, trackRef.source, layoutContext.pin.state)
      ) {
        layoutContext.pin.dispatch({ msg: "clear_pin" });
      }
    },
    [trackRef.participant, layoutContext, trackRef.source]
  );

  // TODO:
  // if (isMuted && (trackRef.publication?.kind === "audio" && trackRef.source || Track.Source.Microphone)) return null;

  const { metadata, sid } = p;

  const { defaultProfile, isHost, ensData }: { defaultProfile?: DefaultLensProfile; isHost: boolean, ensData: any } = JSON.parse(metadata);

  return (
    <div
      {...elementProps}
      className={cn("rounded-2xl flex flex-col gap-1 overflow-hidden relative", styles.participantTile)}
    >
      <ParticipantContextIfNeeded participant={trackRef.participant}>
        {children ?? (
          <>
            {trackRef.source === Track.Source.ScreenShare && (
              <div className="absolute top-0 left-0 p-1 z-0">
                <VideoTrack
                  participant={trackRef.participant}
                  source={trackRef.source}
                  publication={trackRef.publication}
                  onSubscriptionStatusChanged={handleSubscribe}
                  className="rounded-2xl"
                />
              </div>
            )}
            {trackRef.publication?.kind === "video" || trackRef.source === Track.Source.Camera ? (
              <>
                {!trackRef.publication.track.isMuted ? (
                  <VideoTrack
                    participant={trackRef.participant}
                    source={trackRef.source}
                    publication={trackRef.publication}
                    onSubscriptionStatusChanged={handleSubscribe}
                    className="rounded-2xl w-full h-full"
                  />
                ) : (
                  <div className="absolute bg-black inset-0 flex items-center justify-center pointer-events-none rounded-2xl">
                    <img
                      src={defaultProfile?.metadata ? getLensPictureURL(defaultProfile) : (ensData?.avatar || "./anon.png")}
                      alt={defaultProfile?.handle ? defaultProfile?.handle.localName : (ensData?.avatar || p.identity)}
                      className="rounded-full aspect-square w-32 h-32"
                    />
                  </div>
                )}
              </>
            ) : (
              <AudioTrack
                participant={trackRef.participant}
                source={trackRef.source}
                publication={trackRef.publication}
                onSubscriptionStatusChanged={handleSubscribe}
              />
            )}
            <div className="top-0 md:top-auto absolute md:flex md:flex-row md:items-center justify-between gap-2 leading-none bottom-1 inset-x-1">
              <div className="flex items-center p-1 pl-2">
                {/* <TrackMutedIndicator source={Track.Source.Microphone} show={"muted"}></TrackMutedIndicator> */}
                <DisplayName defaultProfile={defaultProfile} ensData={ensData} />
              </div>
              {/* <ConnectionQualityIndicator className="lk-participant-metadata-item" /> */}
            </div>
          </>
        )}
        <FocusToggle trackSource={trackRef.source} />
      </ParticipantContextIfNeeded>
    </div>
  );
};

const DisplayName = ({ defaultProfile, ensData }: { defaultProfile?: DefaultLensProfile, ensData?: any }) => {
  if (defaultProfile?.handle) {
    return (
      <span className="text-white text-lg font-bold select-none">@{defaultProfile.handle.localName}</span>
    );
  }
  if (ensData?.handle) {
    return (
      <span className="text-white text-lg font-bold select-none">{ensData.handle}</span>
    );
  }
  return <ParticipantName />;
};
