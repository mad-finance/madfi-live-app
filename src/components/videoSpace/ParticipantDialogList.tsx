import { Icons } from "@/components/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import { ParticipantLoop, useParticipants } from "@livekit/components-react";
import { Participant } from "livekit-client";
import { useAccount } from "wagmi";
import { ParticipantListItem, useMetadataInfo } from "./ParticipantListItem";

export const ParticipantDialogList = ({ creatorAddress, space }) => {
  const { address: userAddress } = useAccount();
  const participants = useParticipants();
  const isAdmin = creatorAddress === userAddress;

  // filter out host from list to avoid fetching things on the ParticipantListItem
  let stageParticipants = participants
    .filter((p) => p.permissions?.canPublish)
    .sort((a, b) => (a.name === creatorAddress ? -1 : b.name === creatorAddress ? 1 : 0));
  let regularParticipants = participants.filter((p) => !p.permissions?.canPublish);

  return (
    <Dialog>
      <DialogTrigger className="z-30 bg-background rounded-lg p-2 py-[0.62rem] hover:bg-foreground">
        <div className="flex flex-row gap-x-6">
          <div className="flex flex-row items-center">
            <Icons.eye className="m-1 mr-2 opacity-100 w-4 h-4" />
            <span>{participants.length}</span>
          </div>
          <ProfilePicList participants={participants.slice(0, 5)} />
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg md:max-w-xl max-h-screen md:w-3/4">
        <>
          <DialogHeader className="mb-4 gap-y-2">
            <DialogTitle className="mb-4">{stageParticipants.length > 0 ? "Stage" : "Stage is empty"}</DialogTitle>
            {stageParticipants.length > 0 ? (
              <ParticipantLoop participants={stageParticipants}>
                <ParticipantListItem isAdmin={isAdmin} space={space} />
              </ParticipantLoop>
            ) : null}
          </DialogHeader>
          <h2 className="text-lg font-semibold">
            {isAdmin ? "Invite to stage" : "Online now"}
          </h2>
          <DialogDescription className="space-y-6 max-h-60 overflow-auto">
            <ParticipantLoop participants={regularParticipants}>
              <ParticipantListItem isAdmin={isAdmin} space={space} stageCount={stageParticipants.length} />
            </ParticipantLoop>
          </DialogDescription>
        </>
      </DialogContent>
    </Dialog>
  );
};

const ProfilePic = ({ participant }: { participant: Participant }) => {
  const { avatar, displayName } = useMetadataInfo(participant);

  return (
    <img
      key={participant.sid}
      className="inline-block h-8 w-8 rounded-full ring-2 ring-foreground"
      src={avatar || "./anon.png"}
      alt={`profile of ${displayName}`}
      height={32}
      width={32}
    />
  );
};

const ProfilePicList = ({ participants }: { participants: Array<Participant> }) => {
  return (
    <div className="flex -space-x-1">
      {participants.map((participant, index) => (
        <div key={`profilepic-${index}`} style={{ zIndex: participants.length - index }} className="relative">
          <ProfilePic participant={participant} key={participant.sid} />
        </div>
      ))}
    </div>
  );
};
