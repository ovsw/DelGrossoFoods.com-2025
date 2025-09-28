# ADR-004: Standardize Accessibility Announcements via Global Live Announcer

Date: 2025-09-28
Status: Accepted

## Context

We need a clear, reliable, and consistent way to announce user-facing events to assistive technologies (AT), such as "Added 2 items to your cart". Previously, components added ad-hoc sr-only aria-live regions, which can be brittle (especially when third-party overlays re-parent DOM nodes) and lead to multiple competing patterns.

React 19 dev + FoxyCart Sidecart exacerbate the brittleness, producing NotFoundError in development when nodes are moved. We addressed the underlying DOM instability in ADR-003, but we still need a single, developer-friendly pattern for announcements.

## Decision

- Adopt a single global live announcer mounted once at the app root.
  - Component: `apps/web/src/components/a11y/live-announcer.tsx`.
  - Mount: in `apps/web/src/app/layout.tsx` after `<SanityLive />`.
- Announcements are sent using the helper `announce(message, politeness?)` from `apps/web/src/lib/a11y/announce.ts`.
  - Under the hood it dispatches `a11y:announce` with `{ message, politeness }`.
  - Prefer `politeness: "polite"`; reserve `"assertive"` for errors or urgent feedback.
- Do not use Next’s App Router Announcer for non-navigation messages.
- Keep passive status updates (e.g., header minicart count) in component-owned sr-only regions or updated by Foxy’s `data-fc-id` markers.

## Alternatives Considered

- Component-local aria-live regions: lead to duplication and inconsistencies; more prone to being moved or replaced by overlays.
- Reusing Next’s route announcer: risks conflicts with navigation announcements; brittle if its lifecycle changes.

## Consequences

- One obvious way for active announcements reduces cognitive load and avoids duplication.
- The global announcer is shadow-hosted and guarded to survive DOM reparenting; improved dev ergonomics (with ADR-003 dev tolerance).
- Components no longer need to own ephemeral sr-only spans for active messages.

## Implementation

- Files:
  - `apps/web/src/components/a11y/live-announcer.tsx` — implements the live region and handles `a11y:announce`.
  - `apps/web/src/app/layout.tsx` — mounts `<A11yLiveAnnouncer />` and `<AnnouncerGuard />`.
  - `apps/web/src/lib/a11y/announce.ts` — export `announce(message, politeness?)` convenience API.
  - `apps/web/src/components/cart/foxycart-provider.tsx` — uses `announce(...)` for add-to-cart intent, success, and error conditions.
- Documentation:
  - `AGENTS.md` updated with developer guidance and references.

## Usage Examples

```ts
import { announce } from "@/lib/a11y/announce";

// Polite info
announce("Added 2 items to your cart.");

// Assertive error
announce("Sorry, could not add to cart.", "assertive");
```

## Related

- ADR-003: FoxyCart Sidecart DOM Interop with Next App Router (Dev DOM Tolerance)
