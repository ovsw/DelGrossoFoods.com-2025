import { cookies, headers } from "next/headers";

import {
  isKnownSiteId,
  type KnownSiteId,
  normalizeSiteId,
  SITE_ID_COOKIE_NAME,
} from "./site/constants";

const DEFAULT_SITE_ID: KnownSiteId = "DGF";

export const brandBySiteId = {
  DGF: "dgf",
  LFD: "lfd",
} as const;

type BrandKey = (typeof brandBySiteId)[KnownSiteId];

const HOST_TO_SITE_ID: Record<string, KnownSiteId> = {
  "localhost:3000": DEFAULT_SITE_ID,
  "127.0.0.1:3000": DEFAULT_SITE_ID,
  "dgf.localhost:3000": "DGF",
  "lfd.localhost:3000": "LFD",
  "delgrossofoods.com": "DGF",
  "www.delgrossofoods.com": "DGF",
  "lafamigliadelgrosso.com": "LFD",
  "www.lafamigliadelgrosso.com": "LFD",
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

const DEFAULT_BRAND = brandBySiteId[DEFAULT_SITE_ID];

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

  const host = headerList.get("host")?.toLowerCase() ?? "";

  if (!host) return DEFAULT_SITE_ID;

  if (host in HOST_TO_SITE_ID) {
    return HOST_TO_SITE_ID[host]!;
  }

  const fallback = hostFallbacks.find(({ match }) => match(host));
  if (fallback) return fallback.siteId;

  return DEFAULT_SITE_ID;
}

export function resolveBrandKey(siteId: string): BrandKey {
  if (isKnownSiteId(siteId)) {
    return brandBySiteId[siteId];
  }
  return DEFAULT_BRAND;
}

export async function getActiveSite() {
  const siteId = await resolveSiteId();
  return {
    siteId,
    brand: resolveBrandKey(siteId),
  };
}
