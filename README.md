# DelGrossoFoods.com Website - a Next.js Monorepo with Sanity CMS

A modern, full-stack monorepo built with Next.js App Router, Sanity CMS, Shadcn UI, and TurboRepo.

## Features

### Monorepo Structure

- Apps: web (Next.js frontend) and studio (Sanity Studio)
- Shared packages: UI components, TypeScript config, ESLint config
- Turborepo for build orchestration and caching

### Frontend (Web)

- Next.js App Router with TypeScript
- Shadcn UI components with Tailwind CSS
- Server Components and Server Actions
- SEO optimization with metadata
- Blog system with rich text editor
- Table of contents generation
- Responsive layouts

### Content Management (Studio)

- Sanity Studio v3
- Custom document types (Blog, FAQ, Pages)
- Visual editing integration
- Structured content with schemas
- Live preview capabilities
- Asset management

#### 1. Download project files

Clone the project. Make sure you have the following installed on your system:

- Node JS (version >=20)
- pnpm (version >= 9.12.3)

#### 2. Create the Sanity `apps/sanity/.env` file with the following vriables

> **Note**: Take the values for these from the `DelGrossoFoods.com-25` Sanity project's API seciton.
>
> - `SANITY_DEPLOY_TOKEN`
> - `SANITY_STUDIO_PROJECT_ID`
> - `SANITY_STUDIO_DATASET`
> - `SANITY_STUDIO_TITLE`
> - `SANITY_STUDIO_PRESENTATION_URL_DGF`
> - `SANITY_STUDIO_PRESENTATION_URL_LFD`

#### 3. Create the Next.JS `apps/next/.env` file with the following vriables

> **Note**: Take the values for these from the `DelGrossoFoods.com-25` Sanity project's API seciton.
>
> - NEXT_PUBLIC_SANITY_PROJECT_ID=
> - NEXT_PUBLIC_SANITY_DATASET=
> - NEXT_PUBLIC_SANITY_API_VERSION=2024-10-28
> - NEXT_PUBLIC_SANITY_STUDIO_URL=http://localhost:3333
> - SANITY_API_READ_TOKEN=
> - SANITY_API_WRITE_TOKEN=

#### 3. Run Studio and Next.js app locally

Navigate to the project directory using `cd delgrossofoods.com-25`, and start the development servers by running the following command

```shell
pnpm run dev
```

#### 3. Open the app and sign in to the Studio

