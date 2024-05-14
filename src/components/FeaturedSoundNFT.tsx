import React, { useState, useMemo } from "react";
import { Contract, BigNumber, BigNumberish, utils } from "ethers";
import { useNetwork, useWalletClient, useSwitchNetwork, useAccount } from "wagmi";
import { MintSchedule } from '@soundxyz/sdk/types';
import { SoundClient } from '@soundxyz/sdk';
import toast from "react-hot-toast";
import { unescape } from "lodash/string";
import { CURRENCY_MAP, CHAIN_NAME_MAP } from "@/lib/consts";
import { wait } from "@/utils";
import { walletClientToSigner } from "@/lib/utils/wagmi";

const MAX_DESCRIPTION_LENGTH = 250;

interface Props {
  chainId: number,
  contractAddress: string;
  name: string;
  description: string;
  animatedCoverImage?: string;
  coverImage: string;
  externalUrl: string;
  isFinalSoldOut: boolean;
  saleIsActive: boolean;
  publicMintStart: number;
  finalSaleScheduleEndTimestamp: number;
  numSold: number;
  quantity: number;
  isOpenEdition: boolean;
  price: BigNumberish;
  protocol: string;
  semGroupIdHex: string;
  mintSchedule: MintSchedule;
}

export const FeaturedSoundNFT = ({
  chainId,
  contractAddress,
  name,
  description,
  coverImage,
  animatedCoverImage,
  externalUrl,
  isFinalSoldOut,
  saleIsActive,
  publicMintStart,
  finalSaleScheduleEndTimestamp,
  numSold,
  quantity,
  isOpenEdition,
  price,
  protocol,
  semGroupIdHex,
  mintSchedule,
}: Props) => {
  const [isBuying, setIsBuying] = useState<boolean>(false);
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient();
  const { connector: activeConnector, address: userAddress } = useAccount();
  const { switchNetworkAsync } = useSwitchNetwork({ onSuccess: (data) => onBuyClick(true) });

  const onBuyClick = async (switched = false) => {
    setIsBuying(true);

    if (!switched && chainId !== chain.id) {
      toast("Switching chains...");
      try {
        await switchNetworkAsync(chainId);
      } catch (error) {
        setIsBuying(false);
      }
      return;
    } else if (switched) {
      await wait(1000);
    }

    toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          const _signer = walletClientToSigner(walletClient);
          const client = SoundClient({ signer: _signer });

          const tx = await client.mint({
            mintSchedule,
            quantity: 1,
            value: price,
          });

          console.log(`tx: ${tx.hash}`);
          await tx.wait();

          setIsBuying(false);

          resolve();
        } catch (error) {
          reject(error);
        }
      }),
      {
        loading: "Minting...",
        success: "Success!",
        error: (error) => {
          console.log(error);

          setIsBuying(false);

          try {
            const realError = typeof error === "object" ? error.toString().split("(")[0] : "";

            if (realError.startsWith("Error: user rejected")) {
              return realError;
            } else if (error.data?.message.startsWith("err: insufficient")) {
              return "Insufficient funds";
            }
          } catch {}

          return "Error!";
        },
      }
    );
  };

  const parsedDescription = useMemo(() => {
    const replacements = { "\\\\": "\\", "\\n": "\n", '\\"': '"' };
    let d = unescape(description.substring(0, MAX_DESCRIPTION_LENGTH));
    d = d.replace(/\\(\\|n|")/g, (replace) => replacements[replace]);
    return description.length > MAX_DESCRIPTION_LENGTH ? `${d}...` : d;
  }, [description]);

  return (
    <>
      <div>
        <h2 className="my-4 text-4xl font-bold tracking-tight sm:text-2xl md:text-5xl drop-shadow-sm text-center">
          Featured Drop
        </h2>
        <div className="flex w-full justify-center relative">
          <div className="max-w-[20rem] min-w-[17rem]">
            <div className="bg-slate-800 shadow-xl rounded-lg relative">
              <div className="photo-wrapper p-2 pt-0 overflow-hidden">
                {!animatedCoverImage ? (
                  <img
                    className="absolute t-0 left-0 right-0 w-full h-full object-cover opacity-50 rounded-md"
                    src={coverImage}
                    alt=""
                  />
                ) : (
                  <video
                    className="absolute t-0 left-0 right-0 w-full h-full object-cover opacity-50 rounded-md"
                    src={animatedCoverImage}
                    autoPlay
                    muted
                    loop
                  />
                )}
              </div>
              <div className="p-2 pt-10 relative">
                <h3 className="text-center text-xl text-gray-300 font-medium leading-8 -mb-2">{name}</h3>

                <p className="text-sm text-gray-300 dark:text-white mb-0 p-4 text-center">{parsedDescription}</p>

                <div className="text-center text-gray-400 text-sm font-semibold mb-4 -mt-2">
                  <p>
                    <a target="_blank" rel="noreferrer" href={externalUrl}>
                      See on Sound.xyz
                    </a>
                  </p>
                </div>

                <div className="flex justify-center mb-8 text-sm gap-x-4">
                  <div className="flex gap-x-2">
                    <span>
                      <strong>
                          {numSold}
                        {!isOpenEdition ? ` / ${quantity}` : ""}
                      </strong>
                    </span>
                    <span className="text-gray-400">Minted</span>
                  </div>

                  <div className="flex gap-x-2">
                    <span>
                      <strong>{utils.formatEther(price)}</strong>
                    </span>
                    <span className="text-gray-400">{CURRENCY_MAP[chainId]}</span>
                  </div>
                </div>

                {saleIsActive ? (
                  <div className="text-center my-3 px-3">
                    <button className="!w-full btn" onClick={() => onBuyClick()} disabled={isBuying}>
                      {price.isZero() ? "Free Mint" : "Mint"}{" "}
                      {chainId != chain.id ? `(on ${CHAIN_NAME_MAP[chainId]})` : ""}
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
