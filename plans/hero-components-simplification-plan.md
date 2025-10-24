# Hero Components Simplification — Implementation Plan (Agent-Friendly)

This plan breaks the work into clear, copy‑paste prompts designed for an AI coding agent. Each stage is independent and keeps scope tight, prioritizing simplicity and readability over abstraction.

Context quick facts:

- Monorepo: Next.js app at `apps/web`, Sanity Studio at `apps/studio`.
- Use Tailwind v4 and `@workspace/ui` primitives; no `shadcn-ui` dependency.
- Keep code light-only theme; no `dark:` utilities.
- After changes in web: `pnpm --filter web format && pnpm --filter web lint:fix && pnpm --filter web typecheck`.
- File naming: kebab-case; components in `.tsx`, utils in `.ts`.
- A11y: Use `stegaClean(...)` for strings used in logic/alt; keep visible text raw for Sanity Presentation metadata.

Outcome goals:

- Remove over-abstracted `HeroLayout`.
- Inline or split heroes by actual needs with minimal props.
- No variant toggles in shared layouts; page sections own spacing and backgrounds.

---

## Stage 1 — Migrate Recipe Page Hero (overlay) off `HeroLayout`

Prompt for your AI agent (copy-paste):

```
Task: Replace `HeroLayout variant="overlay"` in the recipe page hero with local, explicit overlay markup. Keep behavior identical, but drop abstraction.

Repo context:
- Active file: `apps/web/src/components/page-sections/recipe-page/recipe-hero-section.tsx`
- Remove import of `@/components/layouts/hero-layout`.
- Use `SanityImage`, `Eyebrow`, `Badge`, `cn` as needed. No page-wide `<Section>` wrapper for the overlay hero.

Requirements:
- Full-bleed image container: min-h ~80vh, overflow hidden.
- Dark gradient overlay (top→bottom fade) and bottom-left content stack.
- Render eyebrow, H1 title, and badges exactly like the current overlay variant in `apps/web/src/components/layouts/hero-layout.tsx`.
- Image alt: use existing logic — if no explicit alt, use ``${stegaClean(recipeName)} recipe``.
- Keep tokens/utilities already used in the codebase; do not add dark theme variants or CSS-var utilities.
- Keep visible text raw to preserve Sanity stega; only clean for logic/alt.

Edits:
1) Update `recipe-hero-section.tsx`: inline the markup from `HeroLayout`'s overlay path; remove `HeroLayout` import/usage.
2) Ensure badges render with `@workspace/ui/components/badge`.

Validation:
- Run: `pnpm --filter web format && pnpm --filter web lint:fix && pnpm --filter web typecheck`.
- Ensure there are no remaining `HeroLayout` imports in this file.

Deliverable: a self-contained overlay hero in `recipe-hero-section.tsx` with no `HeroLayout` usage.
```

---

## Stage 2 — Migrate Sauce Page Hero (split/grid) off `HeroLayout`

Prompt for your AI agent (copy-paste):

```
Task: Replace `HeroLayout` in the sauce page hero with local, explicit Section+Grid markup. Keep visuals and behavior, but move background and spacing ownership into the section.

Repo context:
- Active file: `apps/web/src/components/page-sections/sauce-page/sauce-hero-section.tsx`
- Remove import of `@/components/layouts/hero-layout`.
- You may use: `Section`, `Eyebrow`, `SanityImage`, `RichText`, `SanityButtons`, `BackLink`, `cn`.

Requirements:
- Wrap in `<Section spacingTop="page-top" spacingBottom="default" fullBleed>`.
- Apply the previous `backgroundImage` on the Section via `style={{ backgroundImage: "url('...')" }}` and add a subtle overlay div as currently done.
- Container with grid: left column (eyebrow, H1, description, buttons), right column (product jar image). Match the previous sizes/layout.
- Title color: keep existing `hasValidHeroColor ? { color: cleanedColorHex } : undefined` logic on the H1.
- Preserve `prelude` BackLink at the top.
- Keep tokens consistent; no dark theme classes; no CSS-var utility classes.

Edits:
1) Inline grid layout; remove `HeroLayout`.
2) Ensure Sanity alt text and `stegaClean` usage mirrors current logic.

Validation:
- Run: `pnpm --filter web format && pnpm --filter web lint:fix && pnpm --filter web typecheck`.

Deliverable: a self-contained split/grid hero in `sauce-hero-section.tsx` with no `HeroLayout` usage.
```

---

## Stage 3 — Add a General-Purpose Image Hero (shared)