Open the Next.js app running locally in your browser on [http://localhost:3000](http://localhost:3000).

Open the Studio running locally in your browser on [http://localhost:3333](http://localhost:3333). You should now see a screen prompting you to log in to the Studio.

**User account**:

- you should have an admin account created for you.
- Conctact Todd Walters at DelGrosso if you need one created for you.

### Wokring on the project

1.  Extending the Sanity schema

The Sanity 3 schemas for all document types are defined in the `studio/schemaTypes/documents` directory. You can [add more document types](https://www.sanity.io/docs/schema-types) to the schema as needed.

2.  Updating the front-end

The Next.JS 15 front-end is in the `web/` folder, familiarize yourself with its structure to get started.

## Multi-site preview & deployment

This repo deploys **two** branded sites from the same codebase. Each brand maps to its own Vercel project and Sanity workspace. Preview, publishing, and static generation depend on a small set of environment variables and host mappings.

### Environment matrix

| Location                           | Variable                             | Value                                        |
| ---------------------------------- | ------------------------------------ | -------------------------------------------- |
| `apps/web` (local builds)          | `BUILD_SITE_ID`                      | `DGF` or `LFD` (set per build/start command) |
| Vercel project → DGF               | `BUILD_SITE_ID`                      | `DGF`                                        |
| Vercel project → LFD               | `BUILD_SITE_ID`                      | `LFD`                                        |
| `apps/studio/.env` & Studio deploy | `SANITY_STUDIO_PRESENTATION_URL_DGF` | DGF preview origin (`https://dgf…`)          |
| `apps/studio/.env` & Studio deploy | `SANITY_STUDIO_PRESENTATION_URL_LFD` | LFD preview origin (`https://lfd…`)          |

Sanity Studio will refuse to open Presentation if either site-specific variable is missing (`apps/studio/utils/helper.ts`). Likewise, Next.js builds fail if `BUILD_SITE_ID` is absent (`apps/web/src/lib/site.ts`).

### How preview routing works

- Each Sanity workspace (DGF / LFD) is configured with Presentation origins in `sanity.config.ts`. The custom `presentationUrl` plugin reads the document’s `site` reference and opens the matching domain.
- The Next.js app derives the site by Host header or `BUILD_SITE_ID`. During static generation, `BUILD_SITE_ID` tells Sanity queries which dataset slice to pull; at runtime, middleware resolves the host (`apps/web/src/lib/site.ts`).
- Shared documents (e.g., sauces available on both brands) preview on the workspace domain the editor is currently using. The doc can still include both site associations in content logic.

### Checklist before deploying

1. **Vercel projects**: two projects pointing to the same repo/branch, each with the correct `BUILD_SITE_ID` and domain (`delgrossofoods.com` vs `delgrossosauce.com`).
2. **Sanity env vars**: set both `SANITY_STUDIO_PRESENTATION_URL_*` variables in local `.env`, Vercel Studio deploy secrets, and Sanity CLI deploy contexts.
3. **Sanity settings**: add both domains (and their staging subdomains) to CORS and Presentation allowed origins.
4. **Hosts file (local)**: map `dgf.localhost` and `lfd.localhost` to `127.0.0.1`; keep the mkcert certificate covering `*.localhost`.
5. **Build validation**: run `BUILD_SITE_ID=DGF pnpm --filter web build` and `BUILD_SITE_ID=LFD pnpm --filter web build` before pushing. Missing env vars or host mappings will fail fast.
6. **Preview smoke test**: from each Sanity workspace, use “Open in Presentation” to confirm the correct domain opens with the expected content.

### Common pitfalls

- Forgetting to set `BUILD_SITE_ID` leads to the wrong site being statically generated or builds crashing in CI.
- Omitting `SANITY_STUDIO_PRESENTATION_URL_<SITE>` prevents the Presentation button from working (helper throws immediately).
- New domains must be added to `HOST_TO_SITE_ID` in `apps/web/src/lib/site.ts`; otherwise requests will error with “Unable to resolve site id for host…”.
- DNS changes require matching updates to Sanity CORS + presentation origins, or editors will see blank previews.

### Deployment

#### 1. Deploying Sanity Studio

The project includes a GitHub Actions workflow [`deploy-sanity.yml`](https://raw.githubusercontent.com/robotostudio/turbo-start-sanity/main/.github/workflows/deploy-sanity.yml) that automatically deploys your Sanity Studio whenever changes are pushed to the `studio` directory.

> **Note**: To use the GitHub Actions workflow, make sure to configure the following secrets in your repository settings:
>
> - `SANITY_DEPLOY_TOKEN`
> - `SANITY_STUDIO_PROJECT_ID`
> - `SANITY_STUDIO_DATASET`
> - `SANITY_STUDIO_TITLE`
> - `SANITY_STUDIO_PRESENTATION_URL_DGF`
> - `SANITY_STUDIO_PRESENTATION_URL_LFD`
> - `SANITY_STUDIO_PRODUCTION_HOSTNAME`

Set `SANITY_STUDIO_PRODUCTION_HOSTNAME` to whatever you want your deployed Sanity Studio hostname to be. Eg. for `SANITY_STUDIO_PRODUCTION_HOSTNAME=my-cool-project` you'll get a studio URL of `https://my-cool-project.sanity.studio` (and `<my-branch-name>-my-cool-project.sanity.studio` for PR previews builds done automatically via the `deploy-sanity.yml` github CI workflow when you open a PR.)

Set `SANITY_STUDIO_PRESENTATION_URL_DGF` and `SANITY_STUDIO_PRESENTATION_URL_LFD` to the presentation origins for each brand. These URLs are required for both local development and production deployments and should be:

- Added to your GitHub repository secrets for CI/CD deployments (both variables)
- Added to your local `.env` files when deploying manually with `npx sanity deploy`
- Kept in sync with the domains assigned to the DGF and LFD Vercel projects

You can then manually deploy from your Studio directory (`/studio`) using:

```shell
npx sanity deploy
```

##### Manual Studio host override (one-off testing)

To deploy a temporary Studio without touching the main host, set an explicit hostname via `SANITY_STUDIO_HOSTNAME` (overrides the default host logic wired in `apps/studio/sanity.cli.ts`). Example:

```bash
cd apps/studio
SANITY_STUDIO_HOSTNAME=delgrosso-sauces \
SANITY_STUDIO_PRESENTATION_URL_DGF="https://<dgf-branch-domain>" \
SANITY_STUDIO_PRESENTATION_URL_LFD="https://<lfd-branch-domain>" \
npx sanity deploy
```

This publishes at `https://delgrosso-sauces.sanity.studio` while leaving `https://delgrossofoods.sanity.studio` unchanged. Remember to add the new Studio host and both preview domains to your Sanity project CORS settings with credentials enabled.

**Note**: To use the live preview feature, your browser needs to enable third party cookies.

#### 2. Next.js app Deployment to Vercel

You have the freedom to deploy your Next.js app to your hosting provider of choice. Initially the front-end is meant to be deployed With Vercel and GitHub, from the `/apps/web` folder.

If you need to access branch previews for pull-requests, ask for access to the Vercel DelGrosso Foods Inc. org from Todd Walters at DelGrosso.

#### 3. Invite more collaborators

You can optionally invite more collaborators to the Studio: if you have access to [Manage](https://www.sanity.io/manage), select the `DelGrossoFoods.inc-25` in the `DelGrosso Foods Inc.` Org and click "Invite project members".

They will be able to access the deployed Studio, where you can collaborate together on creating content.

### Next.js TypeScript and typed routes

- The file `apps/web/next-env.d.ts` is auto-generated by Next.js. Do not edit it.
- You may see this line inside it: `/// <reference path="./.next/types/routes.d.ts" />`. This enables Next.js “typed routes” so `Link`/router calls are checked at compile time.
- The referenced file is generated when you run the dev server or build.
  Advantages:
- Warning if the invalid values for segment config options are passed.
- Showing available options and in-context documentation.
- Ensuring the 'use client' directive is used correctly.
- Ensuring client hooks (like useState) are only used in Client Components.
- This also enables typed routes, among other things, so that when you use a path in a Link component, it checks that the path is actually real and it exists and prevents you from putting in broken links.  
  Gotchas:
- ⚠️ Ensure your IDE uses the workspace TypeScript version for best IntelliSense.
- ⚠️ If your editor complains that it’s missing, start the app (`pnpm dev` at repo root or in `apps/web`) so `.next/types/routes.d.ts` is created.
- ⚠️ Dynamic routes need either inference from literals or a cast (as Route) if you build strings.
- More info: Next.js TypeScript config docs (see “Custom type declarations” and typed routes) [link](https://nextjs.org/docs/app/api-reference/config/typescript).
