import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // CI runs the repository ESLint command before the production build.
  eslint: { ignoreDuringBuilds: true },
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
};

export default nextConfig;
