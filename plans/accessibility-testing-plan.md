### Accessibility Testing Plan (WCAG 2.2) — Next.js app at `apps/web`

This plan introduces layered, automated accessibility testing that prevents regressions before QA. It is optimized for quick developer feedback (lint), realistic browser checks (E2E with Axe), parity with WAVE categories, and hard requirements from WCAG 2.2 (focus visibility, target size, etc.). It is structured so an AI agent can implement each stage independently.

---

## Decisions and Scope

- **CI target**: Scan the Vercel preview URL for each PR.
- **Browsers for E2E**: Chromium, **WebKit**, and **Firefox**.
- **Initial routes**: Homepage only (`/`). We will extend later.
- **Exceptions/allowlist**: None initially. Add deliberately if needed.
- **Storybook**: Not used for now.
- **Packages**: Tailwind v4, React 19, Next.js 15.

## Test Runner Recommendation (Component-level)

**Recommendation: Vitest** for component tests with Testing Library.

- **Why Vitest**: Faster cold/hot runs, native ESM, great DX, easy config with React 19/JSDOM, strong TS support.
- **Compatibility**: Works cleanly with React Testing Library and `axe-core` (via `vitest-axe` or a light wrapper).
- **Drawbacks vs Jest**:
  - Smaller ecosystem of a11y examples that name “Jest,” but APIs map 1:1.
  - Some older Jest-only plugins may lack Vitest equivalents (not relevant for this plan).
- **If you prefer Jest**: All component test tasks below map to Jest; swap packages accordingly.

---

## Layered Implementation Overview

Implement in order. Each stage stands alone and provides value; you can pause between stages.

1. Lint-time a11y (fastest feedback)
2. Page/E2E a11y baseline with Axe (homepage, multi-browser)
3. Component a11y tests with Vitest + Testing Library + Axe
4. Design token contrast guard (Tailwind v4 tokens)
5. WAVE-adjacent site scanning on Vercel previews (`pa11y-ci`)
6. WCAG 2.2-specific assertions (focus not obscured, target size, etc.)

---

## Stage 1 — Lint-time Accessibility (ESLint + `eslint-plugin-jsx-a11y`)

Purpose: Prevent common issues at author-time with near-zero runtime cost.

Tasks

- [ ] Add `eslint-plugin-jsx-a11y` to `apps/web` and `packages/ui`.
- [ ] Extend `apps/web/eslint.config.js` and `packages/ui/eslint.config.js` to include the plugin and a strong rule set:
  - Required `alt` for images; no redundant titles
  - `label` ↔ `control` associations; required/invalid states exposure
  - `interactive-has-focus/role`, `no-static-element-interactions` unless justified
  - `anchor-is-valid`, link text content, heading order
  - Valid ARIA roles/props/states
- [ ] Make a11y rules fail CI on warnings (treat as errors).
- [ ] Ensure lint runs in pre-commit (already present) and PR CI.

Acceptance Criteria

- [ ] `pnpm -w dlx eslint -c apps/web/eslint.config.js .` yields zero a11y violations.
- [ ] PRs fail on new a11y lint errors.

---

## Stage 2 — Page/E2E A11y Baseline (Playwright + Axe)

Purpose: Catch real DOM/CSS issues early (contrast, focus, semantics) in real browsers.

Scope for now: homepage `/` in Chromium, WebKit, and Firefox.

Tasks

- [ ] Install Playwright (test runner + browsers) in `apps/web`.
- [ ] Create an E2E test that:
  - [ ] Navigates to `/` (local dev for fast feedback).
  - [ ] Injects `axe-core` and asserts no critical/serious violations (export JSON).
  - [ ] Verifies keyboard navigability: Tab reaches all interactive controls; Enter/Space activates; Escape closes any modal.
  - [ ] Checks focus visibility per WCAG 2.4.11 basics (focus ring not fully obscured).
  - [ ] Runs in Chromium, WebKit, and Firefox.
