export const KNOWN_SITE_IDS = ["DGF", "LFD"] as const;

export type KnownSiteId = (typeof KNOWN_SITE_IDS)[number];

export const SITE_ID_COOKIE_NAME = "dgf-site-id";

export const isKnownSiteId = (value: string): value is KnownSiteId =>
  (KNOWN_SITE_IDS as readonly string[]).includes(value.toUpperCase());

export const normalizeSiteId = (
  value: string | null | undefined,
): KnownSiteId | undefined => {
  if (!value) return undefined;
  const normalized = value.trim().toUpperCase();
  return isKnownSiteId(normalized) ? normalized : undefined;
};
