import { NextApiRequest, NextApiResponse } from "next";
import redisClient from "@/lib/utils/redisClient";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { groupId } = req.body;
  console.log("getting group", groupId);

  const groupIdentities = await redisClient.lrange(`rolecall-${groupId}`, 0, -1);

  try {
    res.status(200).json({ groupIdentities });
  } catch (error: any) {
    console.error(error);

    res.status(500).end();
  }
};

export default handler;
