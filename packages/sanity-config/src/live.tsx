import { defineLive } from "next-sanity/live";

import { client } from "./client";
import { token } from "./token";

const liveHelpers = defineLive({
  client,
  serverToken: token,
  browserToken: token,
});

export const { sanityFetch, SanityLive } = liveHelpers;
export type { SanityLiveProps } from "next-sanity/live/client-components/live";
