# Tasks: [FEATURE NAME]

**Input**: Design documents from `/specs/[###-feature-name]/`
**Prerequisites**: plan.md (required), research.md, data-model.md, contracts/

## Execution Flow (main)

```
1. Load plan.md from feature directory
   → If not found: ERROR "No implementation plan found"
   → Extract: target workspace(s), affected components, constitution commitments
2. Load optional design documents:
   → data-model.md: Extract entities → data or schema tasks
   → contracts/: Each file → contract or API test task
   → research.md: Extract decisions → setup tasks or guardrails
3. Generate tasks grouped by constitution principles:
   → Code Quality: refactors, shared component updates, ADR follow-up
   → Testing Discipline: failing tests, type regeneration, linting gates
   → User Experience: light-theme validation, accessibility checks, Sanity content wiring
   → Performance: profiling, query shaping, bundle analysis
4. Apply task rules:
   → Different files = mark [P] for parallel
   → Same file = sequential (no [P])
   → Tests and validation precede implementation (TDD)
5. Number tasks sequentially (T001, T002...)
6. Generate dependency notes (tests → implementation → polish)
7. Provide parallel execution examples respecting file isolation
8. Validate completeness against plan commitments and constitution
9. Return: SUCCESS (tasks ready for execution)
```

## Format: `[ID] [P?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- Include exact file paths in descriptions; use `<placeholder>` tags that implementers must replace before execution

## Path Conventions

- **Web app**: `apps/web/src/...`
- **Sanity Studio**: `apps/studio/schemaTypes/...`
- **Shared UI**: `packages/ui/src/...`
- **Scripts/Configs**: `plans/`, `.specify/`, `configs/`

## Phase 3.1: Setup & Guardrails

- [ ] T001 Confirm environment prerequisites and required env vars in `apps/web/.env.local` or `apps/studio/.env`
- [ ] T002 [P] Outline ADR or plan updates if touching shared architecture (`plans/adr-*.md` or new ADR draft)
- [ ] T003 [P] Prepare Storybook/preview fixtures in `apps/web/src/stories/<feature>.stories.tsx` if UX changes require visual approval

## Phase 3.2: Tests First (TDD) ⚠️ MUST COMPLETE BEFORE 3.3

**CRITICAL: Tests MUST be authored or updated and MUST FAIL before implementation.**

- [ ] T004 [P] Add or update unit/component tests in `apps/web/src/<path>/__tests__/<component>.test.tsx` (replace `<path>`)
- [ ] T005 [P] Add integration/regression scenario in `apps/web/tests/integration/<feature>.test.ts`
- [ ] T006 [P] Update Sanity schema fixture tests or zod validators in `apps/web/src/lib/sanity/__tests__/<query>.test.ts`
- [ ] T007 [P] Regenerate Sanity types (`pnpm --filter studio type`) and commit resulting artifacts

## Phase 3.3: Core Implementation (ONLY after tests are failing)

- [ ] T008 [P] Implement feature logic in `apps/web/src/<path>/<component>.tsx`
- [ ] T009 [P] Update supporting utilities in `apps/web/src/lib/<module>.ts`
- [ ] T010 [P] Align shared UI component in `packages/ui/src/components/<component>/<component>.tsx`
- [ ] T011 Wire Sanity content/query updates in `apps/web/src/lib/sanity/<query>.ts`
- [ ] T012 Apply accessibility and copy updates sourced from Sanity documents

## Phase 3.4: Performance & Integration

- [ ] T013 Profile affected route with `pnpm --filter web lint && pnpm --filter web typecheck` plus Lighthouse run; capture metrics in `plans/<feature>/performance.md`
- [ ] T014 Optimize data fetching (projection, caching) in `apps/web/src/lib/sanity/<query>.ts`
- [ ] T015 Review bundle size impact via `pnpm --filter web build` (if approved) or analyze using `next build --analyze` notes in plan

## Phase 3.5: Polish & Validation

- [ ] T016 [P] Update visual documentation/assets (screenshots, recordings) stored in `plans/<feature>/evidence/`
- [ ] T017 [P] Run quality gates: `pnpm --filter <workspace> format`, `pnpm --filter <workspace> lint:fix`, `pnpm --filter <workspace> typecheck`
- [ ] T018 Verify performance budgets (LCP ≤ 2.5s, INP ≤ 200ms) and document results in plan.md summary
- [ ] T019 [P] Update user-facing docs if applicable (`README.md`, `apps/web/src/content/...`)
- [ ] T020 Confirm tests now pass and remove any temporary toggles or flags

## Dependencies

- Phase 3.2 tasks block Phase 3.3 work
- Shared UI updates (T010) precede app-level styling tweaks dependent on them
- Performance validation (T013-T018) occurs after implementation but before final approvals

## Parallel Example

```
# Example parallel block once plan-specific paths are known:
Task: "T004 [P] Component test for hero in apps/web/src/components/hero/__tests__/hero.test.tsx"
Task: "T005 [P] Integration test for checkout happy path in apps/web/tests/integration/checkout.test.ts"
Task: "T006 [P] Sanity query validator updates in apps/web/src/lib/sanity/__tests__/product-query.test.ts"
```

## Notes

- Replace `<path>`/`<component>` placeholders with concrete values before execution
- [P] tasks must not touch the same file to preserve independence
- Tests authored in Phase 3.2 MUST fail prior to implementation to satisfy constitution TDD requirements
- Document evidence (tests, screenshots, performance metrics) for Delivery Workflow expectations

## Task Generation Rules

_Applied during main() execution_

1. **From Contracts**:
   - Each contract file → contract or API test task [P]
   - Each endpoint/query → implementation task mapped to Constitution principles
2. **From Data Model**:
   - Each entity → schema or type task [P]
   - Relationships → utility/service tasks in web or studio workspaces
3. **From User Stories**:
   - Each story → integration test [P]
   - Quickstart scenarios → validation tasks (performance, UX evidence)
4. **Ordering**:
   - Setup → Tests → Implementation → Performance → Polish
   - Dependencies gate parallel execution

## Validation Checklist

_GATE: Checked by main() before returning_

- [ ] Every plan commitment maps to at least one task
- [ ] Tests precede implementation for each code path
- [ ] Tasks reference exact files or explicit placeholders awaiting expansion
- [ ] Parallel tasks are file-isolated
- [ ] Performance validation tasks exist when user-facing work changes
- [ ] Evidence capture tasks align with Delivery Workflow requirements
