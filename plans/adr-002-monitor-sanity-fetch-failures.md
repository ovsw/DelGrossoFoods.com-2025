# ADR-002: Monitor Sanity metadata fetch failures

- Status: Proposed
- Date: 2025-09-21

## Context

Metadata loaders across `/sauces`, `/store`, `/recipes`, and `/blog` fetch content from Sanity during the request cycle. When Sanity's CDN briefly failed DNS resolution (`getaddrinfo ENOTFOUND 90szfby5.apicdn.sanity.io`), the raw `sanityFetch` promise rejected inside `generateMetadata`, crashing the page. We wrapped those calls in `handleErrors` so the UI falls back to default SEO copy, but the failure is now silent—there is no telemetry indicating the outage.

## Decision

Track Sanity metadata fetch failures so they are observable. We will extend the shared `handleErrors` utility (or a dedicated wrapper) to surface structured logs and plug into our monitoring pipeline (Sentry or equivalent) before returning fallback data.

## Scope

- Instrument metadata fetches in `apps/web/src/app/*/page.tsx` that rely on Sanity.
- Capture enough context (route, query ID, environment) for triage.
- Ensure logging happens server-side only; do not leak tokens or sensitive data.
- Leave the existing fallback UX in place so users never see the crash.

## Rationale

- **Visibility:** Silent degradation hides production issues; we need alerts when the CMS or CDN blips.
- **Debuggability:** Structured error data speeds up working with Sanity support and networking teams.
- **Regression safety:** Instrumentation makes it obvious if future refactors regress error handling.

## Open questions

- Which destination should receive these events (Sentry, Logtail, custom logging)?
- Do we need rate limiting or sampling to protect the logging pipeline during a sustained outage?
- Should we consolidate other Sanity fetches (beyond metadata) under the same telemetry approach?

## Next steps

1. Inventory existing logging/monitoring tooling and pick the destination.
2. Update `handleErrors` (or create a wrapper) to log contextual metadata fetch failures.
3. Add smoke coverage (unit or integration) to assert that failures trigger the logging path while still returning fallback SEO data.
