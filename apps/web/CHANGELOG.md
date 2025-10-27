# web

## 1.19.0

### Minor Changes

- [#106](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/106) [`6b6d192`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/6b6d192d3e5e790364069e2feab31d05d823400a) Thanks [@ovsw](https://github.com/ovsw)! - Add Mux video support for recipes with filtering capabilities
  - Integrate Mux Player for recipe video playback
  - Add video field to recipe schema with poster image support
  - Implement recipe video filtering in catalog view
  - Create API route for Mux playback token signing
  - Add Mux input plugin to Sanity studio configuration
  - Update recipe queries to include video data
  - Enhance RecipesClient with hasVideo filter option

  🤖 Generated with [Claude Code](https://claude.com/claude-code)

  Co-Authored-By: Claude <noreply@anthropic.com>

### Patch Changes

- Updated dependencies []:
  - @workspace/ui@1.19.0

## 1.18.2

### Patch Changes

- [#104](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/104) [`665e603`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/665e60384c8db224cd5a3ea41febe4b0141a137a) Thanks [@ovsw](https://github.com/ovsw)! - Hero components simplification (Stage 1–2): migrate Recipe Hero (overlay) and Sauce Hero (split/grid) off the shared HeroLayout. Inline explicit markup per page section to keep behavior and visuals identical: Recipe uses a full-bleed image with gradient overlay and bottom-left content stack (Eyebrow, H1, badges) and maintains alt fallback to `${stegaClean(recipeName)} recipe`. Sauce uses Section + grid with the previous background image and subtle overlay, preserves BackLink prelude, Eyebrow, title color override when a valid colorHex is provided, description (RichText), buttons, and product jar image with alt fallback. No user-visible changes expected; removes unnecessary abstraction from these sections.

- [#104](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/104) [`665e603`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/665e60384c8db224cd5a3ea41febe4b0141a137a) Thanks [@ovsw](https://github.com/ovsw)! - Hero components simplification (Stage 3): add a minimal shared image-backed hero section `SharedImageHeroSection` for non-entity pages. Uses `Section` with `spacingTop="page-top"`, `spacingBottom="default"`, and `fullBleed`, applies a background via `backgroundSrc`, supports optional `overlayTone` (default "dark") for a dark gradient overlay, and renders only a title and optional subtitle (no eyebrow). Light-only tokens, no CSS-var utilities.

- [#104](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/104) [`665e603`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/665e60384c8db224cd5a3ea41febe4b0141a137a) Thanks [@ovsw](https://github.com/ovsw)! - Hero components simplification (Stage 4): update Product Hero to match the image‑only design. Center a single product jar image over the shared “counter‑wall” background with a subtle overlay; remove split/grid expectations and avoid in‑hero text/CTAs. Improve alt fallback to `image.alt || stegaClean(product.name) || "Product image"`. Visual behavior remains the same; this removes unnecessary abstraction and aligns the hero with the provided design.

- [#104](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/104) [`665e603`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/665e60384c8db224cd5a3ea41febe4b0141a137a) Thanks [@ovsw](https://github.com/ovsw)! - Hero components simplification (Stage 5): remove the shared `HeroLayout` and sweep all usages. Recipe, Sauce, and Product heroes now use explicit, local section markup (overlay, split/grid, and image-only respectively) with backgrounds owned by the sections. No functional/UI changes intended; this eliminates an unnecessary abstraction and clarifies ownership.

- [#104](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/104) [`65256b0`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/65256b0d1729b7f1444103844181fa61dad50135) Thanks [@ovsw](https://github.com/ovsw)! - Restore hover reveal and polish layouts across web UI:
  - Reinstate hover-based content reveal in `ThreeProductPanelsBlock` with coordinated lift and CSS-only grid expand + opacity fade.
  - Refine `FeatureCardGridLayout` columns and card spacing; adjust `ThreeProductPanelsBlock` padding and text sizes for responsiveness.
  - Update Sauce hero and home slideshow to use the taller background image variant for visual consistency.
  - Improve footer spacing, alignment, and social links responsiveness.
  - Tweak `Button` styles in `@workspace/ui` for clearer hierarchy and consistency.

  Commits: 0e1fb51, cbed15f, d1d6da6, 846bf73.

- [#104](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/104) [`de2141e`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/de2141eee274c34fcd0e639ed2ae1015b8f6d9e7) Thanks [@ovsw](https://github.com/ovsw)! - Refine sauce hero content flow with tighter spacing, conditional text shadow, and explicit CTA variant control for a cleaner presentation.
  Tweak sauce nutritional info spacing and related product layouts to reinforce brand hierarchy and legibility.
  Align shared UI components by removing Eyebrow's built-in margin and giving secondary buttons a branded border treatment.

  Commits: 6ac228e, e64d244.

- Updated dependencies [[`65256b0`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/65256b0d1729b7f1444103844181fa61dad50135), [`de2141e`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/de2141eee274c34fcd0e639ed2ae1015b8f6d9e7)]:
  - @workspace/ui@1.18.2

## 1.18.1

### Patch Changes

- [`423f2f8`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/423f2f8183dfe8b50678b15b480ebe7aa931ff76) Thanks [@ovsw](https://github.com/ovsw)! - Polish mobile navigation and feature surfaces: add a Cookbook icon to the header’s Recipes button with responsive tweaks, refine NavLink and SearchField focus styles, tighten SurfaceShine overlay radius handling, and smooth HomeSlideshowBlock spacing for better small-screen layout. Also expose the dev server on all interfaces for device testing.

- Updated dependencies []:
  - @workspace/ui@1.18.1

## 1.18.0

### Minor Changes

- [#100](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/100) [`1e0d58e`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/1e0d58e3346edb407593b74b4c1dd497a7421d00) Thanks [@ovsw](https://github.com/ovsw)! - Introduce the new PageHeading flow for sauces and store pages, including schema support, visual refinements, and click-to-edit improvements.
  Add the new page heading for the history page as well As the /sauce and /store index pages.

### Patch Changes

- Updated dependencies []:
  - @workspace/ui@1.18.0

## 1.17.0

### Minor Changes

- [#98](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/98) [`4cedd30`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/4cedd30fe391cf5757087d32f423d24f72d6dcb5) Thanks [@ovsw](https://github.com/ovsw)! - - add redesigned home slideshow block wired to the updated homePageBuilder schema
  - extend shared Section layout with a fullBleed option and align hero sections around it
  - improve homepage slideshow client with click-to-edit support and consistent transitions
    Commits:
  - feat(studio): rename pageBuilder to homePageBuilder and update schema
  - feat(ui): add click-to-edit support for home slideshow
  - refactor(ui): make transition durations consistent in home slideshow
  - feat(ui): add fullBleed prop to Section for full-width layouts
  - refactor(ui): move max-width and centering from PageBuilder to Section component
  - feat(web): add homeSlideshow block for dynamic homepage slides
  - feat(web): reverted homepage slidesow to a version of the old layout, with improved design.
  - refactor(web): Restructured the HomeSlideshowSection component to use a two-row layout on desktop for better visual separation of text and images.

### Patch Changes

- Updated dependencies [[`4cedd30`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/4cedd30fe391cf5757087d32f423d24f72d6dcb5)]:
  - @workspace/ui@1.17.0

## 1.16.1

### Patch Changes

- [#96](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/96) [`7d96140`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/7d961400e4073f25617c434c0b2e7e1c38d92285) Thanks [@ovsw](https://github.com/ovsw)! - Refactor product panels and cards with improved styling and animations
  - Simplify ThreeProductPanelsBlock by removing framer motion and making it a RSC
  - Extract ProductPanelCard component with improved layout and animation
  - Introduce dynamic gradient overlay with CSS variable support
  - Consolidate className definitions for better readability
  - Update Sanity schema for three-product-panels block
  - Add SurfaceShineOverlay component with enhanced styling

- Updated dependencies [[`7d96140`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/7d961400e4073f25617c434c0b2e7e1c38d92285)]:
  - @workspace/ui@1.16.1

## 1.16.0

### Minor Changes

- [#94](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/94) [`0d05015`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/0d05015b4216b7d0a582377325d1a1312c439645) Thanks [@ovsw](https://github.com/ovsw)! - Implement new Feature Section design with enhanced image handling
  - Add click-to-edit functionality for feature block images
  - Implement imageFit option for controlling image scaling (cover/crop modes)
  - Fix section padding and z-index for background gradient
  - Resolve LQIP overflow issues for proper image display
  - Update schema to support new image presentation options

### Patch Changes

- Updated dependencies []:
  - @workspace/ui@1.16.0

## 1.15.0

### Minor Changes

- [`facf5bc`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/facf5bc0df85a5d263ee4fb9ef6f946fd3f711e6) Thanks [@ovsw](https://github.com/ovsw)! - Implement contact page with enhanced form handling and dynamic pattern system
  - Add contact page with improved semantic structure (h1 heading) and simplified SEO title generation
  - Implement contact form with enhanced email validation regex and FormSpark integration using environment variables
  - Create PatternFactory system for dynamic and lazy-loaded SVG patterns with improved performance (75 to 90)
  - Add autumn, grid, and Italian ingredients patterns with unique ID generation
  - Enhance SimpleHeroLayout with additional props for improved image handling
  - Update DecoratedSplitLayout with improved aspect ratio and width syntax consistency
  - Add contact page slug mapping and validation rules to studio utilities
  - Improve form submission validation to ensure FormSpark URL is configured

### Patch Changes

- Updated dependencies []:
  - @workspace/ui@1.15.0

## 1.14.0

### Minor Changes

- [#89](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/89) [`c94d65f`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/c94d65fb9063d0e1aefe80cb41bb5b1af57aac7f) Thanks [@ovsw](https://github.com/ovsw)! - Add "Where to Buy" store locator page
  - New `/where-to-buy` route with smart state selector and product line filters
  - Comprehensive store location data across 40+ states for all product lines:
    - Original DelGrosso sauces
    - Organic DelGrosso sauces
    - La Famiglia DelGrosso premium line
    - Specialty products (Sloppy Joe, Salsa & Meatballs)
  - Store cards display multiple product line availability with color-coded badges
  - Location-specific notes for stores with regional restrictions (e.g., "State College only", "Altoona only")
  - De-duplicated store listings show all product lines carried at each location
  - Responsive design with mobile-optimized filters and card layouts

### Patch Changes

- [#89](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/89) [`594d7a0`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/594d7a004a214de4acd45dc0bc082a4e36f689b3) Thanks [@ovsw](https://github.com/ovsw)! - - Add Store Locator singleton config for the Where to Buy page and enforce canonical slugs for history and store locator routes.
  - Connect to front-end web app.
- Updated dependencies []:
  - @workspace/ui@1.14.0

## 1.13.0

### Minor Changes

- [`c695bb3`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/c695bb395e5e1b3cb743c14fe0cca2a1a5321819) Thanks [@ovsw](https://github.com/ovsw)! - Add history page with interactive timeline
  - Introduce history document schema with timeline markers and timeline object definitions
  - Add history page with scroll-driven timeline featuring headings, subtitles, rich text, and images
  - Create reusable Timeline section and TimelineLayout components with smooth animations
  - Update Sanity structure to include history page and timeline content management
  - Add animation runtime support for timeline interactions
  - Minor refactor to recipe hero initialization

### Patch Changes

- Updated dependencies []:
  - @workspace/ui@1.13.0

## 1.12.1

### Patch Changes

- [#85](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/85) [`0a6ee61`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/0a6ee61bf062ba3b9c2e0f79d55cf7fef6ac15b5) Thanks [@ovsw](https://github.com/ovsw)! - Refactor component architecture to align with Page Sections, Elements, and Features.
  - Move non-Section composites to `features/*` and presentational UI to `elements/*`
  - Rename and relocate page sections to `<page>-<section>-section.tsx` under `page-sections/*`
  - Replace mixed `RelatedItemsLayout` with domain layouts:
    - `related-products-layout`, `single-related-product-layout`
    - `related-sauces-layout`, `single-related-sauce-layout`
    - keep `related-recipes-layout`
  - Add thin index wrappers that own `<Section>` and compose catalog clients:
    - `sauces-index-page/sauces-catalog-section`
    - `products-index-page/products-catalog-section`
    - `recipes-index-page/recipes-catalog-section`
  - Move `product-purchase-panel` to `features/cart/`
  - Promote `nutrition-facts-panel` and cards to `elements/`
  - Update imports across app pages and sections

  Docs: clarify organization + naming and shared/section-internals guidance in `AGENTS.md`.

- Updated dependencies []:
  - @workspace/ui@1.12.1

## 1.12.0

### Minor Changes

- [#76](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/76) [`343f2cc`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/343f2cc682b0840da123b8a133fc33a4e0d1f3ca) Thanks [@ovsw](https://github.com/ovsw)! - Added individual recipe page.
  Some fixes to the way filtering works via category as well.

### Patch Changes

- Updated dependencies [[`343f2cc`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/343f2cc682b0840da123b8a133fc33a4e0d1f3ca)]:
  - @workspace/ui@1.12.0

## 1.11.2

### Patch Changes

- [#74](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/74) [`c8d602c`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/c8d602ce3eedebb81446f1affee040e417337910) Thanks [@ovsw](https://github.com/ovsw)! - Open Foxy Sidecart from the header Cart button; document env and loader script
  - Include FoxyCart loader (`loader.js`) in the root layout with `beforeInteractive` so forms/links are intercepted and the Sidecart opens without navigation.
  - Use `NEXT_PUBLIC_FOXY_DOMAIN` with `resolveFoxyConfig` to build the cart URL.
  - Update header `CartButton` to link to `https://<store>.foxycart.com/cart?cart=view` so the loader opens Sidecart; fall back to full cart navigation if the loader isn't available.
  - Add a FoxyCart form on product pages that opens the Sidecart when a product is added.
  - Note: HMAC/webhooks are not included in this MVP; the quantity badge updates via Foxy loader (`data-fc-id`).

- [#74](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/74) [`7ad1630`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/7ad1630357a5c6465b1d99ce427c9178697b1f0a) Thanks [@ovsw](https://github.com/ovsw)! - Guard Next.js App Router announcer from third‑party DOM reparenting and add development‑only DOM mutation tolerance to stabilize FoxyCart Sidecart interactions.
  - Add `AnnouncerGuard` to keep `<next-route-announcer>` anchored under `<body>` so Next’s cleanup doesn’t throw when overlays move nodes.
  - Add `DevDomRemoveTolerance` (development only) to make `insertBefore`, `replaceChild`, and `removeChild` tolerant when reference/child nodes have been reparented by the Sidecart.
  - Mount both in root layout after `<SanityLive />`, before the Foxy provider.
  - Add `A11yLiveAnnouncer` and standardize active announcements via `document.dispatchEvent(new CustomEvent("a11y:announce", { detail: { message, politeness } }))`. Refactor `FoxycartProvider` to use the global announcer (remove local sr-only live region).
  - Add `announce(message, politeness?)` helper in `apps/web/src/lib/a11y/announce.ts` so developers import a single function instead of hand-crafting `CustomEvent`s.

  Notes
  - Production behavior is unchanged; the tolerance runs only in `NODE_ENV=development`.
  - This eliminates NotFoundError noise (removeChild/insertBefore) seen when changing Sidecart quantity, focusing country select, or tabbing away while the Sidecart is open.

- Updated dependencies []:
  - @workspace/ui@1.11.2

## 1.11.1

### Patch Changes

- [`c46bab1`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/c46bab15a3f2b50f59a070a57e2231cd7476a1b0) Thanks [@ovsw](https://github.com/ovsw)! - Await Next.js async route params in blog and recipe detail pages.

- Updated dependencies []:
  - @workspace/ui@1.11.1

## 1.11.0

### Minor Changes

- [#70](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/70) [`5c8954f`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/5c8954fb87f4fbf716840f9e6b689b06dd2fbadd) Thanks [@ovsw](https://github.com/ovsw)! - Add product detail page and minimal product hero.
  - Introduce `ProductHero` to mirror sauce hero background but render only the centered product image (no text/buttons).
  - Add `/store/[slug]` product detail page using new GROQ `getProductBySlugQuery` and display structured product facts (SKU, pack size, price, weight, shipping).
  - aligne section components naming conventions, eg: renamed `SaucesRelatedRecipes` section to `RelatedRecipesSection`.
  - Show associated sauces on product pages using existing `RelatedSaucesSection`.
  - Show associated recipes on product pages using existing section `RelatedRecipesSection`.
  - Update SEO for product detail pages to use a supported OpenGraph type ("article") to avoid runtime error.

### Patch Changes

- Updated dependencies []:
  - @workspace/ui@1.11.0

## 1.10.0

### Minor Changes

- [#68](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/68) [`83a45a5`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/83a45a553842efad2b912ba81408f6ced8ca1c8c) Thanks [@ovsw](https://github.com/ovsw)! - Rename the page builder Hero block to Feature across Studio and the web app, and add a migration script to update existing content.

### Patch Changes

- [#68](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/68) [`c8b14cb`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/c8b14cb36269521e6535d7b1356d00ba31d5e68a) Thanks [@ovsw](https://github.com/ovsw)! - Add Sauce page components and UI tweaks
  - Add Sauce Hero, Nutrition, Related Products, and Related Recipes components
  - Wire new components into Sauce pages and refine rich text rendering
  - Tweak shared UI (Button, Eyebrow) and global styles for consistency

- Updated dependencies [[`c8b14cb`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/c8b14cb36269521e6535d7b1356d00ba31d5e68a)]:
  - @workspace/ui@1.10.0

## 1.9.1

### Patch Changes

- [#65](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/65) [`6a4fe3f`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/6a4fe3f2e5c6dd614c7defa3a60818320ed16cb9) Thanks [@ovsw](https://github.com/ovsw)! - Restore Sanity Presentation click-to-edit for product listings, recipe cards, and the Studio price editor.

- Updated dependencies []:
  - @workspace/ui@1.9.1

## 1.9.0

### Minor Changes

- [#64](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/64) [`0f34bce`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/0f34bcee608c336aa0148b1c0b42780826a6cf3e) Thanks [@ovsw](https://github.com/ovsw)! - Introduce shared section spacing controls across Studio schemas, UI, and web sections.

### Patch Changes

- Updated dependencies [[`0f34bce`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/0f34bcee608c336aa0148b1c0b42780826a6cf3e)]:
  - @workspace/ui@1.9.0

## 1.8.0

### Minor Changes

- [#61](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/61) [`a201d5c`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/a201d5ce0a3e157addb27c43faad3ee70a7d2e68) Thanks [@ovsw](https://github.com/ovsw)! - Add SSR + client-filterable Recipes index at `/recipes` with filters for Product Line, Recipe Tags, Meat, Category, and search; include `/recipes/[slug]` stub. Reuse shared FilterableListLayout and ListCard, and add recipe queries + types.

- [#61](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/61) [`b24cd5f`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/b24cd5f03ba6278533a27327b80ef01bcd1bb74b) Thanks [@ovsw](https://github.com/ovsw)! - Add SSR + client-filterable Store index at `/store` and refactor shared UI for filterable lists.
  - Implement `/store` with SSR data fetch and client-side filtering for products
  - Add product queries (`getProductIndexPageQuery`, `getAllProductsForIndexQuery`)
  - Extract `FilterableListLayout` (shared layout for filters/results/sort) and `ListCard` (shared grid card)
  - Update Sauces index to reuse shared layout and card
  - Scaffold `/store/[slug]` placeholder page
  - UI: export `BadgeVariant` type inferred from `badgeVariants` CVA for safer consumers

  Notes:
  - Product filters include Search, Packaging (Case/Gift/Other), Product Line, and Sauce Type (including Mix)
  - Merchandise shows no badges; Mix only matches products with multiple sauce types

### Patch Changes

- Updated dependencies [[`b24cd5f`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/b24cd5f03ba6278533a27327b80ef01bcd1bb74b)]:
  - @workspace/ui@1.8.0

## 1.7.0

### Patch Changes

- [#59](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/59) [`6a8fbfa`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/6a8fbfac5c54752792a9e8072bc1cdd037c1e8dd) Thanks [@ovsw](https://github.com/ovsw)! - Include `sauce` documents in the sitemap alongside pages, blogs, products, and recipes.

- [#59](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/59) [`d32e957`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/d32e957965eb1a42d17900cb96ba8c54f71ad2e6) Thanks [@ovsw](https://github.com/ovsw)! - Add slug fields to Product and Recipe schemas and add a slug backfill script for the development dataset.
  - Add `slug` field to `productType` and `recipeType` documents in Studio
  - Implement `apps/studio/scripts/backfill-slugs.ts` to populate slugs for all Product and Recipe documents in the dev dataset
  - Regenerate Sanity types consumed by Web (`sanity.types.ts`)

- [#59](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/59) [`6a8fbfa`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/6a8fbfac5c54752792a9e8072bc1cdd037c1e8dd) Thanks [@ovsw](https://github.com/ovsw)! - Improve OG data for products and recipes and extend sitemap coverage.
  - Add fallbacks in OG projections: use `name` when `ogTitle/seoTitle/title` are missing; prefer `pt::text(description)` for product/recipe, fallback to `name`.
  - Prefer `mainImage` (and its dominant color) before `image` to avoid null OG images.
  - Add `product` and `recipe` pages to the sitemap query and generation.

- Updated dependencies []:
  - @workspace/ui@1.7.0

## 1.6.0

### Minor Changes

- [#57](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/57) [`8c19b08`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/8c19b08bf4d5e7eebfc8c37c582122cb796b5a82) Thanks [@ovsw](https://github.com/ovsw)! - Add Sauces Index page with SSR + client filtering (search via Fuse.js, product line multi-select, sauce type single-select), A→Z/Z→A sorting, URL param syncing, responsive sidebar/sheet filters, and accessibility improvements. Also scaffold a basic sauce detail route at `/sauces/[slug]`.

- [#57](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/57) [`2d327dd`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/2d327ddf4d1dfe1e4ea4bed9cafb0ac788984076) Thanks [@ovsw](https://github.com/ovsw)! - Introduce Eyebrow component and refactor badge usage across sections
  - Add `Eyebrow` UI component (`@workspace/ui/components/eyebrow`) with CVA variants `onLight` (default) and `onDark`. No background fill; uses a 1px left border and 1rem left padding; small text. Skips rendering when text is empty. Supports optional `aria-label` for accessibility.
  - Refactor web sections to use `Eyebrow` instead of `Badge`:
    - `hero.tsx`, `cta.tsx`, `faq-accordion.tsx`, `image-link-cards.tsx`, `feature-cards-with-icon.tsx`.
  - Keep `Badge` only for sauce cards; move color logic into `Badge` CVA variants (`original`, `organic`, `premium`, `pizza`, `pasta`, `salsa`, `sandwich`).
  - Simplify `Badge` API (required `text`, optional `href`) so the component only handles styling while callers supply content/links.

### Patch Changes

- [#57](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/57) [`4b7f020`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/4b7f0202f2664035cc59b3a74edee6972ee92ddc) Thanks [@ovsw](https://github.com/ovsw)! - Use `Badge` variant prop in SauceCard and sauce taxonomy for consistency and accessibility
  - Switch SauceCard to variant-based `Badge` usage
  - Align `src/config/sauce-taxonomy.ts` with `Badge` variants
  - No intended UI or behavior changes

- Updated dependencies [[`4b7f020`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/4b7f0202f2664035cc59b3a74edee6972ee92ddc), [`2d327dd`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/2d327ddf4d1dfe1e4ea4bed9cafb0ac788984076)]:
  - @workspace/ui@1.6.0

## 1.5.0

### Minor Changes

- [#55](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/55) [`e9803fc`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/e9803fcba2fb9b3ec25c172e74489f0830522dd4) Thanks [@ovsw](https://github.com/ovsw)! - Make slug input schema-aware and add sauce slugs under `/sauces/`.
  - Slug field component now respects each field’s `options.source` and `options.slugify`, enabling Generate/Clean Up for docs without a `title` (e.g., sauces use `name`).
  - Enforce `/sauces/` prefix for `sauce` documents; add cleaner/validator rules and slug prefix mapping.
  - Update sauce schema to include slug with auto-generation and validation.
  - Update web links to `/sauces/` and fix OG queries to use plain-text sauce descriptions.

### Patch Changes

- [#55](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/55) [`530abd4`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/530abd46de184addc6ee5a1307fbb9d5be471e32) Thanks [@ovsw](https://github.com/ovsw)! - Address PR comment fixes in Studio and Web.
  - Studio (page): use centralized slug validator with `sanityDocumentType: "page"`; remove manual `/blog` guard.
  - Web (OG): coerce OG `title`/`description` to strings to avoid type drift (sauce).

- Updated dependencies []:
  - @workspace/ui@1.5.0

## 1.4.2

### Patch Changes

- [#54](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/54) [`93087f5`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/93087f5776205fed69cd28a3e337577ebcec11c7) Thanks [@ovsw](https://github.com/ovsw)! - chore(theme): disable runtime theme switching and purge dark variants
  - Remove `next-themes` usage and theme toggle; stub `Providers` to no-op
  - Simplify `layout.tsx` to light-only; drop cookie/client-hint logic
  - Purge all `dark:` Tailwind variants across web and shared UI
  - Remove `next-themes` from `web` and `@workspace/ui` dependencies
  - Add ADR-001 with re-enable steps; update Cursor agent handbook to clarify light-only

- [#52](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/52) [`e089acb`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/e089acb4cc3f90aeb1d77ccd29b0c3bf2a362703) Thanks [@ovsw](https://github.com/ovsw)! - fix(a11y): footer links text color and hover colors, border colors.

- Updated dependencies [[`93087f5`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/93087f5776205fed69cd28a3e337577ebcec11c7)]:
  - @workspace/ui@1.4.2

## 1.4.1

### Patch Changes

- [#49](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/49) [`5741fcd`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/5741fcd19d028eee7b7af746cf7f07cba954d625) Thanks [@ovsw](https://github.com/ovsw)! - Make `LogoSvg` accept full SVG props and fix potential id collisions; rename file to `elements/logo.tsx` and update imports.
  - Extend `LogoSvg` props to `ComponentPropsWithoutRef<'svg'>` and spread onto `<svg>` to allow `aria-*`, `role`, `id`, and other SVG attributes
  - Remove hardcoded `id="a"` to avoid potential collisions in composed pages and OG rendering
  - Rename `apps/web/src/components/elements/Logo.tsx` → `apps/web/src/components/elements/Logo.tsx` and update all imports (`navbar`, `navbar-client`, `footer`, `api/logo`, `api/og`, `header`)

- [#49](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/49) [`6a10ecc`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/6a10eccc583e7060b55b3b367223caece8872ea9) Thanks [@ovsw](https://github.com/ovsw)! - Make brand logo code-owned and remove CMS logo.
  - Replace header, nav, and footer logos with inline `LogoSvg` (currentColor theming)
  - Remove `logo` from Sanity `settings` schema and from related queries/types
  - Update OG image route and JSON-LD to no longer depend on CMS logo
  - Delete obsolete Sanity-driven `Logo` image component in web
  - Lint/typecheck clean across web and studio

- [#49](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/49) [`b90dfb1`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/b90dfb16f34092cbc9e390f0d57b6d4bca4e2393) Thanks [@ovsw](https://github.com/ovsw)! - Add OG logo rendering and PNG logo endpoint; update JSON-LD
  - Add `/api/logo` endpoint (Edge) to render inline `LogoSvg` to PNG via next/og
  - Render inline logo in OG route layout; fix Satori display style requirements
  - Update JSON-LD Organization/Article to use absolute `/api/logo` URL
  - Allow `/api/og/*` and `/api/logo/*` in robots

- [#51](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/51) [`af09524`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/af09524b424f45dfaa942c77811833959ac2594f) Thanks [@ovsw](https://github.com/ovsw)! - Fix SSR hydration mismatch by making theme selection deterministic.
  - Ensure the server-rendered `html` `class` and inline `color-scheme` match the initial theme used on the client to prevent hydration errors.
  - Consolidate initial theme logic in `RootLayout` and providers to avoid client-only theme flashes.

- Updated dependencies []:
  - @workspace/ui@1.4.1

## 1.4.0

### Minor Changes

- [#47](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/47) [`7ab121c`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/7ab121c4a563fe81dfd3d36f88fdb96cd933096b) Thanks [@ovsw](https://github.com/ovsw)! - Introduce background color, noise texture, and top gradient via background.css
  - Import `background.css` in `apps/web/src/app/layout.tsx`
  - Add `public/images/bg/noise-red.svg` asset
  - Adjust `packages/ui` global styles to support background layering

- [#47](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/47) [`7ab121c`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/7ab121c4a563fe81dfd3d36f88fdb96cd933096b) Thanks [@ovsw](https://github.com/ovsw)! - Switch default typography to Libre Baskerville (serif) and retain Geist as `font-sans` for selective use.
  - Add `--font-serif` (Libre Baskerville 400/700 incl. italics) and apply `font-serif` to `<body>`
  - Keep `--font-sans` (Geist) and `--font-mono` available; no API changes
  - Uses `next/font/google` (self-hosted at build) per Tailwind v4 tokens

### Patch Changes

- [#47](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/47) [`7ab121c`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/7ab121c4a563fe81dfd3d36f88fdb96cd933096b) Thanks [@ovsw](https://github.com/ovsw)! - Switch ESLint tooling to exec (lockfile‑pinned) and refine a11y policy
  - Replace dlx with exec for ESLint/Prettier (root‑pinned toolchain) to eliminate local/CI drift
  - Remove zero‑warning gates; warnings allowed, accessibility rules error and fail hooks
  - Update Husky and lint‑staged to respect partial commits and show concise errors
  - Keep shared config with a11y rules as errors; downgrade non‑a11y to warnings across packages

- Updated dependencies [[`7ab121c`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/7ab121c4a563fe81dfd3d36f88fdb96cd933096b), [`7ab121c`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/7ab121c4a563fe81dfd3d36f88fdb96cd933096b)]:
  - @workspace/ui@1.4.0

## 1.3.1

### Patch Changes

- [#44](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/44) [`6491694`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/64916948ba4cc5e162f781706f13c995986ebe57) Thanks [@ovsw](https://github.com/ovsw)! - Improve header navigation accessibility and hover/active UX.
  - Introduce `NavLink` with `aria-current` and strong focus-visible styles
  - Refactor `DesktopNav` to semantic `ul`/`li` markup using `NavLink`
  - Add active state + `aria-current` in `MobileNavPanel` for consistency
  - Keep UI styling consistent without adding new dependencies

- [#41](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/41) [`23a8d24`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/23a8d24544a571a793d219d47844798a6a393e19) Thanks [@ovsw](https://github.com/ovsw)! - Enable project-wide a11y lint via eslint-plugin-jsx-a11y and enforce a11y rules as errors.

- Updated dependencies []:
  - @workspace/ui@1.3.1

## 1.3.0

### Minor Changes

- [#40](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/40) [`145ac73`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/145ac7305070c90f960c135bd15e01990954d551) Thanks [@ovsw](https://github.com/ovsw)! - Replace navbar with new header, Improve mobile menu styling and animation, Add Recipes button (desktop + mobile), Fix cart button hover cursor,Smooth hide-on-scroll behavior

### Patch Changes

- [#37](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/37) [`987c036`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/987c03628123a7f58e012c75bdbc811c5e873e9b) Thanks [@ovsw](https://github.com/ovsw)! - fix mobile nav not showing up after SSR refactor. Fix theme hydration issues after removing hydration warning suppression.

- Updated dependencies [[`145ac73`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/145ac7305070c90f960c135bd15e01990954d551)]:
  - @workspace/ui@1.3.0

## 1.2.3

### Patch Changes

- [#34](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/34) [`91d6d51`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/91d6d51fccb5b73bf230c28950c0b306936a8bf8) Thanks [@ovsw](https://github.com/ovsw)! - chore(devx): introduce Husky + lint-staged to enforce format/lint/types at commit and push; add CI format check

- Updated dependencies [[`91d6d51`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/91d6d51fccb5b73bf230c28950c0b306936a8bf8)]:
  - @workspace/ui@1.2.3

## 1.2.2

### Patch Changes

- [#28](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/28) [`50e130d`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/50e130d41ded6d8ba859978e492935d2a91da7cd) Thanks [@ovsw](https://github.com/ovsw)! - refactor: implement color scheme client hint support without needing to suppress hydration warnings and persist theme preference in cookies

- Updated dependencies []:
  - @workspace/ui@1.2.2

## 1.2.1

### Patch Changes

- [#25](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/25) [`841e2c1`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/841e2c10ac33a573e462b1e6d5d12c5138cc8f0b) Thanks [@ovsw](https://github.com/ovsw)! - SSR the primary navigation and improve accessibility and UX.
  - Render both mobile and desktop variants on the server; remove client-only gating
  - Add `<nav aria-label="Primary">` with responsive-only visibility
  - Unmount mobile drawer content when closed to keep it inert
  - Add active link states and `aria-current` for links and column triggers
  - Add global skip-to-main link and wrap content in `main#main`

- Updated dependencies []:
  - @workspace/ui@1.2.1

## 1.2.0

### Minor Changes

- [#23](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/23) [`cece48c`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/cece48cadaa5670776737bcdbb623098453dd76e) Thanks [@ovsw](https://github.com/ovsw)! - upgraded to sanity 4.6.0, added types for sauces, products, recipies and corresponding structures in the sanity back-end.

### Patch Changes

- Updated dependencies [[`cece48c`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/cece48cadaa5670776737bcdbb623098453dd76e)]:
  - @workspace/ui@1.2.0

## 1.1.0

### Patch Changes

- [#21](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/21) [`d3794ca`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/d3794ca601bc0de6ad67fcbb9ea152e07279e184) Thanks [@ovsw](https://github.com/ovsw)! - Ported over the DelGrosso Foods color tokens and set up the To process CSS from the UI package via the TypeScript config to trigger hot module reloads for CSS imports into globals.css

- Updated dependencies [[`d3794ca`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/d3794ca601bc0de6ad67fcbb9ea152e07279e184)]:
  - @workspace/ui@1.1.0

## 1.0.2

### Patch Changes

- [#18](https://github.com/ovsw/DelGrossoFoods.com-2025/pull/18) [`5aa40f6`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/5aa40f6961a96b402f4e1fbaad61227f51badf7e) Thanks [@ovsw](https://github.com/ovsw)! - Raise minimum Node to 22.12.0 to fix Sanity typegen (ESM/CJS interop).

- Updated dependencies [[`5aa40f6`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/5aa40f6961a96b402f4e1fbaad61227f51badf7e)]:
  - @workspace/ui@1.0.2

## 1.0.1

### Patch Changes

- [`129710f`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/129710f84ebd83603923a1b225eaf1165aab477f) Thanks [@ovsw](https://github.com/ovsw)! - Initialize Changesets and unify versions across fixed workspaces.
  - Add Changesets tooling and config
  - Synchronize versions via fixed group
  - Generate initial CHANGELOGs via Release PR

- Updated dependencies [[`129710f`](https://github.com/ovsw/DelGrossoFoods.com-2025/commit/129710f84ebd83603923a1b225eaf1165aab477f)]:
  - @workspace/ui@1.0.1
