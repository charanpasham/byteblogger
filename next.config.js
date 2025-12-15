/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: { 
    remotePatterns: [ 
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "o5vr90ifqp.ufs.sh" }
    ],
  },
};

export default config;
