import { addUserReqValidator, addUserResValidator } from "@/lib/validators/api-room";
import axios from "axios";
import { env } from "@/env.mjs";
import { NextApiRequest, NextApiResponse } from "next";
import { TokenResult } from "@/lib/livekit/types";
import redisClient from "@/lib/utils/redisClient";

const apiKey = env.LIVEPEER_API_KEY;

const _getPermissions = async (roomName: string, identity: string) => {
  const permissionsKey = `perms/${roomName}/${identity}`;
  const res = await redisClient.get(permissionsKey);
  return res === 'true';
};

export default async function addUser(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { roomName, identity, name, metadata, creatorAddress } = addUserReqValidator.parse(req.query);

    const canPublish = creatorAddress === identity || await _getPermissions(roomName, identity);

    let metadataWithHost;
    try {
      metadataWithHost = JSON.parse(metadata);
      // only add host to metadata on the server
      metadataWithHost.isHost = creatorAddress === identity;

      metadataWithHost = JSON.stringify(metadataWithHost);
    } catch (err) {
      metadataWithHost = metadata;
    }

    // console.log(`${roomName} ${identity} canPublish: ${canPublish}`)

    const body = { name, canPublish, metadata: metadataWithHost };
    const url = `https://livepeer.studio/api/room/${roomName}/user`;
    const response = await axios.post(url, body, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    // token, id and joinURL
    const { token } = addUserResValidator.parse(await response.data);

    const result: TokenResult = {
      identity: identity as string,
      accessToken: token,
    };

    // cache for 60s
    res.setHeader('Cache-Control', 'public, s-maxage=60');

    res.status(200).json(result);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}
