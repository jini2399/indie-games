import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/indie-games",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
