import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { orderBy } from "lodash/collection";
import { Button, Icons, Textarea } from "./ui";

import { cn } from "@/lib/utils/cn";
import getLensPictureURL from "@/lib/utils/getLensPictureURL";
import { DefaultLensProfile } from "@/types/lens";
import { shortAddress } from "@/utils";
import { useChat } from "@livekit/components-react";
import { useAccount } from "wagmi";

type Props = {
  viewerName: string;
  opacity: number;
  opacityToggled: () => void;
  isMobile: true;
};

let timeout: NodeJS.Timeout;

export default function Chat({ viewerName, opacity, opacityToggled, isMobile }: Props) {
  const { chatMessages: messages, send } = useChat();
  const messagesContainerRef = useRef(null);
  const { isConnected } = useAccount();
  const [mesagePreviewOpacity, setMessagePreviewOpacity] = useState(0);

  const reverseMessages = useMemo(() => orderBy(messages, ['timestamp'], ['desc']), [messages]);

  useEffect(() => {
    if (messagesContainerRef && reverseMessages?.length > 5) {
      const container = messagesContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
    if (isMobile && opacity === 0 && reverseMessages?.length > 0) {
      setMessagePreviewOpacity(0.6);
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(() => {
        setMessagePreviewOpacity(0);
      }, 3000);
    }
  }, [messagesContainerRef, reverseMessages]);

  const [message, setMessage] = useState("");

  const onEnter = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (message.trim().length > 0 && send) {
          send(message).catch((err) => console.error(err));
          setMessage("");
        }
      }
    },
    [message, send]
  );

  const onSend = useCallback(() => {
    if (message.trim().length > 0 && send) {
      send(message).catch((err) => console.error(err));
      setMessage("");
    }
  }, [message, send])

  const displayMessages = isMobile ? reverseMessages : messages;
  // const displayMessages = reverseMessages;
  return (
    <>
      <div
        className={`${isMobile && opacity === 0 && displayMessages[0]?.message ? 'block' : 'hidden'} px-3 py-4 w-full absolute bottom-0 left-0 right-0 transition ease-in-out duration-300`}
        style={{
          opacity: mesagePreviewOpacity,
        }}
      >
        {MessageCell({ message: displayMessages[0]?.message, timestamp: displayMessages[0]?.timestamp, from: displayMessages[0]?.from }, viewerName)}
      </div>
      <div
        className="transition ease-in-out duration-300 mask-gradient-bottom md:relative md:h-[85%] h-[50%] md:max-h-[827px] md:bg-foreground rounded-b-2xl px-3 py-4 w-full absolute bottom-0 left-0 right-0"
        style={{
          opacity: isMobile ? opacity : 1.0,
        }}
      >
        <div ref={messagesContainerRef} className="flex flex-col-reverse md:flex-col absolute top-4 bottom-14 overflow-y-auto pb-4 right-0 left-0 p-2" onClick={opacityToggled}>
          {displayMessages.map((message, idx) => {
            return MessageCell(message, viewerName);
          })}
        </div>
        <div className="absolute bottom-0 left-0 right-0 flex w-full gap-2 p-2">
          <Textarea
            value={message}
            className="border-box h-10 border-[#e0e0e0] placeholder:text-[#8d8d8d]"
            onChange={(e) => {
              setMessage(e.target.value);
            }}
            onKeyDown={onEnter}
            placeholder={isConnected ? "Type a message..." : "Connect your wallet to chat."}
            disabled={!isConnected}
          />
          <Button disabled={message.trim().length === 0} onClick={onSend} className="bg-primary focus-visible:ring-primary">
            <div className="flex items-center gap-2">
              <Icons.send className="h-4 w-4" />
            </div>
          </Button>
        </div>
      </div>
    </>
  );
}

const MessageCell = (message, viewerName) => {

  const getAvatar = ({ defaultProfile, ensData }) => {
    if (defaultProfile?.metadata) {
      return getLensPictureURL(defaultProfile);
    }
    if (ensData && Object.keys(ensData) && ensData?.avatar) {
      return ensData.avatar;
    }
    return "/anon.png";
  };
  if (!message || !message.from) return null;
  // assuming users have signed in with lens
  const { defaultProfile, ensData }: { defaultProfile: DefaultLensProfile, ensData: any } = JSON.parse(message.from?.metadata);
  const displayName = defaultProfile ? `@${defaultProfile?.handle?.localName}` : (message.from?.name?.includes("0x") ? shortAddress(message.from?.name) : message.from?.name);
  const avatar = getAvatar({ defaultProfile, ensData });
  return (
    <div
      key={message.timestamp}
      className="flex flex-col p-2 hover:bg-background hover:transition-colors rounded-md"
    >
      <div className="flex justify-between items-center gap-2 p-2">
        <div
          className={cn(
            "text-xs font-semibold whitespace-nowrap inline-flex gap-1",
            viewerName === message.from?.name && "text-primary"
          )}
        >
          <img
            className="h-6 w-6 rounded-full select-none pointer-events-none -ml-2 -mt-2 mr-1"
            src={avatar}
            alt={`Avatar of user ${displayName}`}
          />
          {displayName}
          {viewerName === message.from?.name && " (you)"}:
          <div className="text-xs text-gray-500">
            {new Intl.DateTimeFormat('default', { hour: '2-digit', minute: '2-digit' }).format(new Date(message.timestamp))}
          </div>
        </div>
      </div>
      <div className="text-sm ml-auto">{message.message}</div>
    </div>
  );
}
