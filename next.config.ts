import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return { beforeFiles: [{ source: "/", destination: "/textflow.html" }], afterFiles: [], fallback: [] };
  },
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
