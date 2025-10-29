# Sanity “Bleeding Edge” Upgrade Plan (Perspectives/Releases, API 2025-02-19+)

This plan upgrades our web app and Studio to the latest Sanity releases, aligning all clients, queries, preview flows and scripts with the new Perspectives system (published/drafts/raw/versions) and Content Releases. It focuses on determinism, a single perspective per context, and zero reliance on legacy `drafts.*`/`path('drafts.**')` logic.

## Objectives

- Standardize on `apiVersion: '2025-02-19'` (or newer) for all Sanity clients.
- Adopt a single, explicit perspective per context (published for prod, drafts/preview for Presentation), avoiding “complex perspectives”.
- Ensure Content Releases and `versions.*` behave predictably in preview and Presentation.
- Remove path-based draft checks from all GROQ and utility code; rely on perspectives.
- Keep Live Content API v10 (`defineLive`) and Visual Editing working across environments.

## Outcomes

- Production reads render strictly `published`.
- Presentation/preview surfaces show drafts + release versions via perspective overlays.
- No remaining `path('drafts.**')` or `drafts.*` GROQ filters.
- Scripts and validators pin `apiVersion` and do not mix ID-prefix checks with perspective.

## Version Targets

- `next-sanity`: latest v10.x (Live Content API).
- `sanity` (Studio): latest v4.x.
- `@sanity/client` (web): v7.x compatible with next-sanity v10.
- Plugins: `@sanity/vision`, `@sanity/scheduled-publishing`, `sanity-plugin-media`, `sanity-plugin-mux-input`, etc. pinned to latest compatible.
- API version: `2025-02-19` (minimum) across app + Studio + scripts.

## Guardrails

- One perspective per client context:
  - Web prod/server: `published` + `useCdn: true` (unless tags/ISR set otherwise).
  - Preview/Presentation: drafts/versions via Live bridge; no extra path-based filters.
- Do not use legacy preview APIs (`next-sanity/preview`, `@sanity/preview-kit`).
- Keep secrets in env files. Tokens require Viewer for drafts; Writer only for mutation scripts.

---

## Phase 0 — Prep & Audit

- [ ] Confirm environment variables exist per package:
  - Web: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SANITY_API_VERSION`, `NEXT_PUBLIC_SANITY_STUDIO_URL`, `SANITY_API_READ_TOKEN`.
  - Studio: `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, `SANITY_STUDIO_TITLE`, `SANITY_STUDIO_PRESENTATION_URL` (required in production).
- [ ] Inventory package versions: `pnpm -r ls next-sanity sanity`.
- [ ] Code search and note remaining draft/version tripwires:
  - GREP: `drafts.`, `path('drafts.**')`, `versions.`, `raw`, `perspective:`.
- [ ] Verify Presentation URL and draft-mode endpoints across Studio + Web.
  - Note: Next Image allowlist relies on `NEXT_PUBLIC_SANITY_PROJECT_ID` (apps/web/next.config.ts).

## Phase 1 — Dependencies

- [ ] Bump to latest:
  - `next-sanity@^10` (Live API), `sanity@^3`, all Studio plugins used.
  - Validate peer ranges; record any breaking changes.
- [ ] Install type updates if required (e.g., Sanity types).

## Phase 2 — App (Next.js) Client & Live

- Files: `apps/web/src/lib/sanity/{client.ts,live.ts,token.ts}` and `apps/web/src/config.ts`
- [ ] `createClient` pinned to `apiVersion: '2025-02-19'`, `perspective: 'published'`, `useCdn: process.env.NODE_ENV === 'production'`.
- [ ] `defineLive` remains the single source for `sanityFetch` and `<SanityLive />`.
- [ ] Stega policy: do not gate by env — configure `stega: { studioUrl }` and keep stega on for all DOM‑visible text. Use `stegaClean(...)` for a11y/logic only.
- [ ] If any custom `client.listen` exist (none today), pass `{ includeAllVersions: true }` when previewing Releases.

## Phase 3 — Studio Config & Presentation

