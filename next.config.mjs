/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

import withReactSvg from "next-react-svg";
import withPlugins from "next-compose-plugins";
import path from "path";
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
export default withPlugins(
  [
    [
      withReactSvg,
      {
        include: path.resolve(__dirname, "src/assets/svg"),
        webpack(config, options) {
          config.resolve.fallback = {
            ...config.resolve.fallback,
            fs: false,
          };
          return config;
        },
      },
    ],
  ],
  {
    reactStrictMode: true,
    swcMinify: true,
    transpilePackages: ["@lens-protocol", "@madfi"],
    webpack: (config) => {
      config.resolve.fallback = { fs: false };

      return config;
    },
    typescript: {
      // !! WARN !!
      // Dangerously allow production builds to successfully complete even if
      // your project has type errors.
      // !! WARN !!
      ignoreBuildErrors: true,
    },
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
    images: {
      domains: ["ipfs.io", "firebasestorage.googleapis.com", "lens.infura-ipfs.io", "madfinance.mypinata.cloud"],
    },
  }
)
