# ADR-003: FoxyCart Sidecart DOM Interop with Next.js App Router (Dev DOM Tolerance)

Date: 2025-09-28
Status: Accepted

## Context

We integrate FoxyCart Sidecart via their loader (intercepts forms/links and renders an overlay). Sidecart modifies the DOM outside React (jQuery-based template updates like `replaceWith`, `renderCartItemsDivs`).

In Next.js 15 with React 19, development mode runs Strict Effects semantics and additional reconciliation passes. During Sidecart interactions (e.g., changing quantity, blurring a field, switching country, or tabbing away), React occasionally attempts to insert or remove nodes that have been moved or replaced by Sidecart. This results in noisy but non-fatal DOM exceptions in dev:

- `Failed to execute 'removeChild' on 'Node'`
- `Failed to execute 'insertBefore' on 'Node'`
- `Failed to execute 'replaceChild' on 'Node'`

Additionally, Next’s internal App Router Announcer appends a shadow-root container to `document.body` and cleans it up on unmount. If a third-party script re-parents this element, cleanup throws the above `removeChild` error.

## Decision

1. Guard Next’s App Router Announcer so it stays under `<body>` even if re-parented.
   - Add `AnnouncerGuard` (client component) that observes DOM mutations and re-attaches `<next-route-announcer>` to `document.body` if it’s moved.

2. Suppress dev-only NotFoundError noise from third-party DOM re-parenting.
   - Add `DevDomRemoveTolerance` with both compile-time and runtime guards:
     - **Compile-time**: Component is only rendered in development builds (`process.env.NODE_ENV === "development"`)
     - **Runtime**: Component includes internal check `if (process.env.NODE_ENV !== "development") return;`
   - Wraps `Node.prototype.insertBefore`, `replaceChild`, and `removeChild` to be tolerant when the reference/child node isn't actually a child of the current node (fallback to `appendChild` or no-op removal). This prevents React's commit phase from failing when Sidecart has already moved/replaced nodes.

Mount order in `apps/web/src/app/layout.tsx`:

- `SanityLive`
- `AnnouncerGuard`
- `DevDomRemoveTolerance` (dev only at runtime)
- `CombinedJsonLd`
- `FoxycartProvider`

## Consequences

- Production behavior is unchanged; guards only affect dev ergonomics and a11y stability.
- Announcer remains present and functional (WCAG-friendly), preserving Presentation features and click-to-edit.
- Minor dev-only polyfill risk is scoped to node mutation methods; we restore originals on unmount.

## Alternatives Considered

- Disable Sidecart or restrict it to an isolated container (if Foxy supports such config).
- Ask Foxy to avoid re-parenting body children; may not be feasible without custom integration.
- Patch Next to `container.remove()` with guards; outside our control and would need upstream change.
- Ignore the dev errors; unacceptable DX and obscures genuine issues.

## Implementation

Files added:

- `apps/web/src/components/a11y/announcer-guard.tsx` — keeps `<next-route-announcer>` anchored under `<body>`.
- `apps/web/src/components/dev/dom-remove-tolerance.tsx` — development-only wrappers for `insertBefore`, `replaceChild`, `removeChild` with safe fallbacks.
- Mounted in `apps/web/src/app/layout.tsx` directly after `<SanityLive />`.

## Verification

- Reproduce: open Sidecart, change quantity, blur the input; change country; alt-tab away and back.
- Before: repeated `removeChild` and `insertBefore` NotFoundError in console, sometimes referencing `app-router-announcer.tsx` and React commit paths.
- After: errors no longer surface in dev; Sidecart remains functional; announcer remains under `<body>`.

## Follow-ups

- Investigate whether Foxy can be configured to avoid moving `<body>` children and to scope DOM mutations to its overlay container.
- Consider isolating any Foxy-driven minicart markup as a non-React “island” if further conflicts appear.
