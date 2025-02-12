import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  experimental: {},
  output: 'standalone'
};

export default nextConfig;
