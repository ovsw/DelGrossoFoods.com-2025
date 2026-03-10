import type { NextConfig } from "next";

import { getLegacyProductRedirects } from "./src/lib/redirects/legacy-product-redirects";
import { getLegacyRecipeRedirects } from "./src/lib/redirects/legacy-recipe-redirects";
import { getLegacyShopOnlineRedirects } from "./src/lib/redirects/legacy-shop-online-redirects";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@workspace/ui",
    "@workspace/sanity-config",
    "next-sanity",
  ],
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
  async redirects() {
    return [
      ...getLegacyProductRedirects(),
      ...getLegacyRecipeRedirects(),
      ...getLegacyShopOnlineRedirects(),
      {
        source: "/news",
        destination: "/",
        permanent: true,
      },
      {
        source: "/news/:path*",
        destination: "/",
        permanent: true,
      },
      {
        source: "/history/:path+",
        destination: "/history",
        permanent: true,
      },
    ];
  },
  // This is needed to support the color scheme client hint
  async headers() {
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
  },
};

export default nextConfig;
