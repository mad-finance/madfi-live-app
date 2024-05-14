import { env } from "@/env.mjs";
import axios from "axios";

export type ClubSpaceObjectWithTracks = {
  clubSpaceId: string;
  lensPubId: string;
  spinampPlaylistId: string;
  drop: {
    decentContractAddress: string;
    decentContractType: string;
    decentContractChainId: number;
    productBannerUrl: string;
    productBannerIsVideo: boolean;
    protocol: string;
  };
  partyFavorContractAddress: string;
  creatorAddress: string;
  creatorLensHandle: string;
  creatorLensProfileId: string;
  handle: string;
  semGroupIdHex: string;
  createdAt: number;
  endAt: number;
  streamURL: string;
  queuedTrackIds: string[];
};

// NEXT_PUBLIC_SPACE_API_URL,
const { SPACE_API_BEARER, RADIOMAST_API_KEY } = process.env;

const { NEXT_PUBLIC_SPACE_API_URL } = env;

const RADIOMAST_API_URL = "https://api.radiomast.io/v1";

export const startRadio = async ({ clubSpaceId, spinampPlaylistId, b2bSpinampPlaylistIds, spaceRedisKey, startAt }) => {
  const res = await axios.post(
    `${NEXT_PUBLIC_SPACE_API_URL}/stream/${clubSpaceId}`,
    { spinampPlaylistId, b2bSpinampPlaylistIds, spaceRedisKey, startAt },
    { headers: { Authorization: `Bearer ${SPACE_API_BEARER}` } }
  );

  console.log(`started radio: ${res.status}`);
};

export const getStreamURL = async ({ clubSpaceId }) => {
  try {
    const res = await axios.get(`${NEXT_PUBLIC_SPACE_API_URL}/stream/${clubSpaceId}`);

    return res.data.streamURL;
  } catch (error) {
    return null;
  }
};

export const getLiveClubspace = async (handle: string): Promise<ClubSpaceObjectWithTracks | null> => {
  try {
    const res = await axios.get(`${NEXT_PUBLIC_SPACE_API_URL}/live/${handle}?includeTracks=true`);
    return res.data;
  } catch (error) {
    return null;
  }
};

export const getCurrentTrack = async (playerUUID) => {
  try {
    const { data } = await axios.get(`${RADIOMAST_API_URL}/audioplayers/${playerUUID}/queued-tracks/`, {
      headers: { Authorization: `Token ${RADIOMAST_API_KEY}` },
    });

    return data.length ? data[0].track.song : null;
  } catch (error) {
    console.log(error.statusCode || error);

    return null;
  }
};

export const getQueuedTracks = async (playerUUID) => {
  try {
    const { data } = await axios.get(`${RADIOMAST_API_URL}/audioplayers/${playerUUID}/queued-tracks/`, {
      headers: { Authorization: `Token ${RADIOMAST_API_KEY}` },
    });

    return data?.map(({ track }) => track.song);
  } catch (error) {
    console.log(error.statusCode || error);

    return [];
  }
};
