import * as PushAPI from "@pushprotocol/restapi";

export const subscribeNotifications = async (signer: any, address: string) => {
  const prod = process.env.NEXT_PUBLIC_IS_PRODUCTION === "true";
  await PushAPI.channels.subscribe({
    signer,
    channelAddress: `eip155:${prod ? 1 : 5}:0xD1CCfb9Fbd9A8DE0cf9950eFbCFb29adcDA81C93`,
    userAddress: `eip155:${prod ? 1 : 5}:${address}`,
    onSuccess: () => {
      console.log("opt in success");
    },
    onError: () => {
      console.error("opt in error");
    },
    env: prod ? "prod" : "staging",
  });
};
