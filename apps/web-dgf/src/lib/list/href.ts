/**
 * Build a stable href for list/detail cards.
 * Ensures single leading slash and deduplicates accidental slashes.
 */
export function buildHref(
  basePath: string,
  slug: string | null | undefined,
): string {
  const base = `/${String(basePath || "").replace(/^\/+|\/+$/g, "")}`;
  if (!slug) return base;
  const s = String(slug);
  if (s.startsWith("/")) return s; // already absolute
  return base === "/" ? `/${s}` : `${base}/${s}`;
}
