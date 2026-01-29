# DelGrossoFoods.com Website - a Next.js Monorepo with Sanity CMS

A modern, full-stack monorepo built with Next.js App Router, Sanity CMS, Shadcn UI, and TurboRepo.

## Features

### Monorepo Structure

- Apps: `web-dgf`, `web-lfd` (Next.js frontends) and `studio-dgf`, `studio-lfd` (Sanity Studios)
- Shared packages: `ui`, `sanity-config`, `sanity-schema`, TypeScript config, ESLint config
- Turborepo for build orchestration and caching

### Frontend (Web)

- Next.js App Router with TypeScript
- Shadcn UI components with Tailwind CSS
- Server Components and Server Actions
- SEO optimization with metadata
- Responsive layouts

### Content Management (Studio)

- Sanity Studio v5
- Custom document types (pages, FAQs, products, sauces, recipes, and more)
- Visual editing integration
- Structured content with schemas
- Live preview capabilities
- Asset management
- Tags input docs: see `docs/tags-input.md`

#### 1. Download project files

Clone the project. Make sure you have the following installed on your system:

- Node.js (version >=22.12.0)
- pnpm (version 10.x; this repo uses `pnpm@10.12.2`)

#### 2. Create Studio env files

Use the `.env.example` files as templates:

- `apps/studio-dgf/.env`
- `apps/studio-lfd/.env`

> **Note**: Values come from the `DelGrossoFoods.com-25` Sanity project API settings.
>
> - `SANITY_STUDIO_PROJECT_ID`
> - `SANITY_STUDIO_DATASET`
> - `SANITY_STUDIO_TITLE`
> - `SANITY_STUDIO_SITE_CODE` (`DGF` or `LFD`)
> - `SANITY_STUDIO_PRESENTATION_URL`
> - `SANITY_STUDIO_PRODUCTION_HOSTNAME`
> - `SANITY_STUDIO_PREVIEW_ORIGIN` (LFD only, per `.env.example`)

#### 3. Create Web env files

Use the `.env.example` files as templates:

- `apps/web-dgf/.env.local`
- `apps/web-lfd/.env.local`

> **Note**: Values come from the `DelGrossoFoods.com-25` Sanity project API settings.
>
> - `NEXT_PUBLIC_SANITY_PROJECT_ID`
> - `NEXT_PUBLIC_SANITY_DATASET`
> - `NEXT_PUBLIC_SANITY_API_VERSION` (default: `2024-10-28`)
> - `NEXT_PUBLIC_SANITY_STUDIO_URL` (`http://localhost:3333` for DGF, `http://localhost:3334` for LFD)
> - `SANITY_API_READ_TOKEN`
> - `SANITY_API_WRITE_TOKEN`
> - `SITE_ID` and `SITE_SLUG` (LFD, per `.env.example`)

#### 4. Run DGF or LFD locally

From the repo root:

```shell
pnpm dev
```

The `pnpm dev` command runs the DGF apps (`web-dgf` + `studio-dgf`). To run the LFD apps instead:

```shell
pnpm dev:lfd
```

#### 5. Open the app and sign in to the Studio

DGF:

