// import { env } from "@/env.mjs";
// import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

// const url = "SOME_API_URL";

export default async function findRoomID(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { handle } = req.body;

    if (handle) {
      // fetch ID based on handle from our servers
      // const response = await axios.get(`${url}/handle`, {
      //   headers: {
      //     Authorization: `Bearer ${apiKey}`,
      //   },
      // });
      // const result = await response.data;

      const result = { id: "" };

      // {"id":"71d187fe-b74b-4fd9-988d-2f41b4f9a62e"}
      res.status(200).json(result);
    }
  } catch (e) {
    res.statusMessage = (e as Error).message;
    res.status(500).end();
  }
}
