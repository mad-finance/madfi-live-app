import { env } from "@/env.mjs";

export function getLiveKitURL(region?: string | string[]): string {
  return env.NEXT_PUBLIC_LIVEPEER_URL;
  // let targetKey = "LIVEPEER_URL";
  // if (region && !Array.isArray(region)) {
  //   targetKey = `LIVEPEER_URL_${region}`.toUpperCase();
  // }
  // const url = process.env[targetKey];
  // if (!url) {
  //   throw new Error(`${targetKey} is not defined`);
  // }
  // return url;
}