- [ ] Produce artifacts (Axe JSON, screenshots on failure) per run.
- [ ] Add a simple routes list file (e.g., `apps/web/tests/a11y/routes.json`) to centralize what to visit.

Optional now / Later

- [ ] Add a variant to point Playwright at the Vercel preview URL to mimic prod styles.

Acceptance Criteria

- [ ] `pnpm --filter web playwright test` passes with zero critical/serious Axe issues on `/` across all 3 browsers.
- [ ] Keyboard and focus checks pass.

---

## Stage 3 — Component A11y (Vitest + Testing Library + Axe)

Purpose: Enforce accessible primitives before usage spreads.

Tasks

- [ ] Install Vitest, React Testing Library, `vitest-axe` (or custom `axe-core` wrapper) in `apps/web` and `packages/ui`.
- [ ] Add a shared test util to render with providers and run Axe.
- [ ] For each shared primitive and high-traffic component (start small):
  - [ ] Render default state; run Axe; expect zero violations.
  - [ ] Validate roles/names of interactive elements (buttons, links).
  - [ ] Form controls: label association, `aria-describedby` for errors/help.
  - [ ] Dialog/menu: focus trap, `aria-modal`/expanded state, Escape closes, restore focus.
- [ ] Add component a11y tests to PR CI.

Acceptance Criteria

- [ ] All included components pass Axe baseline.
- [ ] Tests document and justify any temporary, explicit exceptions (none to start).

Notes (Jest alternative)

- Use `jest`, `@testing-library/react`, `jest-environment-jsdom`, and `jest-axe` instead of Vitest + `vitest-axe`.

---

## Stage 4 — Token-level Contrast Guard (Tailwind v4)

Purpose: Catch contrast problems at the design source-of-truth (tokens), before pages are built.

Tasks

- [ ] Implement a Node script that loads Tailwind v4 theme tokens used by `apps/web`.
- [ ] For key text/background pairs, assert:
  - [ ] Normal text contrast ≥ 4.5:1; large text ≥ 3:1.
  - [ ] Primary/secondary button text vs background ≥ 4.5:1.
  - [ ] Link color vs body text ≥ 3:1 (differentiation).
- [ ] Fail CI on regressions. Output a small report with offending pairs.

Acceptance Criteria

- [ ] Script exits non-zero when any defined pair falls below thresholds.
- [ ] CI blocks PRs with failing contrast pairs.

---

## Stage 5 — WAVE-adjacent Site Scan (Vercel Preview) with `pa11y-ci`

Purpose: Complement Axe results with a second engine similar to WAVE’s checks.

Tasks

- [ ] Add `pa11y-ci` as a dev dependency in the workspace.
- [ ] Create `pa11yci.json` at repo root or `apps/web/` with:
  - [ ] `urls`: Vercel preview URL(s) + route list (start with `/`).
  - [ ] `defaults`: concurrency, standard, timeout; no allowlist to start.
- [ ] CI workflow (GitHub Actions) that:
  - [ ] Waits for Vercel preview deployment to finish and captures the preview URL.
  - [ ] Runs `pa11y-ci` against the preview URL + routes.
  - [ ] Uploads HTML/JSON reports as artifacts and fails on errors.

Acceptance Criteria

- [ ] On each PR, after Vercel preview deploys, `pa11y-ci` runs on `/` and reports zero errors.
- [ ] Reports are visible in PR artifacts.

Implementation Notes

- To obtain the preview URL: use Vercel’s GH integration outputs or `vercel --token … --scope … inspect --url` in CI.
- Expand routes over time by editing a single routes list file, re-used by Playwright and pa11y.

---

## Stage 6 — WCAG 2.2-specific Assertions (E2E)

Purpose: Cover new and commonly missed WCAG 2.2 items.

Tasks

