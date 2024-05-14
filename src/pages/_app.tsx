import "tailwindcss/tailwind.css";
import "@rainbow-me/rainbowkit/styles.css";
import "@/styles/globals.css";
import "@/styles/fonts.css";
import "@/styles/calendar-override.css";
import "react-loading-skeleton/dist/skeleton.css";
import Web3Provider from "@/components/Web3Provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster, ToastBar } from "react-hot-toast";
import { Analytics } from "@vercel/analytics/react";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import CommonLayout from "@/components/Layouts/CommonLayout";
import Head from "next/head";
import { NEXT_PUBLIC_SITE_URL } from "@/lib/consts";
import { bucketImageLinkStorj } from "@/services/storj/storj";
import { trimText } from "@/utils";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24,
    },
  },
});

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// pageProps flow in Next goes like this:
// getServerSideProps | other next function in route -> _app -> Route Component
// Fix for SEO, see: https://github.com/vercel/next.js/issues/35172
const HandleSEO = ({ pageProps }) => {
  const { space } = pageProps;

  if (space) {
    const title = `MadFi Live | ${space.roomName}`;
    const description = trimText(`@${space?.creatorLensHandle} is hosting a livestream!`, 150);
    const image = bucketImageLinkStorj(`live/${space.creatorLensHandle}`);
    const altImage = "https://link.storjshare.io/raw/jvnvg6pove7qyyfbyo5hqggdis6a/misc%2Fmadfi-banner.jpeg";

    return (
      <Head>
        <title>{title}</title>
        <meta name="description" content={description}></meta>
        <meta property="og:title" content={title}></meta>
        <meta property="og:description" content={description}></meta>
        <meta property="og:url" content={NEXT_PUBLIC_SITE_URL}></meta>
        <meta property="og:type" content="website"></meta>
        <meta property="og:image" content={image}></meta>
        <meta property="og:image:alt" content={altImage}></meta>
        <meta property="og:image:width" content="1200"></meta>
        <meta property="og:image:height" content="630"></meta>
        <meta property="og:locale" content="en_IE"></meta>
        <meta property="og:site_name" content="MadFi Live"></meta>
        <meta name="twitter:creator" content="@madfiprotocol"></meta>
        <meta name="twitter:card" content="summary_large_image"></meta>
        <meta name="twitter:title" content={title}></meta>
        <meta name="twitter:description" content={description}></meta>
        <meta name="twitter:image" content={image}></meta>
        {/* <link
          rel="iframely player audio"
          type="text/html"
          href={`${NEXT_PUBLIC_SITE_URL}/embed/${space?.creatorLensHandle}`}
          media="(aspect-ratio: 2/1)"
        ></link> */}
        <meta name="theme-color" content="#141414"></meta>
      </Head>
    );
  }

  return (
    <Head>
      <title>MadFi Live</title>
      <meta name="description" content="Host your next livestream on MadFi with onchain loyalty, sponsorships, and more."></meta>
      <meta property="og:title" content="MadFi"></meta>
      <meta property="og:description" content="Host your next livestream on MadFi with onchain loyalty, sponsorships, and more."></meta>
      <meta property="og:url" content={NEXT_PUBLIC_SITE_URL}></meta>
      <meta property="og:type" content="website"></meta>
      <meta
        property="og:image"
        content="https://link.storjshare.io/raw/jvnvg6pove7qyyfbyo5hqggdis6a/misc%2Fmadfi-banner.jpeg"
      ></meta>
      <meta property="og:image:width" content="1200"></meta>
      <meta property="og:image:height" content="630"></meta>
      <meta property="og:locale" content="en_IE"></meta>
      <meta property="og:site_name" content="MadFi"></meta>
      <meta name="twitter:creator" content="@madfiprotocol"></meta>
      <meta name="twitter:card" content="summary_large_image"></meta>
      <meta name="twitter:title" content="MadFi Live"></meta>
      <meta name="twitter:description" content="Host your next livestream on MadFi with onchain loyalty, sponsorships, and more."></meta>
      <meta
        name="twitter:image"
        content="https://link.storjshare.io/raw/jvnvg6pove7qyyfbyo5hqggdis6a/misc%2Fmadfi-banner.jpeg"
      ></meta>
      {/* {handle && (
        <link
          rel="iframely player audio"
          type="text/html"
          href={`${NEXT_PUBLIC_SITE_URL}/embed/${handle}`}
          media="(aspect-ratio: 2/1)"
        ></link>
      )} */}
    </Head>
  );
};

const App = ({ Component, pageProps }: AppPropsWithLayout) => {
  const getLayout = Component.getLayout ?? ((page) => <CommonLayout>{page}</CommonLayout>);
  return (
    <>
      <HandleSEO pageProps={pageProps} />
      <QueryClientProvider client={queryClient}>
        <Web3Provider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                backgroundColor: "#000",
                color: "white",
              },
            }}
          >
            {(t) => (
              <ToastBar toast={t}>
                {({ icon, message }) => (
                  <>
                    {icon}
                    {message}
                  </>
                )}
              </ToastBar>
            )}
          </Toaster>
          {getLayout(
            <>
              <Component {...pageProps} />
              <Analytics />
            </>
          )}
        </Web3Provider>
        {/* <ReactQueryDevtools /> */}
      </QueryClientProvider>
    </>
  );
};

export default App;
