import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    // TODO: use some params to paginate
    const { handle } = req.query;

    const client = new MongoClient(process.env.MONGO_URI!);
    await client.connect();
    const database = client.db("analytics");
    const collection = database.collection("reports");
    let _filter: any = {
      handle,
    };
    const cursor = await collection.find(_filter, {
      sort: { createdAt: -1 },
    });
    const spaces = await cursor.toArray();

    await client.close();

    return res.status(200).json(spaces);
  } catch (e) {
    console.log(e);
    return res.status(500).json({ success: false });
  }
};

export default handler;
