import { sendNotification } from "@/services/push/push";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /**
   * url: string - required, call to action url
   * title: string - optional, title of the notification
   * body: string - optional, body of the notification
   */
  const { url, title, body } = req.body;
  console.log("sending notification for url", url);

  try {
    await sendNotification(url, title, body);

    res.status(200).end();
  } catch (error: any) {
    console.error(error);

    res.status(500).end();
  }
};

export default handler;
