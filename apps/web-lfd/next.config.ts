// Dummy change to force Vercel to see a new commit and trigger a fresh build.
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@workspace/ui", "@workspace/sanity-config"],
  experimental: {
    reactCompiler: true,
    inlineCss: true,
  },
  logging: {
    fetches: {},
  },
  images: {
    minimumCacheTTL: 31536000,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/**`,
      },
      {
        protocol: "https",
        hostname: "image.mux.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

// This is needed to support the color scheme client hint
export async function headers() {
  return [
    {
      source: "/:path*",
      headers: [
        { key: "Accept-CH", value: "Sec-CH-Prefers-Color-Scheme" },
        { key: "Critical-CH", value: "Sec-CH-Prefers-Color-Scheme" },
        { key: "Vary", value: "Sec-CH-Prefers-Color-Scheme" },
      ],
    },
  ];
}
