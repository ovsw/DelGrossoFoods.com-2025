# Foods and Sauce consent controls

The shared implementation uses Iubenda's **classic remote-configuration snippet**, not a unified widget URL.

| Site | CMP site ID | Policy ID |
| ---- | ----------- | --------- |
| DGF  | 4618045     | 61608121  |
| LFD  | 4618044     | 49130163  |

`packages/ui/src/lib/iubenda.ts` owns the document's tracking state. The native configuration installs its callbacks before loading the autoblocker, GPP stub, and async CMP. `onReady` and preference callbacks read `getPurposesState()`. `getPreferences()` alone is insufficient: it can be empty on a first US visit.

The US flags `s`, `sh`, and `adv` are permissions: true allows the purpose; false opts out. The current CMP runtime's US defaults and `checkPurposes` implementation confirm this. GPC overrides permissive stored state. All three flags must be true before optional tracking starts. Missing state never grants permission.

`tracking-consent.tsx` exposes a document-scoped React subscription and loads GA once, after permission. GA's script has a targeted `data-cmp-ab="1"` exclusion because this controller already gates it; otherwise the autoblocker can reactivate GA after a preference save. The attribute must be set before `src`. Other scripts remain subject to the autoblocker.

On withdrawal, the controller sets Google's `ga-disable-<ID>` flag and updates React immediately. It reloads once after Iubenda's saved-preference callback. This removes active GA/Mux runtime state. A saved denial on the next document does not reload again.

On `*.vercel.app`, the configuration sets the supported `localConsentDomainExact: true` option before loading the CMP. This saves host-only cookies. The provider's default parent-domain inference otherwise targets `.vercel.app`, a public suffix where Chrome rejects cookies. Production domain settings remain unchanged.

Both recipe players wait for CMP readiness. With permission denied, Mux mounts with `disableTracking` and `disableCookies` so requested playback remains available without Mux Data telemetry. Foxy is necessary commerce: its loader, cart links, forms, and announcements remain outside the optional tracking gate.

## Native head order

`iubenda-head.tsx` renders the head's initial native HTML. In React 19/Next 15.5.9, ordinary head children come after hoisted Next bootstrap scripts. The head preamble preserves this order in emitted HTML:

1. Local configuration and callbacks.
2. Synchronous site-specific autoblocker.
3. Synchronous GPP stub.
4. Async CMP loader.
5. Next executable scripts.

Only fixed site IDs and an escaped GA ID enter this string. Next still emits its metadata and resources. Do not replace this with `next/script`'s `beforeInteractive` queue.

The footer supplies both provider hook classes with native policy fallbacks. Iubenda detects the two hooks and does not add a second automatic widget. Its native scripts annotate SSR nodes before hydration (`data-cmp-ab`, `data-cmp-info`, `data-iub-enabled`). React development builds can report these attribute-only differences. The browser test permits only those known annotations; other browser/hydration errors fail the test.

## Checks

From the repository root:

```sh
node --test packages/ui/tests/iubenda.test.mjs
pnpm --filter web-dgf typecheck
pnpm --filter web-lfd typecheck
CONSENT_TEST_ORIGIN=https://dg-consent-preview.vercel.app PLAYWRIGHT_MODULE=/path/to/installed/playwright node scripts/test-consent-browser.mjs
```

The browser test creates and removes a temporary Next fixture. It imports the real shared controller and each app's video component, uses both real CMP configurations, and loads each site's Foxy store. It intercepts GA to prevent test analytics from reaching production. It checks native HTML order, no initial GA preload, default US permissions, footer controls without duplicate widgets, client routing, withdrawal during playback, saved opt-outs, GPC, Mux playback without telemetry, and CMP load failure.

With `CONSENT_TEST_ORIGIN` set as above, Playwright routes that HTTPS origin to the local fixture while Chromium retains the preview hostname and public-suffix cookie rules. The test saves Reject all through the real panel, verifies cookies exist, checks the withdrawal reload, then opens a fresh context with saved storage and checks that the three switches remain unchecked. This is a preview-host equivalent test, not a Vercel deployment.

This fixture does not replace full-site QA. The current checkout has no `SANITY_API_READ_TOKEN`, so both full builds compile and typecheck but stop when collecting page data. Checkout submission and CMS-backed full pages still need validation with the normal site environment. No deployment or policy mutation is part of these tests.

## Sources

- [Iubenda advanced guide](https://www.iubenda.com/en/help/1205-how-to-configure-your-cookie-solution-advanced-guide-2/) — callbacks, `getPurposesState`, and `getPreferences`.
- Actual classic snippets returned for sites 4618045 and 4618044 (saved in the rollout task).
- [Current CMP core inspected during implementation](https://cdn.iubenda.com/cookie_solution/iubenda_cs/1.105.0/core-en.js) — US purpose defaults, GPC, callback order, footer detection.
- [DGF autoblocker](https://cs.iubenda.com/autoblocking/4618045.js) — targeted exclusion attribute.
