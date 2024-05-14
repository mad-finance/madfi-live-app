import React, { useState, useMemo, useEffect } from "react";
import { ITrack } from "@spinamp/spinamp-sdk";
// import { IcecastPlayer } from "@madfi/ux-components";
import { groupBy } from "lodash/collection";
// import { isEmpty } from "lodash/lang";
import toast from "react-hot-toast";
// import { getUrlForImageFromIpfs } from "@/utils";
import useIsMounted from "@/hooks/useIsMounted";
import theme from "@/constants/audioPlayerTheme";

interface Props {
  streamURL: string;
  playlistTracks: ITrack[];
  queuedTrackIds: string[];
  currentTrackId?: string;
  jamAudioPlayError: boolean;
  updateTimeSpent: (time: number) => void;
};

export const LiveAudioPlayer = ({
  streamURL,
  playlistTracks,
  queuedTrackIds,
  currentTrackId,
  jamAudioPlayError,
  updateTimeSpent,
}: Props) => {
  const isMounted = useIsMounted();
  // const [_, { setProps, retryAudio }] = useJam();
  const [currentTrack, setCurrentTrack] = useState<ITrack | undefined>();
  const [nextTrack, setNextTrack] = useState<ITrack | undefined>();
  const [streamEnded, setStreamEnded] = useState<boolean>(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  const onMetadata = (metadata) => {
    if (metadata.StreamTitle === currentTrack?.id || metadata.StreamTitle === currentTrackId) return; // ignore first event

    if ((!metadata || !metadata.StreamTitle) && nextTrack === undefined) {
      toast('The stream has ended - thanks for coming!', { duration: 10000, icon: '🔥' });
      setStreamEnded(true);
      setCurrentTrack(undefined);
      setNextTrack(undefined);
    } else {
      setCurrentTrack(groupedPlaylistTracks[metadata.StreamTitle][0]);
      // @FIXME: state should not be updated directly
      // @ts-expect-error
      currentTrackIndex++;
      updateTimeSpent(currentTrackIndex);

      if (currentTrackIndex + 1 <= queuedTrackIds.length && queuedTrackIds[currentTrackIndex + 1]) {
        const nextTrackId = queuedTrackIds[currentTrackIndex + 1];
        setNextTrack(groupedPlaylistTracks[nextTrackId][0]);
        setCurrentTrackIndex(currentTrackIndex + 1);
      } else {
        setNextTrack(undefined);
      }
    }
  };

  const groupedPlaylistTracks = useMemo(() => groupBy(playlistTracks, 'id'), [playlistTracks]);

  useEffect(() => {
    if (isMounted) {
      if (currentTrackId) {
        setCurrentTrack(groupedPlaylistTracks[currentTrackId][0]);
        if (queuedTrackIds.length > 1) {
          const nextTrackId = queuedTrackIds[currentTrackIndex + 1];
          setNextTrack(groupedPlaylistTracks[nextTrackId][0]);
        }
      } else {
        setStreamEnded(true);
        return;
      }
    }
  }, [isMounted]);

  // // use first press of `play` to enable audio player for host mic
  // const onPlay = () => {
  //   if (jamAudioPlayError) {
  //     setProps('userInteracted', true);
  //     retryAudio();
  //   }
  //   setProps('forceSoundMuted', false);
  // };

  // // stop receiving audio
  // const onPause = () => {
  //   setProps('forceSoundMuted', true);
  // };

  if (streamEnded) return null;

  return (
    // <IcecastPlayer
    //   streamURL={streamURL}
    //   currentSong={{
    //     songUrl: currentTrack?.websiteUrl,
    //     project: currentTrack?.title,
    //     website: currentTrack?.websiteUrl,
    //     artist: currentTrack?.artist?.name,
    //     image: currentTrack?.lossyArtworkUrl,
    //   }}
    //   nextSong={{
    //     songUrl: nextTrack?.websiteUrl,
    //     project: nextTrack?.title,
    //     website: nextTrack?.websiteUrl,
    //     artist: nextTrack?.artist?.name,
    //     image: nextTrack?.lossyArtworkUrl,
    //   }}
    //   options={{ playbackMethod: 'html5' }}
    //   // @ts-expect-error
    //   callbackOnMetadata={onMetadata}
    //   callbackOnPlay={() => {}}
    //   callbackOnPause={() => {}}
    //   // @ts-expect-error
    //   theme={theme}
    // />
  );
};
