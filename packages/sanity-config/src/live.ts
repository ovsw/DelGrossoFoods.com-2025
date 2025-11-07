import { defineLive } from "next-sanity";

import { client } from "./client";
import { token } from "./token";

const liveHelpers = defineLive({
  client,
  serverToken: token,
  browserToken: token,
});

export const { sanityFetch } = liveHelpers;
export const SanityLive: typeof liveHelpers.SanityLive = liveHelpers.SanityLive;
