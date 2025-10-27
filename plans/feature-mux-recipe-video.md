# Mux Recipe Video — Implementation Plan

This document tracks the plan and scope to add signed Mux video playback for the `recipe` document type in the Next.js app (apps/web). It reflects decisions, caveats, and the implementation surface so far.

## Overview

- Render a video player on a recipe page only if the recipe has a Mux video.
- Generate short‑lived signed tokens server‑side using the Mux signing key stored in Sanity (via the Sanity Mux plugin).
- Pass the playback ID and signed token(s) to `@mux/mux-player-react` in a client component.

## Data Shape (Sanity)

- Recipe projection already includes video fields via GROQ:
  - `video.playbackId`, `video.policy`, `video.posterImage`, `video.thumbTime`.
- Prefer the signed playback ID when signed URLs are enabled. Current query provides `video.policy` derived from `data.playback_ids[0].policy`.

## Server Token Signing

- Reuse `apps/web/src/lib/mux/signing.ts` which:
  - Reads `secrets.mux` from Sanity via `getMuxSigningKeysQuery`.
  - Uses `jose` to sign JWTs with `RS256` and `kid` header.
  - Supports `aud` of `video` and `thumbnail`.
- Implementation note: ensure the Sanity client fetching `secrets.mux` uses the server token (read access) — otherwise the fetch will fail. If missing, switch to `client.withConfig({ token })`.

## API Route

- Path: `apps/web/src/app/api/mux/sign-playback/route.ts`
- Inputs: `playbackId` (required), optional `ttl`.
- Output: `{ video: string, thumbnail: string }` (signed tokens).
- Headers: `Cache-Control: no-store` and dynamic Node runtime (avoid Edge).
- Errors: 400 for missing params, 500 for signing failures.

## Client Player

- Path: `apps/web/src/components/page-sections/recipe-page/recipe-video/recipe-video-client.tsx`
- Props: `playbackId`, `isSigned`, optional `posterUrl`, `metaTitle`, `ariaLabel`.
- Behavior:
  - If `isSigned`: fetch `/api/mux/sign-playback?playbackId=...` and pass `token` and `thumbnailToken` to Mux Player.
  - If public: render with `playbackId` only.
  - Wrap in a responsive 16:9 container; minimal loading UI while fetching token.
  - Provide basic `metadata={{ video_title: metaTitle }}`.

## Page Section

- Path: `apps/web/src/components/page-sections/recipe-page/recipe-video-section.tsx`
- Responsibilities:
  - Own page spacing via `<Section>` and container width.
  - Guard render: if no `recipe.video?.playbackId`, return `null`.
  - Compute `isSigned` from `recipe.video.policy === "signed"`.
  - Build `posterUrl` from Sanity `posterImage` (optional), or rely on Mux `thumbnailToken` for previews.
  - Render the client player.

## Integration

- Update `apps/web/src/app/recipes/[slug]/page.tsx` to mount `<RecipeVideoSection recipe={recipe} />` after `<RecipeHeroSection />` and before `<RecipeDetailsSection />`.

## Accessibility

- Keep semantic structure with `<Section>`.
- Provide a concise `aria-label` like `Watch recipe video: {cleanTitle}`.
- Do not use the global live announcer for passive media rendering.

## Security

- Never expose signing keys to the client.
- Short TTL for tokens (default ~10 minutes) served via API route.
- Set `no-store` on the route and avoid token generation during static rendering.
- Use Node runtime (not Edge) for `jose`/crypto.

## Styling

- Tailwind v4 utilities only; no dark variants.
- Light theme only.
- Maintain a stable aspect ratio container to prevent CLS.

## Gotchas & Pitfalls

- Private doc access: Fetching `secrets.mux` requires read token; use authenticated client.
- Playback ID selection: If multiple playback IDs exist, ensure signed playback is used alongside `policy === "signed"`.
- Token staleness: Don’t render tokens into static HTML; fetch at runtime.
- Thumbnail previews: Signed playback requires `thumbnailToken` for hover/seek previews; supported via API.
- PEM handling: Plugin may store base64‑encoded PEM; normalize and convert PKCS1→PKCS8 as needed (handled in `signing.ts`).
- Live/Presentation: Preserve stega metadata on visible text; use `stegaClean` only for aria/logic.

## Files to Add/Change

- Add: `apps/web/src/app/api/mux/sign-playback/route.ts`
- Add: `apps/web/src/components/page-sections/recipe-page/recipe-video/recipe-video-client.tsx`
- Add: `apps/web/src/components/page-sections/recipe-page/recipe-video-section.tsx`
- Update: `apps/web/src/app/recipes/[slug]/page.tsx` (mount the section)
- Potential Update: `apps/web/src/lib/mux/signing.ts` to ensure authenticated fetch of `secrets.mux`.

## Validation Checklist

- [ ] `.env.local` has `SANITY_API_READ_TOKEN` (web): confirmed.
- [ ] `/api/mux/sign-playback?playbackId=…` returns tokens; response is not cached.
- [ ] Recipe without video doesn’t render the section.
- [ ] Recipe with signed video plays correctly; poster and preview thumbnails work.
- [ ] Draft Mode / Presentation still works; visible text preserves stega metadata.
- [ ] `pnpm --filter web format && pnpm --filter web lint:fix && pnpm --filter web typecheck` pass.
