import { FC, Fragment, useState } from "react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/outline";
import { classNames } from "@/lib/utils/classNames";
import { Listbox, Transition } from "@headlessui/react";
import { isEmpty } from 'lodash/lang';
import { kFormatter } from '@/utils';

export default ({ deployedProducts, selectDrop, protocol }) => {
  const [soundProduct, setSoundProduct] = useState();
  const now = Date.now();

  const getProductName = ({ title, isFinalSoldOut, publicMintStart, finalSaleScheduleEndTimestamp, numSold, quantity, isOpenEdition }) => {
    const namePart = `[Ethereum] ${title}`;
    const quantityPart = () => (
      isOpenEdition
        ? `${numSold} minted (OPEN EDITION)`
        : `${numSold} / ${kFormatter(quantity)} minted`
    );
    const salePart = new Date(publicMintStart).getTime() <= now && now < finalSaleScheduleEndTimestamp
      ? (isFinalSoldOut ? 'SOLD OUT' : quantityPart())
      : 'SALE IS NOT ACTIVE';

    return `${namePart} - ${salePart}`;
  };

  // sale is active and not sold out
  const getIsProductEnabled = ({ isFinalSoldOut, publicMintStart, finalSaleScheduleEndTimestamp }) => (
    new Date(publicMintStart).getTime() <= now && now < finalSaleScheduleEndTimestamp && !isFinalSoldOut
  );

  const _setSoundProduct = (data) => {
    setSoundProduct(data);
    selectDrop({
      contractAddress: data.contractAddress,
      price: data.price,
      productBannerUrl: data.animatedCoverImage?.url || data.coverImage.url,
      productBannerIsVideo: !isEmpty(data.animatedCoverImage),
      chainId: 1, // @TODO: until they open up testnet api
      protocol,
    });
  };

  return (
    <>
      {deployedProducts && (
        <>
          <Listbox value={soundProduct} onChange={_setSoundProduct}>
            {({ open }) => (
              <>
                <div className="relative mt-1 bg-gray-800 border border-gray-600 rounded-md">
                  <Listbox.Button className="relative input py-2 pl-3 pr-10 text-left ">
                    <span className="block truncate">{soundProduct ? getProductName(soundProduct) : "Select from your releases"}</span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </span>
                  </Listbox.Button>

                  <Transition
                    show={open}
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-800 py-1 text-base shadow-sm ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                      {deployedProducts.map((release, index) => (
                        <Listbox.Option
                          key={index}
                          className={({ active }) =>
                            classNames(
                              active ? "bg-indigo-600 text-white" : "",
                              "relative cursor-default select-none py-2 pl-3 pr-9"
                            )
                          }
                          value={release}
                          disabled={!getIsProductEnabled(release)}
                        >
                          {({ selected, active }) => (
                            <>
                              <span
                                className={classNames(selected ? "font-semibold" : "font-normal", "block truncate")}
                              >
                                {getProductName(release)}
                              </span>

                              {selected ? (
                                <span
                                  className={classNames(
                                    active ? "text-white" : "text-indigo-600",
                                    "absolute inset-y-0 right-0 flex items-center pr-4"
                                  )}
                                >
                                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                              ) : null}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </>
            )}
          </Listbox>
          <br/>
        </>
      )}
    </>
  )
};
