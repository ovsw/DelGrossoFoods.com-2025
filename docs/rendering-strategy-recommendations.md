# Rendering Strategy Recommendations For `web-dgf` And `web-lfd`

## Executive Summary

Given the stated constraints:

- editors should publish in Sanity Studio without triggering app rebuilds
- published content should become visible to viewers immediately
- resource usage should stay as low as possible

the best fit is **cache-first public rendering with Sanity Live invalidation**, not fully dynamic SSR for all traffic.

In practical terms:

1. Use **static rendering / ISR for public traffic wherever the route output is mostly content-driven and identical for all viewers**.
2. Keep **draft mode / visual editing isolated to preview sessions**, not in the critical path for every public request.
3. Use **Sanity Live automatic tag invalidation** for freshness instead of rebuilds.
4. Reduce server work on detail pages by **collapsing related-content subqueries**.

The repo is already partly aligned with this direction because both storefronts use `defineLive()` and `sanityFetch()` from the shared `@workspace/sanity-config/live` package (`packages/sanity-config/src/live.tsx:1-13`), and the shared Sanity client is configured for the published perspective with CDN enabled in production (`packages/sanity-config/src/client.ts:50-59`).

The biggest current performance issue is that the public app shell is still biased toward request-time rendering:

- both root layouts read `draftMode()` and render `SanityLive` globally (`apps/web-dgf/src/app/layout.tsx:44-109`, `apps/web-lfd/src/app/layout.tsx:45-108`)
- the shared header and footer fetch Sanity data in the root layout path (`apps/web-dgf/src/components/features/header/header-server.tsx:96-118`, `apps/web-dgf/src/components/features/footer/footer.tsx:78-92`, mirrored in `web-lfd`)
- the catalog pages await `searchParams` on the server even though filtering is client-side state sync (`apps/web-dgf/src/app/store/page.tsx:56-95`, `apps/web-dgf/src/app/sauces/page.tsx:55-93`, `apps/web-dgf/src/app/recipes/page.tsx:66-114`)

That combination leaves performance on the table.

## What The Codebase Already Has Going For It

### 1. Shared live Sanity integration

Both apps use the same live integration:

- `defineLive()` wraps the Sanity client and tokens in `packages/sanity-config/src/live.tsx:6-12`
- the shared client uses the published perspective and `useCdn: true` in production in `packages/sanity-config/src/client.ts:50-59`

This is the correct foundation for a publish-without-rebuild workflow.

Important nuance:

- `defineLive()` + `sanityFetch()` + `<SanityLive />` already provide automatic tag-based cache invalidation for cached Sanity queries
- that invalidation is app-traffic mediated because `<SanityLive />` listens for content changes in the browser and then triggers server-side tag revalidation
- if the requirement is "fresh on the next visitor after publish," this setup is usually sufficient
- if the requirement is "fresh immediately even when nobody has the app open," add a server-side webhook or route handler in addition to Sanity Live

### 2. Catch-all CMS pages already expose a strong static path

The catch-all content pages in both apps already use `generateStaticParams()` based on Sanity slugs:

- `apps/web-dgf/src/app/[...slug]/page.tsx:19-28, 51-53`
- `apps/web-lfd/src/app/[...slug]/page.tsx:19-28, 51-53`

These are strong candidates for aggressive static generation plus on-demand freshness.

### 3. Catalog filters are already client-side

The catalog UIs manage filters entirely on the client after receiving a dataset:

- `apps/web-dgf/src/components/features/catalog/recipes-client.tsx:226-340`
- equivalent client controllers exist for sauces and products

That means the route does not need request-time rendering just to read query params.

## Current Performance Risks

### 1. Public layouts are likely over-dynamic

Both root layouts call `draftMode()` directly and include live-preview components in the shared app shell:

- `apps/web-dgf/src/app/layout.tsx:70-109`
- `apps/web-lfd/src/app/layout.tsx:69-108`

From a routing strategy perspective, that is the main thing working against static/ISR optimization for public traffic.

### 2. Shared chrome is fetched for every route

