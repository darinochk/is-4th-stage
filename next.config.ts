import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  output: "standalone",
  // Optimize bundle size
  experimental: {
    optimizePackageImports: ["axios"],
  },
  // Compress output
  compress: true,
  // Production optimizations
  swcMinify: true,
};

export default withBundleAnalyzer(nextConfig);
