import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  compress: true,
  webpack: (config: any, { isServer }: any) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          three: { test: /three|@react-three/, name: 'three', priority: 20 },
          mediapipe: { test: /@mediapipe/, name: 'mediapipe', priority: 20 }
        }
      };
    }
    return config;
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
};

export default nextConfig;