- [ ] 2.4.11 Focus Not Obscured: Assert focused element’s bounding box is visible (not covered by sticky headers, etc.).
- [ ] 2.5.8 Target Size (Minimum): Assert clickable/tappable targets have ≥ 24×24 CSS px or provide a documented alternative mechanism; verify principal controls on `/`.
- [ ] 2.5.7 Dragging Movements: If any drag interactions exist, provide keyboard/click alternatives; assert they are operable by keyboard.
- [ ] 3.3.7 Redundant Entry: If forms reuse previously entered data, auto-fill or avoid requiring re-entry; add E2E checks for reuse (later when applicable).
- [ ] 3.3.8 Accessible Authentication: Do not require cognitive-function-only tasks; verify auth flows when added (later).

Acceptance Criteria

- [ ] E2E checks pass for focus visibility and target size on the homepage.
- [ ] Additional items added when new UI patterns appear.

---

## Reporting & CI Gating

- **Fail the PR** on:
  - [ ] ESLint a11y violations.
  - [ ] Component Axe violations (new serious+).
  - [ ] Playwright Axe violations (critical/serious) on included routes.
  - [ ] Token contrast regression.
  - [ ] `pa11y-ci` errors on Vercel preview.
- **Artifacts**: Upload Axe JSON, pa11y HTML/JSON, and screenshots.
- **PR Summary**: Post counts of violations per stage with links to artifacts.

---

## Route Inventory (single source of truth)

- File: `apps/web/tests/a11y/routes.json` (or similar)
- Initial content:

```json
{
  "routes": ["/"]
}
```

Used by: Playwright E2E, pa11y-ci; keeps expansion simple.

---

## Operational Runbook (to be executed when implementing)

Commands (Vitest flavor; Jest alternative shown after):

```bash
# Stage 1: Lint (repo root)
pnpm -w add -D eslint-plugin-jsx-a11y

# Stage 2: Playwright (in apps/web)
pnpm --filter web add -D @playwright/test axe-core
pnpm --filter web exec playwright install --with-deps

# Stage 3: Component tests (in apps/web and packages/ui)
pnpm --filter web add -D vitest @testing-library/react @testing-library/dom @testing-library/user-event vitest-axe jsdom
pnpm --filter "@workspace/ui" add -D vitest @testing-library/react @testing-library/dom @testing-library/user-event vitest-axe jsdom

# Stage 4: Token contrast (repo root)
pnpm -w add -D culori

# Stage 5: pa11y-ci (repo root)
pnpm -w add -D pa11y-ci
```

Jest alternative for Stage 3:

```bash
pnpm --filter web add -D jest @testing-library/react @testing-library/dom @testing-library/user-event jest-environment-jsdom jest-axe ts-node
pnpm --filter "@workspace/ui" add -D jest @testing-library/react @testing-library/dom @testing-library/user-event jest-environment-jsdom jest-axe ts-node
```

---

## WAVE Parity Mapping (what we prevent and how)

- **Missing/empty alt, redundant title**: ESLint a11y + Axe + component tests.
- **Labels, required/invalid states, describedby**: Component tests + Axe.
- **Structural landmarks, heading order**: ESLint a11y + Axe + spot E2E checks.
- **Empty links/buttons, link purpose, duplicate IDs**: ESLint a11y + Axe.
- **Low contrast text/UI**: Axe + Token Contrast Guard + E2E in both themes.
- **ARIA misuse**: ESLint a11y + Axe.
- **Language attribute/meta**: E2E check once on app shell.

---

## Change Control and Maintenance

- **Adding routes**: Edit `routes.json`; both Playwright and pa11y will respect it.
- **Adding exceptions**: Create a small allowlist file with explicit rationale and issue link. Keep empty initially.
- **Expanding coverage**: Add product, recipe, cart/checkout, and blog pages incrementally to both E2E and pa11y.
- **Review cadence**: Weekly scheduled pa11y run on latest `main` to detect drift.

---

## Acceptance Summary (for each PR)

- [ ] ESLint a11y: 0 errors
- [ ] Component a11y tests: pass
- [ ] E2E Axe checks (Chromium/WebKit/Firefox): 0 critical/serious
- [ ] Focus visibility + keyboard nav: pass
- [ ] Token contrast guard: pass
- [ ] pa11y-ci on Vercel preview `/`: 0 errors
