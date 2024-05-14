'use client'
import { LensConfig } from '@lens-protocol/react-web'
import { bindings as wagmiBindings } from '@lens-protocol/wagmi'
import { LensProvider as Provider, development, production } from '@lens-protocol/react-web'
import { IS_PRODUCTION } from '@/lib/consts'
import useIsMounted from '@/hooks/useIsMounted'

const LensProvider = ({ children }) => {
  const isMounted = useIsMounted();

  // refuse to init until we have window.localstorage
  if (!isMounted) return children;

  const lensConfig: LensConfig = {
    bindings: wagmiBindings(),
    environment: IS_PRODUCTION ? production : development,
    storage: window.localStorage // TODO: not actually being used, on refresh have to login again...
  }

  return (
    <Provider config={lensConfig}>
      {children}
    </Provider>
  )
};

export default LensProvider;