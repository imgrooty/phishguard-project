import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['randomuser.me'],
  },
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
