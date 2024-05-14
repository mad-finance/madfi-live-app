import { useState } from "react";
import { toast } from "react-hot-toast";
import { useWalletClient } from "wagmi";
import { PostFragment } from "@lens-protocol/client"
import { Publication, Theme } from "@madfi/widgets-react";

import { useIsAuthenticated, useAuthenticatedProfileId } from "@/hooks/useLensLogin";
import { IS_PRODUCTION, JSON_RPC_URL_ALCHEMY_MAP, MADFI_SITE_URL, MADFI_BANNER_IMAGE_SMALL } from "@/lib/consts";
import {
  useReactionToggle,
  PublicationReactionType,
  PrimaryPublication,
  useCreateMirror,
  PublicationId,
  useProfile,
  usePublication,
  ProfileId
} from "@lens-protocol/react-web";
import { LENS_ENVIRONMENT } from "@/services/lens/client";

type PublicationContainerProps = {
  publicationId?: string;
  // publication?: PostFragmentPotentiallyDecrypted;
  // isProfileAdmin?: boolean;
  // setSubscriptionOpenModal?: () => void;
  // hasMintedBadge?: string;
  // activeSubscription?: boolean;
  // decryptGatedPosts?: () => void;
  shouldGoToPublicationPage?: boolean;
  onCommentButtonClick?: (e) => void;
  onActButtonClick?: (e) => void;
  renderActButtonWithCTA?: string;
  returnToPage?: string;
};

export type PostFragmentPotentiallyDecrypted = PostFragment & {
  isDecrypted?: boolean;
};

// handles all the mf buttons
// - decrypt
// - subscribe to view (TODO: maybe abstract to whatever the gated condition is)
// - act
// - like / mirror / comment
const PublicationContainer = ({
  publicationId,
  shouldGoToPublicationPage = false,
  onCommentButtonClick,
  onActButtonClick,
  renderActButtonWithCTA,
}: PublicationContainerProps) => {
  const { data: walletClient } = useWalletClient();
  const { data: isAuthenticated } = useIsAuthenticated();
  const { data: authenticatedProfileId } = useAuthenticatedProfileId();
  const { data: authenticatedProfile } = useProfile({
    forProfileId: authenticatedProfileId as ProfileId,
  });
  const { data: publication } = usePublication({
    forId: publicationId as PublicationId,
  });
  const { execute: toggleReaction } = useReactionToggle();
  const { execute: createMirror } = useCreateMirror();

  const [hasUpvoted, setHasUpvoted] = useState<boolean>(publication?.operations?.hasUpvoted || false);
  const [hasMirrored, setHasMirrored] = useState<boolean>(publication?.operations?.hasMirrored || false);

  if (!(publicationId || publication)) throw new Error('Need publicationId or publication');

  const _publicationId = publication?.id || publicationId!;

  const onShareButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    navigator.clipboard.writeText(`${MADFI_SITE_URL}/post/${_publicationId}`);

    toast("Link copied to clipboard", { position: "bottom-center", icon: "🔗", duration: 2000 });
  };

  const goToPublicationPage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`${MADFI_SITE_URL}/post/${_publicationId}`, '_blank');
  };

  // stub the encrypted pub metadata to render something nicer
  const getPublicationDataPotentiallyEncrypted = (publication: PostFragmentPotentiallyDecrypted): any => {
    if (!publication.metadata?.encryptedWith || publication.isDecrypted) {
      return JSON.parse(JSON.stringify(publication));
    }

    return {
      ...publication,
      metadata: {
        content: "This publication is gated",
        asset: {
          __typename: "PublicationMetadataMediaImage",
          image: { raw: { uri: MADFI_BANNER_IMAGE_SMALL } }
        },
        encryptedWith: publication.metadata.encryptedWith
      }
    };
  }

  const handleCommentButton = (e) => {
    if (shouldGoToPublicationPage) return goToPublicationPage(e);
    if (onCommentButtonClick) onCommentButtonClick(e);
  };

  const onLikeButtonClick = async (e: React.MouseEvent, publication?: PrimaryPublication) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || hasUpvoted || !publication) return;

    await toggleReaction({
      reaction: PublicationReactionType.Upvote,
      publication
    });

    setHasUpvoted(true);
    toast.success("Liked", { duration: 3000 });
  };

  const onMirrorButtonClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || hasMirrored) return;

    const toastId = toast.loading("Preparing mirror...");
    try {
      const result = await createMirror({
        mirrorOn: publication!.id as PublicationId
      });

      if (result.isFailure()) throw new Error(result.error.message);
      const completion = await result.value.waitForCompletion();
      if (completion.isFailure()) throw new Error(completion.error.message);

      setHasMirrored(true);
      toast.success("Mirrored", { duration: 3000, id: toastId });
    } catch (error) {
      console.log(error);
      toast.error("Failed to mirror", { id: toastId });
    }
  };

  if (!publication?.id) return null;

  return (
    <div className="mt-4 relative">
      <Publication
        key={publication?.isDecrypted ? `pub-${publication.id}-decrypted` : undefined}
        // publicationId={publication?.id ? publication!.id : publicationId}
        publicationData={getPublicationDataPotentiallyEncrypted(publication)}
        theme={Theme.dark}
        environment={LENS_ENVIRONMENT}
        authenticatedProfile={authenticatedProfile || undefined}
        walletClient={walletClient || undefined}
        onClick={shouldGoToPublicationPage || publication?.metadata.encryptedWith ? (e) => goToPublicationPage(e) : undefined}
        onShareButtonClick={(e) => onShareButtonClick(e)}
        onCommentButtonClick={handleCommentButton}
        onActButtonClick={onActButtonClick}
        renderActButtonWithCTA={renderActButtonWithCTA}
        onLikeButtonClick={!hasUpvoted ? onLikeButtonClick : undefined}
        onMirrorButtonClick={!hasMirrored ? onMirrorButtonClick : undefined}
        // @ts-ignore
        operations={{
          ...publication?.operations || {},
          hasUpvoted: publication?.operations?.hasUpvoted || hasUpvoted,
          hasMirrored: publication?.operations?.hasMirrored || hasMirrored,
        }}
        useToast={toast}
        rpcURLs={JSON_RPC_URL_ALCHEMY_MAP}
        appDomainWhitelistedGasless={IS_PRODUCTION}
      />
    </div>
  )
};

export default PublicationContainer;