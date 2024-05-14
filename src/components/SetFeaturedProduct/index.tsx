import { useState } from "react";
import { useWalletClient, useAccount, useNetwork } from "wagmi";
import SoundLogo from "@/assets/svg/sound.svg";
import { MultiStepFormWrapper } from "./../MultiStepFormWrapper";
import useGetSoundDrops from "@/hooks/useGetSoundDrops";
import { DROP_PROTOCOL_SOUND, IS_PRODUCTION } from "@/lib/consts";
import SoundDrop from "./SoundDrop";

const SetFeaturedProduct = ({ selectDrop, drop, pinnedLensPost, updateFields }) => {
  const { address } = useAccount();
  const { chain } = useNetwork();
  const { data: walletClient } = useWalletClient();
  const { data: soundDrops, isLoading: isLoadingSound } = useGetSoundDrops(address);
  const [selectedProtocol, setSelectedProtocol] = useState(DROP_PROTOCOL_SOUND);

  const isLoading = isLoadingSound;

  return (
    <MultiStepFormWrapper>
      <div className="w-full">
        <div className="w-full">
          <div className="w-full flex flex-col gap-2">
            <h2 className="mt-4 text-md font-bold tracking-tight sm:text-lg md:text-xl">3. Feature your NFT Drop</h2>
            <p className="mb-2">If you don't have a drop to promote you can pin a Lens post instead</p>
            {isLoading && <p>Loading your drops...</p>}
            {!isLoading && (
              <>
                <div className="flex w-full justify-center relative grid-cols-2 gap-4">
                  <div
                    className="flex w-full items-center pl-4 border border-gray-200 rounded bg-white cursor-pointer"
                    onClick={() => setSelectedProtocol(DROP_PROTOCOL_SOUND)}
                  >
                    <input
                      id="radio-protocol-sound"
                      type="radio"
                      value=""
                      name="bordered-radio"
                      className="w-4 h-4 text-[color:var(--club-red)] bg-gray-100 border-gray-300 focus:ring-0 cursor-pointer"
                      checked={selectedProtocol === DROP_PROTOCOL_SOUND}
                    />
                    <SoundLogo height={50} className="ml-5 mr-5" width={50} />
                    <label
                      htmlFor="radio-protocol-sound"
                      className="w-full py-4 ml-2 text-sm font-medium text-black cursor-pointer"
                    >
                      Sound
                    </label>
                  </div>
                </div>
              </>
            )}
            {selectedProtocol === DROP_PROTOCOL_SOUND && (
              <SoundDrop
                deployedProducts={soundDrops}
                soundProduct={drop}
                selectDrop={selectDrop}
                protocol={DROP_PROTOCOL_SOUND}
              />
            )}
            <label htmlFor="lens-post" className="mt-4 text-md font-bold tracking-tight sm:text-lg md:text-xl">
              Add a pinned Lens Post to your space
            </label>
            <i className="mb-2">Make sure this is a link to a post and not a mirror!</i>
            <input
              value={pinnedLensPost}
              type="text"
              id="pinned_post_link"
              className="input"
              placeholder={`https://${IS_PRODUCTION ? "" : "testnet."}lenster.xyz/posts/0x21c0-0x0d`}
              onChange={(e) => updateFields({ pinnedLensPost: e.target.value })}
            />
          </div>
        </div>
      </div>
    </MultiStepFormWrapper>
  );
};

export default SetFeaturedProduct;
