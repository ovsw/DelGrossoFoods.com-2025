<!--
Sync Impact Report
Version change: N/A → 1.0.0
Modified principles:
- Added Production-Grade Code Quality
- Added Full-Stack Testing Discipline
- Added Consistent User Experience
- Added Performance and Efficiency Guarantees
Added sections:
- Implementation Guardrails
- Delivery Workflow
Removed sections: None
Templates requiring updates:
- ✅ .specify/templates/plan-template.md
- ✅ .specify/templates/spec-template.md
- ✅ .specify/templates/tasks-template.md
Follow-up TODOs: None
-->

# DelGrossoFoods.com 2025 Constitution

## Core Principles

### Production-Grade Code Quality

- All changes MUST be authored in TypeScript with explicit types for exported APIs, observe repository naming conventions (kebab-case files, `.tsx` for components, `.ts` for utilities), and leave the touched files cleaner than they were found.
- Implementations MUST reuse established architecture primitives—`@workspace/ui` components, Tailwind v4 tokens, Sanity data contracts—and avoid drive-by refactors outside the approved scope unless paired with an ADR recorded in `plans/`.
- Complex control flow MUST include succinct intent-revealing comments or links to supporting ADRs so future contributors can uphold invariants without guesswork.

Rationale: Consistent structure and clarity keep the marketing site shippable on tight timelines while preventing regressions from ad-hoc patterns.

### Full-Stack Testing Discipline

- Every behavioral change MUST ship automated coverage: unit or component tests for logic, integration tests for user flows, and regenerated Sanity types (`pnpm --filter studio type`) whenever schemas or queries change.
- The quality gate for each workspace MUST run before merge: `pnpm --filter <workspace> format`, `pnpm --filter <workspace> lint:fix`, and `pnpm --filter <workspace> typecheck`; failing checks block deployment until green.
- Tests MUST follow a red-green-refactor cycle — write or update the test first, observe it fail, then implement the minimal change needed to pass while keeping fixtures fast and deterministic.

Rationale: Disciplined testing ensures content editors can rely on live preview while engineering iterates safely.

### Consistent User Experience

- UI changes MUST preserve the light-only theme, use semantic HTML, include descriptive alt text, and honor accessibility affordances (focus states, aria labels, keyboard paths) with Sanity stega metadata intact on visible text.
- Visual and interaction patterns MUST be implemented with shared `@workspace/ui` primitives or new components added to that package so the brand experience stays uniform across pages.
- Content-driven features MUST source copy and imagery from Sanity; hard-coded marketing content is prohibited unless explicitly justified in a plan and mirrored in Sanity within the same iteration.

Rationale: Consistency keeps the DelGrosso Foods brand trustworthy and enables editors to change experiences without breaking presentation tooling.

### Performance and Efficiency Guarantees

- Server-rendered routes and Sanity fetches MUST be profiled for over-fetching; queries should project only required fields and leverage fragments to keep payloads lean.
- Changes MUST maintain Lighthouse Web Vitals budgets: Largest Contentful Paint ≤ 2.5s and Interaction to Next Paint ≤ 200ms on a simulated Fast 3G profile; regressions require documented mitigation before release.
- Client bundles MUST avoid unnecessary dependencies, prefer server components where possible, and gate heavy analytics or media behind user interaction or lazy loading.

Rationale: Guarding performance prevents funnel drop-off and keeps preview responsiveness high for editors.

## Implementation Guardrails

- Use `pnpm --filter` scoped commands for workspace operations; global scripts are reserved for multi-workspace validation.
- Secrets and environment variables MUST live in per-workspace `.env` files and never be committed; reviews enforce secret scanning before approval.
- Every feature request requires a spec and plan that explicitly call out performance impacts, testing approach, and UX implications tied back to these principles.
- New shared utilities belong in `packages/ui` (components) or dedicated packages; duplication inside apps is treated as a violation unless an ADR documents the exception.

## Delivery Workflow

- Pull requests MUST include evidence of passing quality gates, screenshots or recordings for UX changes, and notes on performance validation when applicable.
- Code reviews MUST block on constitution compliance; reviewers document any deviations in the PR discussion and ensure remediation before merge.
- Release candidates MUST document outstanding risks and confirm staging smoke tests that cover primary user journeys (product discovery, content browsing, conversion flows).

## Governance

- Amendments require consensus from the maintainers of `apps/web`, `apps/studio`, and `packages/ui`, an updated Sync Impact Report, and propagation to all dependent templates within the same change set.
- Constitution versioning follows semantic rules: MAJOR for principle removals or conflicting reinterpretations, MINOR for new principles or significant expansions, PATCH for clarifications that do not alter expectations.
- A quarterly compliance review audits recent merges for adherence to principles, with findings logged in `plans/` and remediation tasks scheduled when gaps are found.

**Version**: 1.0.0 | **Ratified**: 2025-09-23 | **Last Amended**: 2025-09-23
