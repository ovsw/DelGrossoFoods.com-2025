import {
  isSiteCode,
  resolveSiteDocumentId,
  type SiteCode,
} from "@workspace/sanity-schema/site";

export type SiteQueryParams = {
  siteCode: SiteCode;
  siteId: string;
};

export const getSiteCodeFromEnv = (): SiteCode => {
  const raw = process.env.SITE_CODE;
  if (!isSiteCode(raw)) {
    throw new Error(
      "SITE_CODE must be set to a valid site code (DGF or LFD) in the app environment.",
    );
  }
  return raw;
};

export const resolveSiteParams = (siteCode: SiteCode): SiteQueryParams => ({
  siteCode,
  siteId: resolveSiteDocumentId(siteCode),
});

export const getSiteParams = (): SiteQueryParams =>
  resolveSiteParams(getSiteCodeFromEnv());
