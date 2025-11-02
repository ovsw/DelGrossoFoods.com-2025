import { defineLive } from "next-sanity";

import { resolveSiteId } from "../site";
import { client } from "./client";
import { token } from "./token";

/**
 * Use defineLive to enable automatic revalidation and refreshing of your fetched content
 * Learn more: https://github.com/sanity-io/next-sanity?tab=readme-ov-file#1-configure-definelive
 */

const { sanityFetch: baseSanityFetch, SanityLive } = defineLive({
  client,
  // Required for showing draft content when the Sanity Presentation Tool is used, or to enable the Vercel Toolbar Edit Mode
  serverToken: token,
  // Required for stand-alone live previews, the token is only shared to the browser if it's a valid Next.js Draft Mode session
  browserToken: token,
});

type BaseSanityFetch = typeof baseSanityFetch;

type FetchOptions = Parameters<BaseSanityFetch>[0];

const normalizeParams = async (
  params: FetchOptions["params"],
  siteId: string,
) => {
  const resolved = await Promise.resolve(params ?? {});

  if (resolved && typeof resolved === "object" && !Array.isArray(resolved)) {
    const paramsObject = resolved as Record<string, unknown>;
    if (paramsObject.siteId === undefined) {
      return {
        ...paramsObject,
        siteId,
      };
    }

    return paramsObject;
  }

  return { siteId };
};

export const sanityFetch: BaseSanityFetch = async (options) => {
  const siteId = await resolveSiteId();
  const params = await normalizeParams(options.params, siteId);

  return baseSanityFetch({
    ...options,
    params,
  });
};

export { SanityLive };
