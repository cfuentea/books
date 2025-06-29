import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb',
    },
  },
  allowedDevOrigins: ["http://192.168.1.126:3000"],
};

export default nextConfig;
