import axios from "axios";
import Cors from "cors";
import { env } from "@/env.mjs";
import { NextApiRequest, NextApiResponse } from 'next';
import { uniqBy } from "lodash/array";
import { sampleSize } from "lodash/collection";
import { REDIS_SPACE_PREFIX } from "@/lib/consts";
import redisClient from '@/lib/utils/redisClient';
import { LIVEPEER_STUDIO_API } from "@/lib/consts";
import getLensPictureURL from "@/lib/utils/getLensPictureURL";

const cors = Cors({
  methods: ["HEAD", "GET"],
});

const { LIVEPEER_API_KEY } = env;

// enable CORS
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

const getParticipants = async (roomId: string) => {
  // include stats from livepeer
  const { data: { participants } } = await axios.get(`${LIVEPEER_STUDIO_API}/room/${roomId}`, {
    headers: { Authorization: `Bearer ${LIVEPEER_API_KEY}` },
  });

  const sortedParticipants = Object.values(participants).sort((a, b) => b.joinedAt - a.joinedAt);
  const uniqueParticipants = uniqBy(sortedParticipants, "name"); //.filter(({ leftAt }) => !leftAt);
  const participantsCount = uniqueParticipants.length;

  const sampleParticipants = await Promise.all(sampleSize(uniqueParticipants, 3).map(async ({ identity }) => {
    let metadata;

    try {
      const { data } = await axios.get(`${LIVEPEER_STUDIO_API}/room/${roomId}/user/${identity}`, {
        headers: { Authorization: `Bearer ${LIVEPEER_API_KEY}` },
      });
      metadata = data.metadata;
    } catch { return { identity }; }

    if (!metadata) return { identity };

    const _metadata = JSON.parse(metadata);

    if (_metadata.defaultProfile) {
      return {
        handle: _metadata.defaultProfile.handle,
        avatar: getLensPictureURL(_metadata.defaultProfile),
      }
    } else if (_metadata.ensData) {
      return _metadata.ensData;
    } else {
      return {};
    }
  }));

  return { participantsCount, sampleParticipants };
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  runMiddleware(req, res, cors);

  try {
    const { handle } = req.query;

    // get one
    if (handle) {
      const spaceRedisKey = `${REDIS_SPACE_PREFIX}/${handle}`;
      const data = await redisClient.get(spaceRedisKey);
      if (!data) return res.status(404).end();

      const space = JSON.parse(data);

      const { participantsCount, sampleParticipants } = await getParticipants(space.roomId);

      space.participantsCount = participantsCount;
      space.sampleParticipants = sampleParticipants;

      return res.status(200).json({ space });
    }

    // get all from redis
    const keys = await redisClient.keys(`${REDIS_SPACE_PREFIX}/*`);
    const promises = keys.map(async (key) => {
      const data = await redisClient.get(key);
      if (!data) return null;

      const space = JSON.parse(data);
      const { participantsCount, sampleParticipants } = await getParticipants(space.roomId);

      space.participantsCount = participantsCount;
      space.sampleParticipants = sampleParticipants;

      return space;
    });

    const spaces = (await Promise.all(promises)).filter((s) => s);
    return res.status(200).json({ spaces });
  } catch (e) {
    console.log(e);
    return res.status(500).end();
  }
}

export default handler;
