import { Menu, Popover, Transition } from "@headlessui/react";
import type { DataSendOptions } from "@livekit/components-core";
import { classNames } from "@/lib/utils/classNames";
import { reactionsEntries } from "@/constants/reactions";
import { Fragment } from "react";
import { DataPacket_Kind } from "livekit-client";

const encoder = new TextEncoder();

export const ReactionsDialog = ({
  send,
  isSending,
}: {
  send: (payload: Uint8Array, options?: DataSendOptions) => Promise<void>;
  isSending: boolean;
}) => {
  return (
    <>
      <Popover
        className={({ open }) =>
          classNames(
            open ? "inset-0 z-40 overflow-y-auto" : "",
            "mx-auto shadow-sm lg:static bottom-0 lg:overflow-y-visible"
          )
        }
      >
        {({ open }) => {
          return (
            <>
              <Menu as="div" className="relative flex-shrink-0 mb-32">
                <div className="flex mt-10 items-center mx-auto">
                  <Menu.Button
                    title="Use these wisely..."
                    disabled={isSending}
                    className="text-club-red !bg-transparent focus:outline-none rounded-lg text-sm text-center inline-flex items-center relative"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill={!isSending ? "currentColor" : "gray"}
                      className="w-7 h-7"
                    >
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>

                    <span className="sr-only">Response icon heart-shape</span>
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute z-10 mt-2 w-48 origin-top-right rounded-md bg-gray-800 p-4 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none flex gap-4 flex-wrap left-1/2 transform -translate-x-1/2">
                    {reactionsEntries.map(([key, value]) => (
                      <Menu.Item key={key}>
                        {({ active }) => (
                          <button
                            className={classNames("transition-all ease-in-out duration-150", active ? "scale-90" : "")}
                            onClick={() => {
                              try {
                                const data = encoder.encode(value);
                                send(data, { kind: DataPacket_Kind.RELIABLE });
                              } catch (error) {
                                console.log(error);
                              }
                            }}
                          >
                            {value}
                          </button>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>

              <Popover.Panel className="" aria-label="Global"></Popover.Panel>
            </>
          );
        }}
      </Popover>
    </>
  );
};