The header and footer are server components mounted at the root layout and each fetch Sanity content:

- header: `apps/web-dgf/src/components/features/header/header-server.tsx:96-118`
- footer: `apps/web-dgf/src/components/features/footer/footer.tsx:78-92`

This is acceptable if those fetches are cacheable and invalidated by publish. It is expensive if they stay request-bound.

### 3. Catalog pages pay server cost for URL state that is already client-owned

Examples:

- `/store`: `apps/web-dgf/src/app/store/page.tsx:56-95`
- `/sauces`: `apps/web-dgf/src/app/sauces/page.tsx:55-93`
- `/recipes`: `apps/web-dgf/src/app/recipes/page.tsx:66-114`

All three fetch the full dataset and then await `searchParams` only to build `initialState` for a client component. That increases the chance the page becomes dynamic without adding meaningful server-side value.

### 4. Detail pages perform avoidable follow-up queries

Examples:

- sauce detail fetches the main sauce, then related products, then related recipes (`apps/web-dgf/src/app/sauces/[slug]/page.tsx:71-91`)
- product detail fetches the product, then sometimes an extra premium sauce, then related recipes (`apps/web-dgf/src/app/store/[slug]/page.tsx:167-242`, `apps/web-dgf/src/components/page-sections/product-page/product-related-recipes-section.tsx:13-57`)
- recipe detail fetches the recipe, then each related section refetches recipe-linked IDs before making another query (`apps/web-dgf/src/app/recipes/[slug]/page.tsx:87-110`, `apps/web-dgf/src/components/page-sections/recipe-page/recipe-related-sauces-section.tsx:16-46`, `apps/web-dgf/src/components/page-sections/recipe-page/recipe-related-recipes-section.tsx:16-52`)

This is the highest-value route-level performance cleanup after fixing layout dynamism.

### 5. Font fetching is an operational bottleneck

A local production build attempt failed because `next/font/google` could not reach Google Fonts for the layout fonts, and the OG image route also fetches Google Fonts at request time:

- layout fonts: `apps/web-dgf/src/app/layout.tsx:26-32`, `apps/web-lfd/src/app/layout.tsx:25-38`
- OG fonts fetched over the network: `apps/web-dgf/src/app/api/og/route.tsx:176-214`

This is not directly a rendering-mode decision, but it affects build reliability and request latency.

## Recommended Default Model

### Public traffic

Use **static rendering / ISR with Sanity Live invalidation** for almost every viewer-facing page.

Reasoning:

- the content is editorial, not user-specific
- editors want publish-only freshness
- full dynamic SSR wastes compute on identical responses
- the shared Sanity live integration is already designed for this style of freshness
- manual `revalidateTag()` / `revalidatePath()` wiring is not required for the normal live setup

### Preview / editors

Use **dynamic rendering only for draft sessions**.

Reasoning:

- draft mode genuinely depends on per-request cookies and preview state
- editors are a tiny fraction of traffic
- there is no reason to make the whole public shell pay the same cost

## Route-By-Route Recommendations

