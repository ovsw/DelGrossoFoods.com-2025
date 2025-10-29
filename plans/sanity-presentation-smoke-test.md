# Sanity Presentation End-to-End Smoke Test

This runbook verifies Live Preview (stega metadata) and click-to-edit overlays via the Sanity Presentation tool across all major page types. It assumes API version 2025-02-19+, next-sanity v10, and single-perspective clients.

See also: plans/sanity-preview-parity-audit.md

## 1) Preconditions

- Tooling: pnpm 10.x, Node >= 22.12, Turbo 2.x
- Env files present and populated:
  - Web: apps/web/.env.local
    - NEXT_PUBLIC_SANITY_PROJECT_ID
    - NEXT_PUBLIC_SANITY_DATASET
    - NEXT_PUBLIC_SANITY_API_VERSION (2025-02-19)
    - NEXT_PUBLIC_SANITY_STUDIO_URL (http://localhost:3333 in dev)
    - SANITY_API_READ_TOKEN (viewer scope)
  - Studio: apps/studio/.env
    - SANITY_STUDIO_PROJECT_ID
    - SANITY_STUDIO_DATASET
    - SANITY_STUDIO_TITLE
    - SANITY_STUDIO_PRESENTATION_URL (required in production)
- Client configuration:
  - apps/web/src/lib/sanity/client.ts: perspective: "published"; stega: { studioUrl } (always on)
  - apps/web/src/lib/sanity/live.ts: defineLive configured with serverToken + browserToken
  - apps/web/src/app/layout.tsx mounts <VisualEditing /> (draftMode) and <SanityLive />
- Queries audited: apps/web/src/lib/sanity/query.ts contains no path('drafts.\*\*') filters.

## 2) Start local servers

Open two terminals.

Terminal A (Studio):

- pnpm --filter studio dev
- Verify: Studio at http://localhost:3333

Terminal B (Web):

- pnpm --filter web dev
- Verify: Web at http://localhost:3000

## 3) Enable Presentation (draft mode)

- In Studio, open any document and click “Open in Presentation” (custom action).
  - apps/studio/plugins/presentation-url.ts
- Expected: The Studio’s Presentation tool opens at `/presentation` and loads the site in an iframe with overlays enabled.
- Draft mode is enabled automatically by the Presentation tool via `GET /api/presentation-draft`.
  - Endpoint: apps/web/src/app/api/presentation-draft/route.ts
  - Signal: The site’s Preview Bar appears and overlays are active.

## 4) Overlay presence checks (click-to-edit)

On each page below, hover elements and verify overlay/inspector affordances appear and click-to-edit focuses the correct Studio field.
Tip: In DevTools, confirm presence of `data-sanity` attributes or stega spans on visible content.

- Home page: /
  - Title, hero copy, page builder blocks (CTA, Feature, FeatureCardsIcon, ImageLinkCards, SubscribeNewsletter, HomeSlideshow)
- Slug pages: /<page-slug>
  - Title, description, page builder blocks
- Blog
  - Index: /blog — header + list card titles/descriptions
  - Slug: /blog/<slug> — title, description, rich text body
- Sauces
  - Index: /sauces — page header image + title
  - Slug: /sauces/<slug> — name, description (rich text), main image
- Recipes
  - Index: /recipes — header + grid items
  - Slug: /recipes/<slug> — name, ingredients/directions, related items
- Store (Products)
  - Index: /store — grid items, filters not required for overlay
  - Slug: /store/<slug> — name, description (rich text), image
- History, Contact, Where to Buy
  - /history, /contact, /where-to-buy — headings, description, content blocks
- Shared UI
  - Navbar (links from Sanity) and Footer (links/columns) should show overlay markers on text/link labels

## 5) Live update behavior

- With Presentation open, edit a visible field in Studio (e.g., a title or description) and save the draft.
- Expected: The overlayed site re-renders content near-immediately without a hard refresh.
- Confirm stega metadata (`data-sanity`/stega spans) is present in DevTools Elements (Presentation reads these to map fields).

## 6) Draft-only edge cases

- Create a new document (e.g., a blog or page) with a slug but do not publish.
- Try opening its route via Presentation.
- Expected today: If server query returns null and the page calls notFound(), the route 404s and overlays won’t mount.
  - Locations to consider relaxing in the future when draftMode is enabled to allow skeleton rendering instead of notFound():
    - apps/web/src/app/blog/[slug]/page.tsx — notFound() when no data
    - apps/web/src/app/[...slug]/page.tsx — notFound() when no data
    - apps/web/src/app/recipes/[slug]/page.tsx — notFound() when no data
  - Follow-up (optional): add a “preview placeholder” when draftMode().isEnabled instead of notFound() so Presentation can render overlays for draft-only docs.

## 7) Releases (optional)

- Create a Content Release in Studio and add changes.
- Open Presentation; verify release changes appear via overlays.
- Note: If you implement client.listen in the future for dashboards, include { includeAllVersions: true } with API 2025-02-19+.

## 8) Negative checks

- Turn off draft mode (if available: apps/web/src/app/api/disable-draft/route.ts) and refresh.
- Expected: Overlays disappear; content shows published only.
- SEO-only fetches should not emit overlays (stega: false only used for metadata generation):
  - apps/web/src/app/blog/page.tsx (generateMetadata path)
  - apps/web/src/app/[...slug]/page.tsx (generateMetadata path)
- Tip: Use the Preview Bar link (top-right) or visit `/api/disable-draft` to exit preview.

## 9) Observability

- Next fetch logging is enabled (apps/web/next.config.ts). Use the browser console / network and server logs during Presentation to correlate fetches.
- If overlays don’t appear:
  - Confirm NEXT_PUBLIC_SANITY_STUDIO_URL matches Studio origin.
  - Confirm SANITY_API_READ_TOKEN is set and valid.
  - Ensure no stega: false on page data fetches (only allowed for metadata/OG).

## 10) Quick verification commands (optional)

Run these before/after the smoke pass to re-validate codebase invariants.

```bash
# Studio typegen + Web typecheck
pnpm --filter studio type
pnpm --filter web format && pnpm --filter web lint:fix && pnpm --filter web typecheck

# (Optional) Builds for extra confidence
pnpm --filter web build
pnpm --filter studio build

# Ensure no path-based draft filters remain in web queries
rg -n "path\('drafts\.\*\*'\)" apps/web/src/lib/sanity || echo "OK: no path-based draft filters"

# Confirm Presentation endpoint is reachable (enables draft mode)
curl -I http://localhost:3000/api/presentation-draft || true
```

## 11) Pass/Fail Criteria

- Pass if: Overlays appear on all listed pages, live updates propagate, and disabling draft mode hides overlays while showing only published content. No “complex perspectives” errors.
- Fail if: Missing overlays on visible text, 404s on draft-only pages we intend to preview, or errors about complex perspectives. See sections 6 and 9 for fixes.
