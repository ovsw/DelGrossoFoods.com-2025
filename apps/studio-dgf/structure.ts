import {
  createSiteStructure,
  isSiteCode,
  type SiteCode,
} from "@workspace/sanity-schema";

const envSiteCode = process.env.SANITY_STUDIO_SITE_CODE;

if (!isSiteCode(envSiteCode)) {
  throw new Error(
    "SANITY_STUDIO_SITE_CODE must be set to a valid site code (DGF or LFD).",
  );
}

const siteCode = envSiteCode as SiteCode;

// Set `includeSiteDocument: true` temporarily if you ever need to surface the
// raw `site` document in the desk structure for maintenance.
export const structure = createSiteStructure({ siteCode });
