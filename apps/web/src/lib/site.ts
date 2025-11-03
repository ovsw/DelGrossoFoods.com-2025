import { cookies, headers } from "next/headers";

import {
  isKnownSiteId,
  type KnownSiteId,
  normalizeSiteId,
  SITE_ID_COOKIE_NAME,
} from "./site/constants";

const BUILD_SITE_ID = normalizeSiteId(process.env.BUILD_SITE_ID);

export const brandBySiteId = {
  DGF: "dgf",
  LFD: "lfd",
} as const;

type BrandKey = (typeof brandBySiteId)[KnownSiteId];

const HOST_TO_SITE_ID: Record<string, KnownSiteId> = {
  "localhost:3000": "DGF",
  "127.0.0.1:3000": "DGF",
  "dgf.localhost:3000": "DGF",
  "lfd.localhost:3000": "LFD",
  "dgf-2025.vercel.app": "DGF",
  "lfd-2025.vercel.app": "LFD",
  "delgrossofoods.com": "DGF",
  "www.delgrossofoods.com": "DGF",
  "delgrossosauce.com": "LFD",
  "www.delgrossosauce.com": "LFD",
};

const hostFallbacks: Array<{
  match: (host: string) => boolean;
  siteId: KnownSiteId;
}> = [
  {
    match: (host) => host.includes("lafamiglia"),
    siteId: "LFD",
  },
  {
    match: (host) => host.includes("lfd"),
    siteId: "LFD",
  },
  {
    match: (host) => host.includes("delgrosso"),
    siteId: "DGF",
  },
  {
    match: (host) => host.includes("dgf"),
    siteId: "DGF",
  },
];

export async function resolveSiteId(): Promise<KnownSiteId> {
  const headerList = await headers();
  const headerSiteId = normalizeSiteId(headerList.get("x-dgf-site-id"));
  if (headerSiteId) {
    return headerSiteId;
  }

  const cookieStore = await cookies();
  const cookieSiteId = normalizeSiteId(
    cookieStore.get(SITE_ID_COOKIE_NAME)?.value,
  );
  if (cookieSiteId) {
    return cookieSiteId;
  }

  const host = headerList.get("host")?.toLowerCase();

  if (!host) {
    const buildSiteId = getBuildSiteId();
    if (buildSiteId) {
      return buildSiteId;
    }

    throw new Error(
      "Unable to resolve site id: missing host header and BUILD_SITE_ID not set",
    );
  }

  if (host in HOST_TO_SITE_ID) {
    return HOST_TO_SITE_ID[host]!;
  }

  const fallback = hostFallbacks.find(({ match }) => match(host));
  if (fallback) return fallback.siteId;

  throw new Error(`Unable to resolve site id for host: ${host}`);
}

export function getBuildSiteId(): KnownSiteId | undefined {
  return BUILD_SITE_ID;
}

export function requireBuildSiteId(context?: string): KnownSiteId {
  if (BUILD_SITE_ID) {
    return BUILD_SITE_ID;
  }

  const message =
    "BUILD_SITE_ID environment variable must be set for static generation" +
    (context ? ` (${context})` : "");

  throw new Error(message);
}

export function resolveBrandKey(siteId: string): BrandKey {
  if (isKnownSiteId(siteId)) {
    return brandBySiteId[siteId];
  }
  throw new Error(`Unknown site id: ${siteId}`);
}

export async function getActiveSite() {
  const siteId = await resolveSiteId();
  return {
    siteId,
    brand: resolveBrandKey(siteId),
  };
}
