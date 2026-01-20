import { useClient as useSanityClient } from "sanity";

export type SanityClient = ReturnType<typeof useSanityClient>;

export const listenOptions = {
  includeResult: false,
  includePreviousRevision: false,
  visibility: "query" as const,
  events: ["welcome", "mutation", "reconnect"] as Array<
    "welcome" | "mutation" | "reconnect"
  >,
};

export function useTagsClient(): SanityClient {
  return useSanityClient({ apiVersion: "2025-02-19" });
}
