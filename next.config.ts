import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",
  devIndicators: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

export default nextConfig;
