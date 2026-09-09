"use client";

import { createIubendaBootstrap, iubendaSites } from "../lib/iubenda";

export function IubendaHead({
  site,
  gaId,
}: {
  site: keyof typeof iubendaSites;
  gaId?: string;
}) {
  // React 19 emits normal head children AFTER its async bootstrap scripts.
  // A native head preamble keeps Iubenda's classic snippet first. All values
  // are fixed numeric IDs or escaped by createIubendaBootstrap, never CMS HTML.
  // React acquires the head singleton during hydration. Never give the browser
  // an innerHTML assignment: it would remove Next's hoisted CSS and metadata.
  // These parser-loaded scripts are server-only, unmanaged head content.
  if (typeof window !== "undefined") return <head suppressHydrationWarning />;
  const html = `<meta charset="utf-8"><script id="dg-iubenda-config">${createIubendaBootstrap(site, gaId)}</script>
<script src="https://cs.iubenda.com/autoblocking/${iubendaSites[site].siteId}.js"></script>
<script src="https://cdn.iubenda.com/cs/gpp/stub.js"></script>
<script src="https://cdn.iubenda.com/cs/iubenda_cs.js" charset="UTF-8" async></script>`;

  return (
    <head suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />
  );
}
