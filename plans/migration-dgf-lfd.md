# Migration Plan: Split into DGF and LFD (Two Sites, Two Studios)

This plan migrates the current monorepo to host two sites (DGF and LFD), each with its own Next.js web app and its own Sanity Studio, while sharing a single Sanity project and dataset. Work is split into bite‑sized, sequential stages with clear definitions of done and checklists.

## Decisions (Confirmed)

- Two Studios (one per site): `studio-dgf`, `studio-lfd`.
- Two Next.js apps (one per site): `web-dgf`, `web-lfd`.
- Shared Sanity project + dataset across all environments.
- Content scoping via a top‑level `site` document referenced by all site‑scoped docs.
- Cross‑site (global) types with no per‑site variants: `sauce`, `product`, `recipe`.
  - Recipes remain a single document that contains both DGF/LFD variants inside (e.g., ingredients/directions arrays and sauce references per variant). Do not split recipes.
  - All other types are site‑scoped and reference `site`.
- Shared queries/config centralized in a new package: `packages/sanity-config`.
- Keep separate `.env` per app with the same Sanity credentials.
- Presentation URLs via env; initial production URLs:
  - DGF: `https://dgf-25.vercel.app`
  - LFD: `https://lfd-25.vercel.app`
- Local dev (HTTP only):
  - DGF: Web `http://localhost:3000`, Studio `http://localhost:3333`
  - LFD: Web `http://localhost:3001`, Studio `http://localhost:3334`

## Target Layout

```
/apps
  /web-dgf
  /studio-dgf
  /web-lfd
  /studio-lfd
/packages
  /sanity-schema
  /sanity-config
  /ui
  /eslint-config
  /typescript-config
```

## Operating Notes (for agents)

- After any code changes in a workspace: `pnpm --filter <workspace> format && pnpm --filter <workspace> lint:fix && pnpm --filter <workspace> typecheck`.
- Prefer `pnpm --filter <workspace> ...` over `-C` for portability.
- Do not run builds unless asked. Do not commit; leave Git actions to human.
- Keep Tailwind v4 token rules and a11y announcer patterns intact.

---

## Stage 0 — Remove Blog Types, Routes, and Data

Goal: Eliminate legacy blog feature so it doesn’t affect scoping or queries.

Tasks

- [ ] Studio schemas: remove `blog`, `blog-index`, and `author` documents. Update `schemaTypes/documents/index.ts` exports.
- [ ] Studio structure: remove blog desk items.
- [ ] Studio presentation locations: remove blog resolvers.
- [ ] Web: remove `/blog` routes and components.
- [ ] Web: remove blog queries and fragments from `packages/sanity-config/query.ts` once moved.
- [ ] Data: mutation to delete `blog` and `author` documents.

Definition of Done

- [ ] Studio compiles without blog types
- [ ] Web compiles with no blog imports/routes
- [ ] No `blog`/`author` documents remain in dataset

---

## Stage 1 — Prepare Shared Packages (sanity-config, sanity-schema)

Goal: Centralize Sanity client, live config, and queries; establish a shared schema source of truth.

Tasks

- [ ] Create `packages/sanity-config` with minimal exports:
  - [ ] `client.ts` (wraps `@sanity/client` with env parsing)
  - [ ] `live.ts` (exports `defineLive` wiring for Next 15, no legacy preview APIs)
  - [ ] `query.ts` (move existing queries from `apps/web/src/lib/sanity/query.ts`)
  - [ ] `index.ts` exporting public API
  - [ ] Types: export generated types or a clear interface for query results
- [ ] Create `packages/sanity-schema`:
  - [ ] Export all current schemas from `apps/studio/schemaTypes` as a single array
  - [ ] Add a `site` document type (with stable IDs `site-DGF`, `site-LFD`)
  - [ ] Add a required `site` reference ONLY to site‑scoped types (NOT to `sauce`, `product`, or `recipe`)

Wiring

- [ ] Update `apps/studio` (temporarily still named) to import schema array from `packages/sanity-schema`
- [ ] Update `apps/web` to import from `packages/sanity-config` (`client`, `live`, `query`)

Definition of Done

- [ ] Studio typegen passes: `pnpm --filter studio type`
- [ ] Web typecheck passes: `pnpm --filter web typecheck`
- [ ] App behavior unchanged

Notes

- Keep generated types tight. Avoid expanding images in GROQ unless asked.

---

## Stage 2 — Rename Current Apps to DGF

Goal: Make the existing apps become the DGF pair without functional change.

Tasks

- [ ] Move `apps/web` → `apps/web-dgf`
- [ ] Move `apps/studio` → `apps/studio-dgf`
- [ ] Update root `package.json` lint-staged globs from specific `apps/web|studio` to cover new names (e.g., `apps/*/**/*` or explicit `web-dgf`, `studio-dgf`)
- [ ] Update any hard-coded paths in docs/scripts
- [ ] Ensure Next and Studio ports remain 3000/3333 for DGF

Definition of Done

- [ ] `pnpm --filter web-dgf typecheck` OK
- [ ] `pnpm --filter studio-dgf type` OK
- [ ] Local dev runs: `pnpm --filter web-dgf dev`, `pnpm --filter studio-dgf dev`

---

## Stage 3 — Scaffold LFD Apps

Goal: Add `web-lfd` and `studio-lfd` by cloning the DGF pair, adjusting names/ports.

Tasks: `web-lfd`

- [ ] Copy `apps/web-dgf` → `apps/web-lfd`
- [ ] Update app name/metadata
- [ ] Set dev port to `3001` (e.g., `next dev --port 3001` or via env)
- [ ] Add `.env.local` for LFD (same Sanity credentials)
- [ ] Wire to `packages/sanity-config` (same as DGF)
- [ ] Add `SITE_ID`/`SITE_SLUG` env to identify LFD in queries

