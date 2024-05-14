import { env } from "@/env.mjs";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import redisClient from "@/lib/utils/redisClient";

const apiKey = env.LIVEPEER_API_KEY;

// HACK: using redis to manage our own permissions, reading in `/addUser` which seems to be called by livekit all the time :shrug:
export default async function muteParticipant(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { name, roomName, canPublish, spaceExp, identity } = req.body;

    const permissionsKey = `perms/${roomName}/${name}`;

    // console.log(`overwriting redis perms at ${permissionsKey}`);
    // console.log(`canPublish: ${canPublish}`)
    if (canPublish) {
      await redisClient.set(permissionsKey, canPublish, "EX", spaceExp);
    } else {
      await redisClient.del(permissionsKey);
    }

    const response = await axios.put(
      `https://livepeer.studio/api/room/${roomName}/user/${identity}`,
      { canPublish },
      {
        headers: { Authorization: `Bearer ${apiKey}` },
      }
    );

    res.status(200).end();
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}