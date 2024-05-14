import { LensClient, development, production } from "@lens-protocol/client";

import { IS_PRODUCTION } from "@/lib/consts";

export const LENS_ENVIRONMENT = IS_PRODUCTION ? production : development;

// TODO: something cleaner
let storage;
if (typeof window !== 'undefined') {
  storage = window.localStorage;
}
export const lensClient = new LensClient({ environment: LENS_ENVIRONMENT, storage });

export const handleBroadcastResult = (broadcastResult: any) => {
  const broadcastValue = broadcastResult.unwrap();

  if ('id' in broadcastValue || 'txId' in broadcastValue) { // TODO: success?
    console.log(broadcastValue);
    return broadcastValue;
  } else {
    console.log(broadcastValue);
    throw new Error();
  }
}