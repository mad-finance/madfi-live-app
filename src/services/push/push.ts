import * as PushAPI from "@pushprotocol/restapi";
import * as ethers from "ethers";

// the private key of the address which you used to create a channel
const PK = process.env.PUSH_KEY;
const Pkey = `0x${PK}`;
const signer = new ethers.Wallet(Pkey);

export const sendNotification = async (link: string, title?: string, body?: string) => {
  const handle = link.slice(link.lastIndexOf("/") + 1);
  const prod = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";
  await PushAPI.payloads.sendNotification({
    signer,
    type: 1, // broadcast
    identityType: 2, // direct payload
    notification: {
      title: `Club Space by ${handle} is starting`,
      body: `Join now!`,
    },
    payload: {
      title: title ?? `Club Space by ${handle} is starting`,
      body: body ?? `Join now!`,
      cta: link,
      img: "",
    },
    channel: `eip155:${prod ? 1 : 5}:0xD1CCfb9Fbd9A8DE0cf9950eFbCFb29adcDA81C93`,
    env: prod ? "prod" : "staging",
  });
};
