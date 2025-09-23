**Project Constitution**

- Purpose: Capture the enduring engineering principles for DelGrossoFoods.com so humans and AI agents ship changes that honour product intent, technical constraints, and operational safety.
- Scope: Applies to every workspace in this monorepo (`apps/web`, `apps/studio`, `packages/*`) and governs code authoring, review, testing, deployment, and future planning.

**Code Quality**

- TypeScript everywhere with explicit exports, no `any`, early returns, shallow control flow, and descriptive naming; enforce kebab-case filenames with `.tsx` for React and `.ts` for utilities as mandated in `AGENTS.md`.
- Treat shared conventions as law: reuse `@workspace/ui` primitives, follow existing shadcn patterns without introducing depreacated `shadcn-ui`, keep Tailwind v4 tokens centralized, and default to `SanityImage` for CMS-driven assets per `AGENTS.md`.
- Respect architectural decisions: the web app is light-only (ADR-001), `Providers` stays a no-op until ADR reversal, and new code must not resurrect dark-theme branches without superseding the ADR.

**Testing Standards**

- Minimum gate for any change: run formatter, `pnpm --filter <workspace> lint:fix`, and `pnpm --filter <workspace> typecheck`; expand to `pnpm --filter web build` when preparing release candidates per `AGENTS.md`.
- Adopt the layered accessibility roadmap in `plans/accessibility-testing-plan.md`: eslint a11y rules treated as errors, Playwright + Axe smoke checks on core routes, Vitest or Jest accessibility unit tests, contrast guards, pa11y-ci on previews, and WCAG 2.2 assertions.
- Honor lint-staged hooks defined in `package.json`; never bypass automated formatting or linting unless a documented exception exists and has been approved.

**User Experience**

- Maintain light-theme visual language, consistent grid and spacing tokens, and reuse list-page primitives outlined in `plans/index-pages-card-lists-improvements.md` to avoid fragmentation.
- Preserve Live Preview click-to-edit behaviour: keep Sanity stega metadata intact on visible text, only `stegaClean` when values feed ARIA or logic, and mount `<SanityLive />` as configured in `apps/web/src/lib/sanity/live.ts` (`AGENTS.md`).
- When extending flows like `/sauces`, `/store`, or `/recipes`, follow the PRD + plan hierarchy documented in `plans/context-pack-sauce-index.md`: SSR-first data fetching, consistent filter UX, mobile sheet semantics, and URL-sync contracts.

**Accessibility**

- Default to semantic HTML, labelled controls, focus-visible states, and aria-live updates; never substitute `div` for interactive elements (`AGENTS.md`).
- Implement the accessibility testing plan incrementally but treat each completed stage as permanent—regressions require root-cause analysis and remediation, not suppression.
- Sheet/dialog components must trap focus, restore it on close, respond to Escape, and expose discernible names; badge colours and contrast must satisfy WCAG 2.2 expectations (`plans/accessibility-testing-plan.md`).

**Developer Experience**

- Use pnpm 10.x and Node ≥22.12; prefer `pnpm --filter <workspace>` invocations so scripts remain portable across CLI versions (`AGENTS.md`).
- Store secrets only in package-level `.env` files; never hard-code tokens and keep SANITY + Vercel environment variables aligned with README guidance.
- After any Sanity schema or GROQ change, immediately run `pnpm --filter studio type`, then re-run web typecheck to keep generated types synchronized (`AGENTS.md`).
- Capture enduring project knowledge in `AGENTS.md` when asked to “store” guidance; avoid shadow documentation.

**Performance**

- Preserve SSR defaults, reuse shared filter utilities, and memoize expensive operations to avoid hydration flashes as emphasized in `plans/index-pages-card-lists-improvements.md`.
- Keep Sanity image projections lean—do not over-expand assets in GROQ queries, respect `minimumCacheTTL`, and provide explicit `sizes` or `loading` hints when touching `ListCard`.
- Monitor metadata fetch failures per ADR-002 once accepted: wrap `sanityFetch` with structured logging that surfaces outages without exposing secrets.

**Governance**

- Decision order: PRDs and ADRs set product and architectural boundaries, project plans dictate implementation sequencing, and this constitution resolves day-to-day trade-offs; conflicts escalate to maintainers before deviating.
- Any change that weakens a principle (e.g., skipping tests, altering theme policy, bypassing accessibility checks) requires a documented exception that cites impacted files, the temporary mitigation, and a follow-up plan; add the record to `AGENTS.md` or a plan doc.
- Changesets remain mandatory for every merged change affecting fixed-group workspaces (`web`, `studio`, `@workspace/ui`, `@workspace/eslint-config`, `@workspace/typescript-config`); select only touched packages, but expect uniform version bumps (`AGENTS.md`).
- Technical decisions must articulate how they advance or balance these principles; reviewers should block merges that lack this justification, especially where user-facing quality, accessibility, or performance might regress.
- Continuous improvement proposals (new tooling, refactors) go through plan documents under `plans/` with clear scope, risks, and acceptance criteria before implementation to keep the monorepo coherent.

**Ongoing Stewardship**

- Revisit this constitution whenever ADRs change, new accessibility stages ship, or major architectural shifts occur; record updates with rationale and effective date.
- Treat monitoring, observability, and fallback UX as first-class—silent failures (e.g., Sanity outages) must be logged and alerting-ready per ADR-002 once enacted.
- Encourage incremental delivery: break large initiatives into small PRs aligned with the plan phases, ensuring each preserves accessibility, testing health, and UX consistency.
