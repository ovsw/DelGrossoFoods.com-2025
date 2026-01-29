# Project Overview

This is a monorepo for the DelGrossoFoods.com website, built with Next.js, Sanity CMS, and Tailwind CSS. It uses `pnpm` as a package manager and `turborepo` for build orchestration.

## Workspace Structure

The project is organized into applications and shared packages:

### Applications

- **`apps/web-dgf`**: The Next.js 15 frontend for Del Grosso Foods.
- **`apps/studio-dgf`**: The Sanity v5 Studio for Del Grosso Foods.
- **`apps/web-lfd`**: The Next.js 15 frontend for La Famiglia Del Grosso.
- **`apps/studio-lfd`**: The Sanity v5 Studio for La Famiglia Del Grosso.

### Packages

- **`packages/ui`**: Shared UI components and styles (using `shadcn` patterns).
- **`packages/eslint-config`**: Shared ESLint configuration.
- **`packages/typescript-config`**: Shared TypeScript configuration.

## Key Technologies

- **Runtime**: Node.js (>=22.12)
- **Package Manager**: pnpm (10.x)
- **Build System**: Turbo (2.x)
- **Framework**: Next.js 15 (App Router)
- **CMS**: Sanity v5
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript (Strict)

## Architecture & Component Organization

We follow a strict component organization strategy in the web apps (`apps/web-*`):

- **Page Sections** (`components/page-sections/...`):
  - Components that implement `<Section>` and orchestrate complete page areas.
  - File naming: `<page-name>-<section-descriptor>-section.tsx`.
  - **Shared sections** (`components/page-sections/shared/...`) are for identical, cross-page sections (e.g., newsletter).
- **Elements** (`components/elements/...`):
  - Reusable UI building blocks (page-agnostic, presentational).
  - Examples: `ProductCard`, `SanityImage`.
- **Features** (`components/features/...`):
  - Domain/business feature composites (e.g., `cart`, `catalog`).
  - Encapsulate flows and integration logic.
- **Layouts** (`components/layouts/...`):
  - Reusable presentation skeletons.
- **Page Builder Blocks** (`components/systems/pagebuilder/blocks/...`):
  - CMS-driven blocks rendered by the PageBuilder.

## Sanity CMS Workflow

### Type Safety

We maintain tight coupling between Sanity schemas and TypeScript types.

1.  **Schema Changes**: Edit schemas in `packages/sanity-schema/src/schemaTypes`.
2.  **Type Generation**: Run `pnpm --filter studio-dgf type` (or `studio-lfd`) to extract and generate types.
3.  **Web Consumption**: The web app uses these generated types for queries.

### Live Preview (Presentation)

- We use the **Next.js Sanity Live Content API** (`defineLive` from `next-sanity`).
- **Do NOT** use legacy preview APIs (`LiveQuery`, `useLiveQuery`).
- **Steganography**: Sanity stega is enabled for "Click-to-Edit". Ensure visible text keeps stega metadata, but strip it from accessibility attributes (aria-labels, alt text) using `stegaClean`.

### Shared Components & Presentation

To share UI components while keeping Sanity "click-to-edit" metadata:

1.  **Shared Component**: Define in `packages/ui`. Accept `rootProps?: RootProps<HTMLElement>` (from `@workspace/ui/lib/data-attributes`) and spread it on the container. _Do not_ import `next-sanity`.
2.  **App Wrapper**: Create a thin wrapper in the web app.
    - Accept `sanityDocumentId`, `sanityDocumentType`, and `sanityFieldPath`.
    - Use `createPresentationDataAttribute` (local helper) to generate the `data-sanity` string.
    - Pass this string via `rootProps` to the shared component.
3.  **Usage**: Pass the document context (`_id`, `_type`) from the page/section to the App Wrapper.

### Images & Page Builder (Click-to-Edit)

To ensure images in Page Builder blocks are editable and sharp:

1.  **Path**: Use strict paths for `createDataAttribute`. For blocks, it must be `pageBuilder[_key=="${_key}"].image`. Generic paths like `image` break navigation.
2.  **Clarity**: Do not use `respectSanityCrop`, `mode`, or `loading="eager"` on `SanityImage`. Use conditional rendering `{image && <SanityImage ... />}`.
3.  **Props**: Ensure the Page Builder passes `sanityDocumentId` and `sanityDocumentType` to block components.

## Styling & UI

- **Tailwind v4**: We use Tailwind v4 exclusively.
- **Shared UI**: Use components from `@workspace/ui`. Do not add `shadcn-ui` as a dependency; we implement patterns directly in `packages/ui`.
- **Theming**: The web apps are **Light-only**. No dark mode support.
- **ClassNames**: Use `cn()` for class composition.

## Accessibility

- **Live Announcements**: We use a global `A11yLiveAnnouncer` for active messages (e.g., "Added to cart").
  - Use `announce(message, politeness)` from `src/lib/a11y/announce.ts`.
  - **Always** `stegaClean(message)` if the text comes from Sanity.

## Building and Running

### Build

To build the entire monorepo:

```shell
pnpm run build
```

### Development

To start development for a specific site (Web + Studio):

- **Del Grosso Foods**: `pnpm run dev:dgf`
- **La Famiglia Del Grosso**: `pnpm run dev:lfd`

This starts Next.js on `http://localhost:3000` (or `3001` for LFD) and Sanity Studio on `http://localhost:3333` (or `3334` for LFD).

## Development Conventions

### Code Style

- **Formatting**: `pnpm run format` (Prettier)
- **Linting**: `pnpm run lint` (ESLint)

### Testing

Currently, quality is maintained through static analysis:

- **Type Checking**: `pnpm run check-types`
- **Linting/Formatting**: Run via `lint-staged` on commit.

## Contribution Guidelines

### Versioning (Changesets)

We use `changesets` for versioning.

- **Fixed Group**: `web`, `studio`, `@workspace/ui`, etc., are versioned together.
- **Process**:
  1.  Make changes.
  2.  Run `pnpm changeset` and select changed packages.
  3.  Select bump type (patch/minor/major).
  4.  Commit.

### Git Hooks

- **Pre-commit**: Runs `lint-staged` and `check-types`.
