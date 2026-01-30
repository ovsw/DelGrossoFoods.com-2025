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

// Toggle `includeSiteDocument` to true temporarily if you need to expose the
// raw `site` document inside the desk structure for maintenance.
export const structure = createSiteStructure({ siteCode });
