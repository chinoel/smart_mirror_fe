import type { NextConfig } from "next";

module.exports = {
  async redirects() {
    return [
      {
        source: '/:path',
        destination: '/',
        permanent: false,
      },
    ]
  }
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