- Web: [http://localhost:3000](http://localhost:3000)
- Studio: [http://localhost:3333](http://localhost:3333)

LFD:

- Web: [http://localhost:3001](http://localhost:3001)
- Studio: [http://localhost:3334](http://localhost:3334)

**User account**:

- You should have an admin account created for you.
- Contact Todd Walters at DelGrosso if you need one created for you.

### Working on the project

1.  Extending the Sanity schema

Schemas are defined in `packages/sanity-schema/src/schemaTypes`. Both studios import the shared schema package.

2.  Updating the front-end

The Next.js 15 front-ends live in `apps/web-dgf` and `apps/web-lfd`. Familiarize yourself with both structures to get started.

### Deployment

#### 1. Deploying Sanity Studio (DGF + LFD)

The GitHub Actions workflow `deploy-sanity.yml` now runs a matrix job for both studios whenever changes touch `apps/studio-dgf` or `apps/studio-lfd`. Each matrix job builds and deploys from its own directory and injects the correct site code plus presentation/production URLs.

> **Note**: Secrets vs vars:
>
> - Secret: `SANITY_DEPLOY_TOKEN`
> - Repo variables: `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET`, `SANITY_STUDIO_TITLE`, `SANITY_STUDIO_PRESENTATION_URL`, `SANITY_STUDIO_PRODUCTION_HOSTNAME`
> - Optional site-specific overrides (vars): `SANITY_STUDIO_PRESENTATION_URL_DGF`, `SANITY_STUDIO_PRESENTATION_URL_LFD`, `SANITY_STUDIO_PRODUCTION_HOSTNAME_DGF`, `SANITY_STUDIO_PRODUCTION_HOSTNAME_LFD`

The workflow always passes `SANITY_STUDIO_SITE_CODE` as `DGF` or `LFD` per matrix job. If no site-specific vars are defined, it falls back to the shared values.

Set `SANITY_STUDIO_PRESENTATION_URL` (or the site-specific override) to the matching Vercel URL: `https://dgf-25.vercel.app` for DGF and `https://lfd-25.vercel.app` for LFD. Set `SANITY_STUDIO_PRODUCTION_HOSTNAME` (or override) to the hostname you want for each Studio (e.g., `my-cool-project` → `https://my-cool-project.sanity.studio`).

Manual deploys can still be triggered from either studio directory:

```shell
npx sanity deploy
```

**Note**: Live preview requires third-party cookies to be enabled in your browser.

#### 2. Deploying Next.js apps to Vercel (DGF + LFD)

The old single Vercel deployment has been replaced with two Vercel projects: one builds `/apps/web-dgf` (the DGF site) and the other builds `/apps/web-lfd` (the LFD site). Wire both projects under the DelGrosso Foods Inc. org so production and preview builds run against the correct folder. The automated build check that was blocking your merge now targets these two projects, so reconfigure them instead of the removed legacy deployment.

For each project, copy the shared Sanity environment variables from `/apps/web-dgf/.env.example` (or `/apps/web-lfd/.env.example`) into Vercel:

> - `NEXT_PUBLIC_SANITY_PROJECT_ID`
> - `NEXT_PUBLIC_SANITY_DATASET`
> - `NEXT_PUBLIC_SANITY_API_VERSION`
> - `NEXT_PUBLIC_SANITY_STUDIO_URL`
> - `SANITY_API_READ_TOKEN`
> - `SANITY_API_WRITE_TOKEN`

Add site-level values such as `SITE_ID`, `SITE_CODE`, or `SITE_SLUG` so each build knows which subset of Sanity content to render.

Production traffic should go to:

> - `https://dgf-25.vercel.app` for `web-dgf`
> - `https://lfd-25.vercel.app` for `web-lfd`

Branch previews expose their own URLs via Vercel. If you host either app elsewhere, keep the envs synced and ensure both `/apps/web-dgf` and `/apps/web-lfd` are still built in your alternative pipeline.

#### 3. Invite more collaborators

You can optionally invite more collaborators to the Studio: if you have access to [Manage](https://www.sanity.io/manage), select the `DelGrossoFoods.inc-25` in the `DelGrosso Foods Inc.` Org and click "Invite project members".

They will be able to access the deployed Studio, where you can collaborate together on creating content.

### Next.js TypeScript and typed routes

- The files `apps/web-dgf/next-env.d.ts` and `apps/web-lfd/next-env.d.ts` are auto-generated by Next.js. Do not edit them.
- You may see this line inside them: `/// <reference path="./.next/types/routes.d.ts" />`. This enables Next.js “typed routes” so `Link`/router calls are checked at compile time.
- The referenced file is generated when you run the dev server or build.
  Advantages:
- Warning when invalid values for segment config options are passed.
- Showing available options and in-context documentation.
- Ensuring the `use client` directive is used correctly.
- Ensuring client hooks (like useState) are only used in Client Components.
- This also enables typed routes, among other things, so that when you use a path in a Link component, it checks that the path is actually real and exists, preventing broken links.
  Gotchas:
- ⚠️ Ensure your IDE uses the workspace TypeScript version for best IntelliSense.
- ⚠️ If your editor complains that it’s missing, start the app (`pnpm dev` for DGF or `pnpm dev:lfd` for LFD) so `.next/types/routes.d.ts` is created.
- ⚠️ Dynamic routes need either inference from literals or a cast (as Route) if you build strings.
- More info: Next.js TypeScript config docs (see “Custom type declarations” and typed routes) [link](https://nextjs.org/docs/app/api-reference/config/typescript).
