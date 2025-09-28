# ADR-003: Suppress Header Transitions During Foxy Sidecart Open/Close

- Status: Accepted
- Date: 2025-09-28

## Context

When the Foxy Sidecart opens, it applies a scroll lock (e.g., `body { overflow: hidden; padding-right: 15px }`) and wraps the page inside an overlay container (`[data-fc-store-page]`). On close, it restores scroll position programmatically (commonly `0 → Npx`), which used to trigger the header’s hide/show logic and cause a brief, visible “flash” or re-animation of the navbar.

Earlier attempts to mitigate this by changing CSS transitions (from `transition-all` to `transition-[transform,opacity]`) reduced the flicker but degraded the animation feel. Hysteresis helped but still allowed perceptible artifacts at some scroll depths.

## Decision

Keep the refined slide/fade animation during normal scrolling, but explicitly disable all header transitions while the Foxy Sidecart is open and for a short cooldown after it closes (to absorb the programmatic scroll restore). Re-enable transitions immediately after the cooldown.

## Rationale

- Programmatic scroll restores are not user intent; they shouldn’t trigger animated state changes.
- Disabling transitions only during the sidecart lifecycle prevents visible flicker without sacrificing the smooth slide/fade in everyday scrolling.
- Adds minimal coupling to Foxy’s DOM markers and is easy to maintain.

## Implementation

- Hook enhancement exports a `suppressTransitions` flag:
  - `apps/web/src/hooks/useScrollVisibility.ts:12` — Provides direction-based visibility with guards for the sidecart lifecycle.
  - `apps/web/src/hooks/useScrollVisibility.ts:135` — Computes `suppressTransitions` when the sidecart is open (`body.cart-visible` or `[data-fc-store-page]`) or within a 250ms cooldown after close.

- Header consumes the flag to toggle transitions:
  - `apps/web/src/components/header/index.tsx:20` — `const { isVisible, suppressTransitions } = useScrollVisibility();`
  - `apps/web/src/components/header/index.tsx:47` — Applies `transition-none duration-0` when `suppressTransitions` is true; otherwise uses `transition-all` with translate/opacity classes for the slide/fade.

- Cooldown: 250ms (`sidecartCooldownMs`) to cover DOM cleanup and scroll restoration.

## Alternatives Considered

- Hysteresis-only thresholds for up/down scroll deltas — reduced flicker but still allowed artifacts at certain depths and felt less responsive.
- Permanently narrowing transition properties (transform/opacity) — mitigated some jank but removed desirable animation polish.
- Forcing a reflow/baseline reset on close without disabling transitions — unreliable across scroll depths.

## Consequences

- Header does not animate while the sidecart is open or during the short cooldown after close (intentional).
- Small coupling to Foxy DOM markers; if Foxy changes class/attribute names, selectors must be updated.

## Testing/Validation

- Open/close sidecart at top, mid, and deep scroll positions; verify no navbar flicker on close.
- Scroll down past threshold and back up a small amount; verify slide/fade animation is preserved and responsive.
- Toggle cooldown duration locally if needed (e.g., 150–300ms) for device variance.

## Follow-ups

- If Foxy updates its markup, update selectors in `useScrollVisibility` (`body.cart-visible`, `[data-fc-store-page]`).
- If desired, expose thresholds/cooldown via config for easier tuning per page.
