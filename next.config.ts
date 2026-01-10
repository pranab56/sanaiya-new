import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.senaeya.net",
      },
      {
        protocol: "https",
        hostname: "api.senaeya.netundefined",
      }
    ]
  }
};

export default nextConfig;
