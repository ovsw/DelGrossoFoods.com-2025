export const SITE_CODES = ["DGF", "LFD"] as const;

export type SiteCode = (typeof SITE_CODES)[number];

export const SITE_DOCUMENT_IDS: Record<SiteCode, string> = {
  DGF: "site-DGF",
  LFD: "site-LFD",
};

export const SITE_DOCUMENT_ID_VALUES = Object.values(SITE_DOCUMENT_IDS);

export const isSiteCode = (
  value: string | null | undefined,
): value is SiteCode => value === "DGF" || value === "LFD";

export const resolveSiteDocumentId = (code: SiteCode): string =>
  SITE_DOCUMENT_IDS[code];
