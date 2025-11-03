import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { client } from "@/lib/sanity/client";
import { token } from "@/lib/sanity/token";

// Ensure this route is always dynamic so cookies are updated correctly
export const dynamic = "force-dynamic";

// Expose GET handler to enable Next.js Draft Mode for Sanity Presentation
export const { GET } = defineEnableDraftMode({
  // Force non-CDN + token for secret validation and draft access
  client: client.withConfig({ token, useCdn: false }),
  // In dev, set Secure + SameSite=None so cookies are accepted in the Presentation iframe
  secureDevMode: true,
});
