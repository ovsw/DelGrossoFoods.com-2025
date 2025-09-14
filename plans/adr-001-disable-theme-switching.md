# ADR-001: Disable runtime theme switching (dark mode)

- Status: Accepted
- Date: 2025-09-14

## Decision

We removed theme switching and any dark theme variants from the app to reduce complexity and avoid ambiguity for contributors and tooling (especially accessibility testing). The previous dark mode came from the template and was not productized.

## Scope

- Removed runtime switching (`next-themes`) and the toggle UI.
- Simplified layout to light-only and removed color-scheme negotiation.
- Purged `dark:` Tailwind variants across `apps/web` and `@workspace/ui` components.
- Kept a minimal `Providers` component as a no-op, so future re-enablement is straightforward.
- Park design tokens for dark mode (if any) outside of the build (none are currently imported).

## Rationale

- YAGNI: no current product requirement for theme switching.
- Clarity: ensures agents and developers only consider the light theme during QA/a11y.
- Maintenance: avoids code rot and bundle bloat from unused branches.

## How to re-enable later

1. Install `next-themes` in `apps/web`:
   - `pnpm -C apps/web add next-themes`
2. Restore a real provider in `apps/web/src/components/providers.tsx`:
   ```tsx
   "use client";
   import { ThemeProvider } from "next-themes";
   export function Providers({ children }: { children: React.ReactNode }) {
     return (
       <ThemeProvider
         attribute="class"
         defaultTheme="light"
         enableSystem={false}
       >
         {children}
       </ThemeProvider>
     );
   }
   ```
3. Reintroduce the toggle UI (add a `ModeToggle` and use `useTheme()` from `next-themes`).
4. Optionally reintroduce dark tokens and `dark:` classes where needed.
5. Validate accessibility and contrast in dark mode.

## Notes

- Accessibility and functional testing should target light theme only until this ADR is superseded.
- Search for `ADR-001` and `ModeToggle` stub if you need the previous touchpoints.
