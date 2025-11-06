import { client } from "@workspace/sanity-config/client";
import { token } from "@workspace/sanity-config/token";
import { defineEnableDraftMode } from "next-sanity/draft-mode";

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token }),
});
