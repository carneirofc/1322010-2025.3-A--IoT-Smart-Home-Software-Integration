import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Ships untranspiled "use client" ESM modules.
  transpilePackages: ["@carneirofc/ui"],
};

export default nextConfig;
