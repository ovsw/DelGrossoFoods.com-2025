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
  // Next still appends its metadata/styles/scripts. Iubenda also inserts nodes,
  // so this server-owned head must not be compared as a static HTML string.
  const html = `<meta charset="utf-8"><script id="dg-iubenda-config">${createIubendaBootstrap(site, gaId)}</script>
<script src="https://cs.iubenda.com/autoblocking/${iubendaSites[site].siteId}.js"></script>
<script src="https://cdn.iubenda.com/cs/gpp/stub.js"></script>
<script src="https://cdn.iubenda.com/cs/iubenda_cs.js" charset="UTF-8" async></script>`;

  return (
    <head suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />
  );
}
