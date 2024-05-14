import Cors from "cors";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { getAddress } from "ethers/lib/utils";
import { env } from "@/env.mjs";
import redisClient from "@/lib/utils/redisClient";
// import { startRadio } from "@/services/radio";
import {
  REDIS_SPACE_PREFIX,
  REDIS_SPACE_EXP,
  NEXT_PUBLIC_SITE_URL,
  LIVEPEER_STUDIO_API,
  MADFI_API_URL,
} from "@/lib/consts";

const cors = Cors({
  methods: ["HEAD", "POST", "GET"],
});

const {
  SPACE_API_BEARER,
  LIVEPEER_API_KEY,
  MADFI_API_KEY,
} = env;

const runMiddleware = (req: NextApiRequest, res: NextApiResponse, fn: any) => {
  return new Promise((resolve, reject) => {
    fn(req, res, (result: any) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
};

// check bearer
const checkAuthorization = (req: NextApiRequest): boolean => {
  const authHeader = req.headers.authorization;
  const expectedAuthHeader = `Bearer ${process.env.SPACE_API_BEARER}`;

  if (authHeader !== expectedAuthHeader) {
    return false;
  }

  return true;
};

// this api endpoint is only ever called from `madfi.xyz` or the clubspace-sdk
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await runMiddleware(req, res, cors); // enable CORS

    if (!checkAuthorization(req)) return res.status(403).json({ error: "forbidden" });

    const {
      creatorAddress,
      creatorLensHandle,
      creatorLensProfileId,
      creatorAvatar,
      // spinampPlaylistId,
      // b2bSpinampPlaylistIds,
      drop,
      lensPubId,
      handle,
      // partyFavorContractAddress,
      startAt, // ts UTC
      productBannerUrl,
      productBannerIsVideo,
      pinnedLensPost,
      gated,
      spaceType,
      roomName,
    } = req.body;

    if (!(creatorAddress && handle)) {
      return res.status(400).json({ error: "missing creatorAddress or handle" });
    }

    const { data: { id: roomId } } = await axios.post(`${LIVEPEER_STUDIO_API}/room`, {}, {
      headers: { Authorization: `Bearer ${LIVEPEER_API_KEY}` },
    });

    const createdAt = Math.floor(Date.now() / 1000);
    const endAt = createdAt + REDIS_SPACE_EXP;

    const spaceObject = {
      roomName,
      creatorAddress: getAddress(creatorAddress),
      creatorLensHandle,
      creatorLensProfileId,
      creatorAvatar,
      lensPubId,
      drop,
      roomId,
      createdAt,
      endAt,
      handle,
      startAt,
      productBannerUrl,
      productBannerIsVideo,
      pinnedLensPost,
      gated,
      spaceType,
      exp: startAt ? startAt - createdAt + REDIS_SPACE_EXP : REDIS_SPACE_EXP
    };

    const spaceRedisKey = `${REDIS_SPACE_PREFIX}/${handle}`;

    try {
      console.log(`setting in redis [${spaceRedisKey}] with exp at ${endAt}`);
      console.log(JSON.stringify(spaceObject, null, 2));
      await redisClient.set(spaceRedisKey, JSON.stringify(spaceObject), "EX", spaceObject.exp);
    } catch (error) {
      console.log(error.stack);
    }

    // // post the playlist id for our api to create the audio stream async; scheduled if startAt != undefined
    // if (spaceType === "playlist") {
    //   await startRadio({
    //     clubSpaceId,
    //     spinampPlaylistId: b2bSpinampPlaylistIds ? undefined : spinampPlaylistId, // override just in case both were set
    //     b2bSpinampPlaylistIds,
    //     spaceRedisKey,
    //     startAt,
    //   });
    // }

    // TODO: fix
    // // schedule the lambda to delete at `endAt`
    // const scheduleParams = { roomId, lambda: 'livepeer_delete_room', scheduleAtTs: spaceObject.endAt };
    // await axios.post(`${MADFI_API_URL}/schedule`, scheduleParams, {
    //   headers: { 'x-api-key': MADFI_API_KEY },
    // });

    return res.status(200).json({ url: `${NEXT_PUBLIC_SITE_URL}/${handle}`, startAt });
  } catch (e) {
    console.log(e);

    if (!res.writableEnded) {
      return res.status(500).json({});
    }

    res.end();
  }
};

export default handler;
