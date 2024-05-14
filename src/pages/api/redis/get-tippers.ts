import { NextApiRequest, NextApiResponse } from "next";
import redisClient from "@/lib/utils/redisClient";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { txHashes } = req.body;

  try {
    const data = await Promise.all(txHashes.map(async (txHash) => {
      const key = `tip/${txHash.toLowerCase()}`;
      const handle = await redisClient.get(key);
      return { txHash, handle };
    }));

    res.status(200).json(data);
  } catch (error: any) {
    console.error(error);

    res.status(500).end();
  }
};

export default handler;