| Route group                           | Apps | Recommended strategy                                                                               | Reasoning                                                                                                                                                                                                                   |
| ------------------------------------- | ---- | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Root layout + shared chrome           | Both | **Static/ISR app shell for public traffic; draft-only dynamic preview shell**                      | Header/footer/global settings are shared, editorial, and highly cacheable. The current layout reads `draftMode()` and mounts Sanity live preview globally, which is the main obstacle to maximizing cacheability.           |
| `/`                                   | Both | **Static/ISR with Sanity Live invalidation**                                                       | Homepage content is pure CMS content fetched via `sanityFetch()` and rendered through the page builder. It is identical for all users and should be served from cache.                                                      |
| `/[...slug]`                          | Both | **Static/ISR with `generateStaticParams()` for known slugs and on-demand rendering for new slugs** | These are classic CMS pages. Both apps already generate static params from Sanity slugs, which makes this the best route group for aggressive static generation.                                                            |
| `/history`, `/contact`, `/leadership` | Both | **Static/ISR with targeted live invalidation**                                                     | These pages are editorial, low-churn, and user-agnostic. They should not require request-time rendering. `leadership` should refresh when the index page document or any leader document changes.                           |
| `/where-to-buy`                       | Both | **ISR with live invalidation; separate tags for page chrome and retailer dataset**                 | The route is still viewer-agnostic, but the retailer payload is larger and more data-like than the marketing pages. Cache it, let Sanity Live invalidate the data, and avoid request-bound rendering.                       |
| `/sauces`, `/store`, `/recipes`       | Both | **Static/ISR list shell with cached collection payload; move URL-state parsing fully client-side** | The pages already ship a collection and filter it in the browser. Treat the route as a cached shell plus cached dataset rather than a request-time page. This yields the biggest win on route count and compute efficiency. |
| `/sauces/[slug]`                      | Both | **ISR per slug with live invalidation; collapse related-content fetches where possible**           | The route is content-driven and should be cacheable. The main opportunity is reducing the extra queries for related products and recipes.                                                                                   |
| `/store/[slug]`                       | Both | **ISR per slug with live invalidation; collapse premium-sauce and related-recipe lookups**         | Product detail pages are good cache candidates. `web-dgf` has an extra premium sauce author lookup that can likely be folded into the main query or cached separately.                                                      |
| `/recipes/[slug]`                     | Both | **ISR per slug with live invalidation; combine recipe + related IDs into fewer queries**           | This route currently does the most avoidable server work because related sections refetch the recipe before fetching related content. It should remain cacheable but be simplified.                                         |
| `/sitemap.xml`                        | Both | **Short-interval ISR or server-side publish invalidation**                                         | Freshness matters for SEO, but sub-second viewer freshness is unnecessary. Keep it cheap. Unlike page routes, this is a better fit for time-based refresh or a webhook if traffic-independent freshness matters.            |
| `/robots.txt`                         | Both | **Fully static**                                                                                   | It is deterministic and does not depend on Sanity content.                                                                                                                                                                  |
| `/api/og`                             | Both | **Dynamic edge route with strong CDN caching by query string; avoid per-request font fetches**     | OG generation is inherently dynamic, but the generated result is deterministic per content id / params. Cache the result aggressively at the edge.                                                                          |
| `/api/logo`                           | Both | **Static-like edge response with long CDN cache**                                                  | The output depends only on query params and does not need origin recomputation for repeat requests.                                                                                                                         |

## Recommended By Route Family

### 1. Marketing / CMS pages

Applies to:

- `/`
- `/[...slug]`
- `/history`
- `/contact`
- `/leadership`

Recommended strategy:

- pre-render statically where possible
- rely on Sanity Live invalidation for freshness
- keep preview-only logic out of the public render path

Why:

- all of these pages serve the same HTML to every viewer
- they benefit most from CDN caching
- they change when editors publish, not when users interact

### 2. Catalog pages

Applies to:

- `/sauces`
- `/store`
- `/recipes`

Recommended strategy:

- cache the page and the collection payload
- keep filtering in the browser
- stop letting request query params dictate server rendering

Why:

- the collection is already downloaded and filtered client-side
- the URL only preserves UI state
- request-time rendering adds cost without improving freshness

If these collections become much larger later, the right next step is not full SSR. It is **server-filtered cached data per search variant or pagination**, still backed by Sanity Live invalidation.

### 3. Detail pages

Applies to:

- `/sauces/[slug]`
- `/store/[slug]`
- `/recipes/[slug]`

Recommended strategy:

- cache each slug route
- invalidate by the primary document and any directly-related entities
- reduce server waterfalls

Why:

- viewers do not need per-request personalization
- content changes are editorial
- these pages currently do extra nested query work that can be removed without giving up freshness

## Highest-Value Changes To Support These Strategies

These are the most valuable implementation directions, ordered by impact.

### 1. Separate public rendering from preview rendering

Why it matters:

- this unlocks static/ISR behavior for the bulk of traffic
- it prevents every route from inheriting preview-related request costs

Most relevant current files:

- `apps/web-dgf/src/app/layout.tsx:44-109`
- `apps/web-lfd/src/app/layout.tsx:45-108`

