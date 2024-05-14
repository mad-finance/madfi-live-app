import { FC } from "react";

export const reactionsMap = {
  clap: "👏",
  heart: "❤️",
  fire: "🔥",
  rocket: "🚀",
  star: "⭐",
  party: "🎉",
  money: "💰",
  thumbsup: "👍",
};

export const reactionsEntries = Object.entries(reactionsMap);
const reactionsKeys = Object.keys(reactionsMap);

const shortAddress = (address) => (
  address.slice(0, 5) + "..." + address.slice(address.length - 4)
);

export type ReactionsTypes = keyof typeof reactionsMap;

type Props = {
  allowDrawer: boolean;
  picture: string;
  handle: string;
  reaction?: string;
  index: number;
  hasBadge: boolean;
  onClick: () => null;
  isHost: boolean;
  isSpeaker: boolean;
  isSpeaking: boolean;
};

export const LensProfile: FC<Props> = ({
  allowDrawer,
  picture,
  handle,
  reaction,
  index,
  hasBadge,
  onClick,
  isHost,
  isSpeaker,
  isSpeaking,
}) => {
  let delayStyle = { "--_delay": index } as React.CSSProperties;
  const role = isHost
    ? 'Host'
    : (isSpeaker ? 'Speaker' : 'Listener');

  return (
    <div
      style={delayStyle}
      onClick={allowDrawer ? onClick : undefined}
      className={`${
        allowDrawer
          ? "cursor-pointer rounded-sm"
          : ""
      } animate-fade-in-from-top flex items-center justify-center flex-col max-w-[100px] relative opacity-0 mx-auto gap-y-1`}
    >
      <img src={picture} alt={handle} className={`rounded-full w-12 h-12 aspect-square ${hasBadge && `border-solid border-2 border-red-600`} ${isSpeaking ? 'glowing-profile-speaking' : ''}`} />
      <p className={`text-xs max-w-[100px] text-ellipsis truncate select-none ${hasBadge && `badge-holder`}`}>{handle?.includes("0x") ? shortAddress(handle) : handle}</p>
      <p className="text-xs select-none text-gray-500">{role}</p>
      {reaction && (
        <div className="absolute bottom-0 right-0">
          <div className="opacity-0 flex items-center justify-center w-6 h-6 text-4xl rounded-full animate-fade-in-and-out-up">
            {reaction}
          </div>
        </div>
      )}
    </div>
  );
};
