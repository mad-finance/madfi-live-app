import { NextApiRequest, NextApiResponse } from "next";
import redisClient from "@/lib/utils/redisClient";

// this is a work-around since the TipActionModule does not emit the actor
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { txHash, profileHandle, spaceExp } = req.body;

    const key = `tip/${txHash.toLowerCase()}`;
    await redisClient.set(key, profileHandle, "EX", spaceExp);

    res.status(200).end();
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
}

export default handler;