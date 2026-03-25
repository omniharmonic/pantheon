import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/pantheon',
  assetPrefix: '/pantheon/',
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
