import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "enwhjnkfwjoxfswgelik.supabase.co",
        port: "",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
        port: "",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