### 2. Treat header/footer/global settings as cached shared content

Why it matters:

- shared chrome is on every route
- even small inefficiencies here multiply across the whole site

Most relevant current files:

- `apps/web-dgf/src/components/features/header/header-server.tsx:96-118`
- `apps/web-dgf/src/components/features/footer/footer.tsx:78-92`
- mirrored files in `web-lfd`

### 3. Remove server dependence on `searchParams` for catalog hydration

Why it matters:

- the browser already owns the filtering behavior
- this removes unnecessary request-coupling from three major route groups

Most relevant current files:

- `apps/web-dgf/src/app/store/page.tsx:56-95`
- `apps/web-dgf/src/app/sauces/page.tsx:55-93`
- `apps/web-dgf/src/app/recipes/page.tsx:66-114`

### 4. Collapse related-content queries on detail pages

Why it matters:

- lowers origin compute
- lowers tail latency
- reduces repeated Sanity round-trips

Most relevant current files:

- `apps/web-dgf/src/app/sauces/[slug]/page.tsx:71-91`
- `apps/web-dgf/src/app/store/[slug]/page.tsx:167-242`
- `apps/web-dgf/src/app/recipes/[slug]/page.tsx:87-110`
- `apps/web-dgf/src/components/page-sections/product-page/product-related-recipes-section.tsx:13-57`
- `apps/web-dgf/src/components/page-sections/recipe-page/recipe-related-sauces-section.tsx:16-46`
- `apps/web-dgf/src/components/page-sections/recipe-page/recipe-related-recipes-section.tsx:16-52`

### 5. Remove runtime font fetching from OG generation and reduce build-time font fragility

Why it matters:

- improves reliability
- removes avoidable latency from `/api/og`
- makes production builds less dependent on live Google Fonts availability

Most relevant current files:

- `apps/web-dgf/src/app/api/og/route.tsx:176-214`
- `apps/web-dgf/src/app/layout.tsx:26-32`
- `apps/web-lfd/src/app/layout.tsx:25-38`

## Per-App Notes

### `web-dgf`

Special note:

- product detail does extra work to fetch premium sauce author information (`apps/web-dgf/src/app/store/[slug]/page.tsx:200-214`)

Recommendation:

- still use the same ISR strategy as `web-lfd`, but treat this as an additional query-collapsing candidate

### `web-lfd`

Special notes:

- route structure is effectively the same as `web-dgf`
- product and sauce indexes apply different collection filters, but that does not change the rendering recommendation

Recommendation:

- apply the same route strategies as `web-dgf`

## Bottom-Line Recommendation

For both storefront apps, the optimal model is:

- **public pages:** static/ISR, cached aggressively, refreshed by Sanity Live invalidation
- **preview/editor sessions:** dynamic
- **catalog pages:** cached dataset + client filtering
- **detail pages:** cached per slug, with fewer Sanity round-trips

If only one architectural decision is made, it should be this:

> Do not solve Sanity publish freshness by making the whole storefront fully dynamic. Solve it by keeping public routes cacheable and letting Sanity Live invalidate cached Sanity fetches automatically. Add a webhook only if traffic-independent freshness is a hard requirement.

That gives the best balance of:

- editor autonomy
- immediate content freshness
- low origin compute
- better TTFB and cache hit rate

## External References

- Sanity Live Content API overview: https://www.sanity.io/docs/visual-editing/configuring-the-live-content-api
- Sanity + Next.js App Router integration: https://www.sanity.io/docs/visual-editing/integrating-with-next-js-app-router
- Next.js dynamic rendering guide: https://nextjs.org/docs/app/guides/caching#dynamic-rendering
- Next.js draft mode guide: https://nextjs.org/docs/app/building-your-application/configuring/draft-mode

## Validation Notes

- I analyzed the route tree and shared data-fetching layer directly from source.
- I attempted production builds for both `web-dgf` and `web-lfd`, but the sandbox could not reach `fonts.googleapis.com`, so I could not include a fresh production route table from `next build`.
