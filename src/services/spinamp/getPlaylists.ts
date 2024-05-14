import {
  fetchCollectorPlaylists,
  fetchPlaylistById,
  fetchTracksByIds,
  IPlaylist,
  ITrack
} from "@spinamp/spinamp-sdk";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

export const useGetPlaylistsFromAddress = (options: UseQueryOptions = {}, address: string) => {
  const result = useQuery<IPlaylist[] | null>(
    ["playlists", address],
    async () => {
      const result = await fetchCollectorPlaylists(address);

      return result;
    },
    {
      ...(options as any),
      enabled: !!address,
    }
  );

  return result;
};

export const useGetTracksFromPlaylist = (options: UseQueryOptions = {}, playlistId) => {
  const result = useQuery<ITrack[] | null>(
    ["tracks", playlistId],
    async () => {
      const { playlist } = await fetchPlaylistById(playlistId);
      return await fetchTracksByIds(playlist.trackIds);
    },
    {
      ...(options as any),
      enabled: !!playlistId,
    }
  );

  return result;
};