Prompt for your AI agent (copy-paste):

```
Task: Create a minimal, shared image-backed hero section for non-entity pages.

Create:
- File: `apps/web/src/components/page-sections/shared/shared-image-hero-section.tsx`
- Export: `SharedImageHeroSection`

Props (minimal):
- `title: string`
- `subtitle?: string`
- `backgroundSrc: string` (URL or path)
- `overlayTone?: "dark" | "none"` (default: "dark")

Implementation:
- Wrap in `<Section spacingTop="page-top" spacingBottom="default" fullBleed>`, containerized.
- Absolute background with `next/image` or `div` `style={{ backgroundImage: ... }}`; keep it cover+center.
- If `overlayTone === "dark"`, place a dark gradient overlay.
- Foreground stack: Eyebrow is not part of this generic hero; render only title and optional subtitle.
- Keep tokens/utilities; light-only theme.

Validation:
- Add a temporary usage site if needed (commented example) or rely on TypeScript for compile-time checks.
- Run: `pnpm --filter web format && pnpm --filter web lint:fix && pnpm --filter web typecheck`.

Deliverable: new `shared-image-hero-section.tsx` with a tiny prop surface.
```

---

## Stage 4 — Add Product Page Hero (split/grid)

Prompt for your AI agent (copy-paste):

```
Task: Create a minimal product detail hero similar to the sauce split/grid, without domain leakage.

Create:
- File: `apps/web/src/components/page-sections/product-page/product-hero-section.tsx`
- Export: `ProductHeroSection`

Props (minimal):
- `title: string`
- `subtitle?: string`
- `image: { id: string | null; preview: string | null; hotspot: { x: number; y: number } | null; crop: { top: number; right: number; bottom: number; left: number } | null; alt?: string; width?: number; height?: number; } | null`
- `buttons?: Array<SanityButtonProps>` (reuse existing button type)
- `backgroundSrc?: string`

Implementation:
- Wrap in `<Section spacingTop="page-top" spacingBottom="default" fullBleed>`.
- Optional background via `style={{ backgroundImage: ... }}` and subtle overlay.
- Grid layout: left column (title, optional subtitle, optional buttons), right column (image via `SanityImage` if provided).
- Keep tokens; light-only theme; no CSS-var utility classes.

Validation:
- Ensure it compiles by importing and rendering in a placeholder page section (optional) or rely on types.
- Run: `pnpm --filter web format && pnpm --filter web lint:fix && pnpm --filter web typecheck`.

Deliverable: new `product-hero-section.tsx` with a minimal API.
```

---

## Stage 5 — Remove `HeroLayout` and Sweep Usages

Prompt for your AI agent (copy-paste):

```
Task: Delete the old `HeroLayout` and ensure no usages remain.

Steps:
1) Replace any remaining imports/usages of `@/components/layouts/hero-layout` with the new explicit sections or shared section where appropriate.
2) Delete file: `apps/web/src/components/layouts/hero-layout.tsx`.
3) Search and confirm zero references: `rg -n "HeroLayout" apps/web`.

Validation:
- Run: `pnpm --filter web format && pnpm --filter web lint:fix && pnpm --filter web typecheck`.

Deliverable: component removed; all references updated.
```

---

## Stage 6 — QA, A11y, and Polishing

Prompt for your AI agent (copy-paste):

```
Task: Verify visuals, accessibility, and tokens after hero changes.

Checklist:
- Compare screenshots vs designs for sauce, recipe, product, and a general page.
- Alt text: ensure `stegaClean` is only used for alt/logic; visible text remains raw for Presentation overlays.
- No `dark:` variants; no CSS-var utility classes like `text-[var(--color-…)]`.
- Page sections own spacing; backgrounds applied at the section level.
- Keyboard focus order sane; headings semantic; color contrast acceptable.

Validation:
- Run: `pnpm --filter web typecheck`.
- Optional: `pnpm --filter web build` if you need to ensure production CSS is coherent (not required by default).

Deliverable: QA notes or minor tweaks PR.
```

---

## Rollback Plan

- If a stage causes issues, revert that stage’s edits and temporarily restore `HeroLayout` until the specific section is stabilized.
- Keep each stage as a separate PR/commit to simplify reverting.

## Notes

- Prefer inlining markup in page sections (YAGNI). Introduce shared sections only when you identify at least two concrete consumers.
- Keep prop surfaces tiny; avoid `titleClassName`, `titleStyle`, and other style passthroughs in shared code. Localize those in the page section.
