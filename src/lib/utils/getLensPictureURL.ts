import { formatProfilePicture } from "@madfi/widgets-react";
import { DefaultLensProfile } from "@/types/lens";

export default (profile: DefaultLensProfile) => {
  return formatProfilePicture(profile).metadata.picture.url
};