# madfi-live-app

Livestreaming app that allows Lens profiles to host multi-host livestream sessions.

This app uses the **now deprecated** Livepeer Rooms API, as well as [Livekit React](https://docs.livekit.io/reference/components/react/) to handle live components.

This used to be the `ClubSpace` app, which used [Radiomast](radiomast.io) and [Sound](https://www.sound.xyz) + [Spinamp](https://spinamp.xyz/) for live listening parties + music NFT mints.

We would love to see this app become something new for crypto social, and can provide [$bonsai](https://bonsai.meme/) incentives to get the party started! Check out our [Ecosystem Support blog post](https://mirror.xyz/madfiprotocol.eth/C9xK_nsXdASiNq77NsaT4hrsS3oWuzmDHV5sLMMUFzE) for more info.

The rest of this README is meant to help anyone understand the _very_ basics for running this app. The most likely case is that someone can take this app - fork it, and gut it - to make a new livestream app that utilizes the Lens social graph, open actions, and $bonsai.

## create a livestream
- see the POST endpoint at `src/pages/api/space/create.ts` for the request body params necessary
- the `handle` body param is used for the livestream session url
- at the hosted app (`NEXT_PUBLIC_SITE_URL`) domain, the livestream can be accessed at `${NEXT_PUBLIC_SITE_URL}/${handle}`

## setup

### environment
the varibles defined towards the top are the most important

```bash
cp .env.example .env.local
```

### install
```bash
nvm use
pnpm install
```

### run
```bash
yarn dev
```

## improvements needed
- migrating to the new [Livepeer API](https://docs.livepeer.org/api-reference/overview/introduction) - NOTE: the new api does not enable multi-host streams
- removing unused code
- adding Lens JWT verification for hosts
- supporting open actions during the stream
- more flexible post pinning
- various desktop/mobile specific bugs
- stability bugs