Tasks: `studio-lfd`

- [ ] Copy `apps/studio-dgf` → `apps/studio-lfd`
- [ ] Update Studio name/title
- [ ] Set dev port to `3334`
- [ ] Add `.env` for LFD (same Sanity credentials)
- [ ] Import schemas from `packages/sanity-schema`
- [ ] Adjust desk/structure to filter to LFD documents (by `site` reference)
- [ ] Configure Presentation plugin to target LFD:
  - [ ] Local: `http://localhost:3001`
  - [ ] Prod: `https://lfd-25.vercel.app` (via env)

Definition of Done

- [ ] LFD Studio typegen OK: `pnpm --filter studio-lfd type`
- [ ] LFD Web typecheck OK: `pnpm --filter web-lfd typecheck`
- [ ] Both LFD dev servers run on 3001/3334

---

## Stage 4 — Implement Site Scoping in Queries

Goal: Ensure both web apps resolve site‑specific content consistently while keeping cross‑site types global.

Tasks

- [ ] In `packages/sanity-config/query.ts`, update shared queries to accept `$siteId` (or `$siteRef`) for site‑scoped types
- [ ] Do NOT add `site` filtering to cross‑site types (`sauce`, `product`, `recipe`)
- [ ] For LFD:
  - [ ] Sauces: filter lists to `line == "Ultra-Premium"`
  - [ ] Recipes: filter lists to `versions` contains `"LFD"` and render only LFD variant content
  - [ ] Products: leave global unless a business rule is added later; no per‑site variant
- [ ] Export helpers to resolve `siteId` from env (`SITE_CODE` → stable site doc ID)
- [ ] Update both apps to pass site param for site‑scoped queries

Definition of Done

- [ ] DGF app resolves DGF site‑scoped docs; LFD app resolves LFD site‑scoped docs
- [ ] Cross‑site types remain global; LFD lists reflect allowed subset (Ultra‑Premium sauces, LFD recipe variants)
- [ ] No cross‑site content leakage for site‑scoped types

Notes

- Keep visible content stega metadata intact; use `stegaClean` only for aria/logic.

---

## Stage 5 — Site‑Specific Studio Structure

Goal: Tailor each Studio’s desk/structure to its site’s scope.

Tasks

- [ ] `apps/studio-dgf`: desk shows DGF site‑scoped docs; cross‑site types appear globally
- [ ] `apps/studio-lfd`: desk shows LFD site‑scoped docs; cross‑site types appear globally
- [ ] Ensure Create actions and list panes default to correct `site` for new docs (site‑scoped only)
- [ ] Singletons use per‑site document IDs (e.g., `navbar-DGF`, `navbar-LFD`) and are wired per Studio

Definition of Done

- [ ] Editors see correct types per Studio
- [ ] New documents get correct `site` reference (via initialValue or intent action)

---

## Stage 6 — Shared UI Extraction (Progressive)

Goal: Move shared UI from DGF web into `packages/ui` incrementally.

Tasks

- [ ] Identify cross‑site components (elements, layouts, helpers)
- [ ] Move to `packages/ui/src/components` or `src/lib` as appropriate
- [ ] Update imports in both apps
- [ ] Keep Tailwind v4 token utilities and shadcn patterns consistent

Definition of Done

- [ ] Both apps compile and render with shared UI
- [ ] No dark‑mode utilities added; keep app light‑only

---

## Stage 7 — Tooling & Housekeeping

Goal: Align repo scripts and checks with the new app names.

Tasks

- [ ] Update root `lint-staged` to include `apps/*/**/*.{js,jsx,ts,tsx}`
- [ ] Ensure `pnpm-workspace.yaml` keeps `apps/*` and `packages/*`
- [ ] Turbo `outputs` cover both Next and Studio caches
- [ ] Add README notes for new app names and dev commands

Definition of Done

- [ ] `pnpm lint` and `pnpm check-types` pass at root

---

## Stage 8 — Vercel Setup (Deploy Readiness)

Goal: Prepare deployments for both sites and Studios.

Tasks

- [ ] Create Vercel projects: `web-dgf`, `studio-dgf`, `web-lfd`, `studio-lfd`
- [ ] Configure envs for each project (shared Sanity credentials; site IDs; presentation URLs)
- [ ] Set Preview/Prod URLs to `dgf-25.vercel.app` and `lfd-25.vercel.app` (env‑driven)
- [ ] Smoke deploys and validate Presentation links

Definition of Done

- [ ] Presentation opens the correct frontend per Studio
- [ ] Live queries and click‑to‑edit work per site without HTTPS locally

---

## Rollback Strategy

- Revert to the DGF‑only state by using the DGF pair and removing LFD apps from Turbo/pnpm scopes.
- Keep `packages/sanity-config` and `packages/sanity-schema` in place (they’re an improvement even for single‑site).

---

## Quick Command Reference

- Web DGF: `pnpm --filter web-dgf dev|build|start|lint:fix|typecheck`
- Studio DGF: `pnpm --filter studio-dgf dev|build|deploy|lint:fix|type|check`
- Web LFD: `pnpm --filter web-lfd dev|build|start|lint:fix|typecheck`
- Studio LFD: `pnpm --filter studio-lfd dev|build|deploy|lint:fix|type|check`
- Root: `pnpm dev|build|lint|check-types`

---

## Open Questions (track here if new ones arise)

- Do we want a tiny `packages/web-shared` for SEO/a11y/hooks, or keep those per‑app until duplication appears?
- Backfill scope: proceed to set `site` references on site‑scoped docs only (exclude `sauce`, `product`, `recipe`).