- File: `apps/studio/sanity.config.ts`
- [ ] Keep `presentationTool` with `previewUrl` `enable: '/api/presentation-draft'` (or switch to `/api/draft-mode/enable` via `defineEnableDraftMode` from `next-sanity/draft-mode`).
- [ ] Optionally pin Vision’s default API: `visionTool({ defaultApiVersion: '2025-02-19' })`.
- [ ] Confirm plugins on latest versions; ensure no tools depend on legacy preview providers.

## Phase 4 — GROQ Cleanup (repo-wide)

- Files: `apps/web/src/lib/sanity/query.ts` (+ any inline GROQ)
- [ ] Remove all `!(_id in path('drafts.**'))` and `drafts.*` checks.
- [ ] Avoid `raw` unless absolutely required; if used, acknowledge new semantics (raw may include drafts/versions).
- [ ] Regenerate types: `pnpm --filter studio type` and then `pnpm --filter web typecheck`.
- Note: `getRecipeBySlugQuery` previously used a path‑based draft exclusion; removed and relying on `perspective: 'published'` for production.

## Phase 5 — Preview & Visual Editing

- Files: `apps/web/src/app/layout.tsx`, API routes
- [ ] `<SanityLive />` rendered once at the end of the `body` (already present).
- [ ] Use `<VisualEditing />` when `draftMode().isEnabled` (already present).
- [ ] Ensure draft-mode enable route exists and returns 200.

## Phase 6 — Studio Structure, Actions, Helpers

- Files: `apps/studio/structure.ts`, `apps/studio/utils/helper.ts`
- [ ] Eliminate ID-prefix heuristics for “edited” where feasible; prefer read context or Presentation signals.
- [ ] Avoid mixing perspective logic with manual draft/version filters in lists or custom panes.
- [ ] Add/confirm Scheduled Publishing plugin usage if needed for Releases UX.

## Phase 7 — Scripts & Validators

- Files: `apps/studio/mutations/delete-by-type.ts`, `apps/studio/scripts/*`, `apps/studio/utils/{slug.ts,slug-validation.ts}`
- [ ] Pin `apiVersion: '2025-02-19'` for all `getClient`/CLI clients.
- [ ] Replace `path('drafts.**')` with either perspective or, when needed, `_id match 'drafts.*'` (for admin-only, explicit draft ops).
- [ ] Keep uniqueness validators global but perspective-safe (no path-based filters).

## Phase 8 — QA & Validation

- [ ] Local preview flow:
  - Studio → Presentation → open any doc → confirm Release overlay content shows on the site.
  - Toggle draft mode off → site shows only published.
- [ ] Build-time: `pnpm --filter web typecheck && pnpm --filter web build`.
- [ ] Studio: `pnpm --filter studio check && pnpm --filter studio build`.
- [ ] Spot-check queries that formerly depended on `raw` or draft path filters.

## Phase 9 — Observability & Rollout

- [ ] Enable request logging for Sanity fetches in preview to diagnose perspective mismatches.
- [ ] Document new operational behaviors (drafts vs releases) for editors.
- [ ] Create a rollback note: revert `apiVersion`, restore prior queries if required (not expected).

## Acceptance Criteria

- No “Complex perspectives are not supported” errors across app, Studio, or Presentation.
- Presentation shows release/draft overlays via Live API without code-level draft/versions filters.
- All GROQ queries pass typegen and typecheck.
- Studio list views and utilities do not rely on `drafts.*`/`path('drafts.**')`.

## Execution Checklist (commands)

```
# 1) Upgrade deps (review changes locally)
pnpm -r up next-sanity sanity @sanity/vision sanity-plugin-media sanity-plugin-mux-input @sanity/scheduled-publishing

# 2) Typegen + typecheck
pnpm --filter studio type
pnpm --filter web typecheck

# 3) Lint & format
pnpm --filter web format && pnpm --filter web lint:fix
pnpm --filter studio format && pnpm --filter studio lint:fix

# 4) Optional build checks
pnpm --filter web build
pnpm --filter studio build
```

## Notes

- If you later add `client.listen` for custom preview dashboards, include `{includeAllVersions: true}` when using API ≥ 2025‑02‑19 to receive version + draft events.
- Keep `stegaClean` for ARIA/logic and visible text unstripped for Presentation click-to-edit — as we do today.

## See Also

- Detailed audit and validation steps: `plans/sanity-preview-parity-audit.md`
