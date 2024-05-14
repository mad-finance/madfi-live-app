import { useState, useEffect } from "react";
import { Participant } from "livekit-client";
import { useParticipantContext } from "@livekit/components-react";
import { DefaultLensProfile } from "@/types/lens";
import getLensPictureURL from "@/lib/utils/getLensPictureURL";
import { shortAddress } from "@/utils";
import { HostSection } from "@/components/discussionSpace/HostSection";

export const useMetadataInfo = (participant: Participant) => {
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const [displayName, setDisplayName] = useState<string | undefined>(undefined);
  const [handle, setHandle] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (participant) {
      try {
        const { metadata } = participant;
        const { defaultProfile, ensData }: { defaultProfile: DefaultLensProfile; ensData: any } = JSON.parse(metadata);

        setAvatar(defaultProfile?.metadata ? getLensPictureURL(defaultProfile) : "/anon.png");
        setDisplayName(defaultProfile?.metadata?.displayName ?? defaultProfile?.handle?.localName ?? ensData?.handle ?? shortAddress(participant.name));
        setHandle(defaultProfile?.handle?.localName ? `@${defaultProfile?.handle?.localName}` : '');
      } catch (err) {
        console.log("Failed to parse metadata");
      }
    }
  }, [participant]);

  return { avatar, displayName, handle };
}

export const ParticipantListItem = ({ isAdmin, space, stageCount }: { isAdmin: boolean, space: any, stageCount: number }) => {
  const participant = useParticipantContext();
  const { displayName, avatar, handle } = useMetadataInfo(participant);
  const [isHovered, setIsHovered] = useState(false);
  const isCreator = participant.name === space.creatorAddress;

  return (
    <div
      className="grid grid-cols-3 gap-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="col-span-2">
        <div className="flex gap-4">
          <img className="h-12 w-12 rounded-full" src={avatar || "./anon.png"} alt={`avatar`} />
          <div className="mt-1">
            <div className="font-light truncate max-w-[25ch] text-gray-400 text-sm min-h-[10px]">{handle}</div>
            <div className="font-bold truncate max-w-[25ch]">{displayName || participant.name}</div>
          </div>
        </div>
      </div>
      <div className="col-span-1">
        {isAdmin && !isCreator && (
          <div className={`col-span-1 ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-50 mt-2`}>
            <HostSection participant={participant} spaceExp={space.exp} stageCount={stageCount} />
          </div>
        )}
      </div>
    </div>
  );
};
