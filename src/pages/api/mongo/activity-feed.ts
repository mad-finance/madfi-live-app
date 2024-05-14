import { MongoClient } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const client = new MongoClient(process.env.MONGO_URI!);
    await client.connect();
    const database = client.db("analytics");
    const collection = database.collection("reports");
    let _filter: any = {
      test: process.env.NEXT_PUBLIC_IS_PRODUCTION === "true" ? false : true,
    };
    const cursor = await collection.find(_filter, {
      sort: { createdAt: -1 },
      projection: {
        _id: 0,
        numGuests: 1,
        decentContract: 1,
        drop: 1,
        handle: 1,
        createdAt: 1,
        startAt: 1,
        totalSales: 1,
        totalSalesAmount: 1,
      },
      limit: 10,
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
