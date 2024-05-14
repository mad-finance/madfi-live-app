import { useEffect } from "react";

export const Hero = () => {
  const MADFI_LANDING = 'https://madfi.xyz';

  useEffect(() => {
    window.location.href = MADFI_LANDING;
  }, []);

  return null;
};
