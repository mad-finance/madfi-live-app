import toast from "react-hot-toast";
import { BigNumber, utils, constants, Contract } from "ethers";
import { apiUrls } from "@/constants/apiUrls";
import { APP_NAME } from "./lib/consts";

const _hash = (uriOrHash: string) => {
  return typeof uriOrHash === "string" && uriOrHash.startsWith("ipfs://")
    ? uriOrHash.split("ipfs://")[1]
    : uriOrHash;
};

export function shortAddress(address: string) {
  return address.slice(0, 5) + "..." + address.slice(address.length - 4);
}

export function trimText(text: string, length: number) {
  return text.length > length ? text.substring(0, length) + "..." : text;
}

export const roundedToFixed = (input: number, digits: number = 4): string => {
  const rounder = Math.pow(10, digits);
  return (Math.round(input * rounder) / rounder).toFixed(digits);
};

export const defaultGatewayURL = (uriOrHash: string) => `${apiUrls.ipfs}/${_hash(uriOrHash)}`;

export const lensGatewayURL = (uriOrHash: string) => `${apiUrls.lensGateway}/${_hash(uriOrHash)}`;

export const getUrlForImageFromIpfs = (uri: string) => {
  if (!uri) return;
  const hash = uri.split("ipfs://")[1];
  return uri.startsWith("ipfs://") ? `${apiUrls.ipfs}/${hash}` : uri;
};

export const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fieldNamePrivy = (semGroupIdHex: any) => {
  semGroupIdHex = semGroupIdHex.toString().replace(/-/g, '');

  let id;

  if (!semGroupIdHex.startsWith("0x")) { // semaphore limitation
    semGroupIdHex = `0x${semGroupIdHex}`;
  }
  id = BigNumber.from(semGroupIdHex).toString();

  // console.log('privy ID:', `${APP_NAME.toLowerCase()}-${id}`);

  return `${APP_NAME.toLowerCase()}-${id}`;
};

export const kFormatter = (num) => {
  if (typeof num === 'string') return num;

  if (Math.abs(num) > 999_999) {
    return Math.sign(num)*((Math.abs(num)/1_000_000).toFixed(1)) + 'mil';
  } else if (Math.abs(num) > 999) {
    return Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k';
  }

  return Math.sign(num)*Math.abs(num);
};

export const parsePublicationLink = (link: string) => {
  const parts = link.split("/");
  return parts[parts.length - 1];
};

/** Calendar related date math functions */

export function addDays(dirtyDate, dirtyAmount) {
  var date = toDate(dirtyDate);
  var amount = toInteger(dirtyAmount);

  if (isNaN(amount)) {
    return new Date(NaN);
  }

  if (!amount) {
    // If 0 days, no-op to avoid changing times in the hour before end of DST
    return date;
  }

  date.setDate(date.getDate() + amount);
  return date;
}

export function subDays(dirtyDate, dirtyAmount) {
  const amount = toInteger(dirtyAmount);
  return addDays(dirtyDate, -amount);
}

function toInteger(dirtyNumber) {
  if (dirtyNumber === null || dirtyNumber === true || dirtyNumber === false) {
    return NaN;
  }

  const number = Number(dirtyNumber);

  if (isNaN(number)) {
    return number;
  }

  return number < 0 ? Math.ceil(number) : Math.floor(number);
}

function toDate(argument) {
  const argStr = Object.prototype.toString.call(argument); // Clone the date

  if (argument instanceof Date || (typeof argument === "object" && argStr === "[object Date]")) {
    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
    return new Date(argument.getTime());
  } else if (typeof argument === "number" || argStr === "[object Number]") {
    return new Date(argument);
  } else {
    if ((typeof argument === "string" || argStr === "[object String]") && typeof console !== "undefined") {
      // eslint-disable-next-line no-console
      console.warn(
        "Starting with v2.0.0-beta.1 date-fns doesn't accept strings as date arguments. Please use `parseISO` to parse strings. See: https://git.io/fjule"
      ); // eslint-disable-next-line no-console

      console.warn(new Error().stack);
    }

    return new Date(NaN);
  }
}

const getDecimals = async (address: string, provider: any) => {
  const contract = new Contract(address, ["function decimals() external view returns (uint256)"], provider);
  const decimals = await contract.decimals();
  return decimals;
};

/**
 * Converts token amount into base unit (wei) based on contract decimals
 * @param amount token amount
 * @return converted amount
 */
const convertDecimals = async (amount: string, address: string, provider: any) => {
  const decimals = await getDecimals(address, provider);
  return utils.parseUnits(amount, Number(decimals));
};

// ERC20 approval
export const approveToken = async (token: string, amount: string, signer: any, operator?: string) => {
  const contract = new Contract(
    token,
    [
      "function allowance(address owner, address spender) external view returns (uint256)",
      "function approve(address spender, uint256 amount) external returns (bool)",
    ],
    signer,
  );

  const user = await signer.getAddress();
  const allowance = await contract.allowance(user, operator);
  const decimalAmount = await convertDecimals(amount, token, signer.provider);

  if (allowance.lt(decimalAmount)) {
    let toastId = toast.loading("Approving tokens");
    const tx = await contract.approve(operator, constants.MaxUint256);
    await tx.wait();
    toast.dismiss(toastId);
  }
};