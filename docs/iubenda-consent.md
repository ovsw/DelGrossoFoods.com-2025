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

`iubenda-head.tsx` is a client boundary that renders the head's initial native HTML only on the server. In the browser it returns a head with no `dangerouslySetInnerHTML` prop, leaving the parser-loaded snippet unmanaged. React acquires the head singleton during hydration; supplying that prop in the browser would replace Next's CSS, metadata, and other head nodes. In React 19/Next 15.5.9, ordinary head children come after hoisted Next bootstrap scripts. The head preamble preserves this order in emitted HTML:

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
CONSENT_TEST_PRODUCTION=1 CONSENT_TEST_ORIGIN=https://dg-consent-preview.vercel.app PLAYWRIGHT_MODULE=/path/to/installed/playwright node scripts/test-consent-browser.mjs
```

The browser test creates and removes a temporary Next fixture. `CONSENT_TEST_PRODUCTION=1` runs `next build` and `next start`, then checks that CSS and title survive hydration, a router refresh, and client navigation. This regression reproduced the deployed head-resource loss before the fix. It imports the real shared controller and each app's video component, uses both real CMP configurations, and loads each site's Foxy store. It intercepts GA to prevent test analytics from reaching production. It checks native HTML order, no initial GA preload, default US permissions, footer controls without duplicate widgets, client routing, withdrawal during playback, saved opt-outs, GPC, Mux playback without telemetry, and CMP load failure.

With `CONSENT_TEST_ORIGIN` set as above, Playwright routes that HTTPS origin to the local fixture while Chromium retains the preview hostname and public-suffix cookie rules. The test saves Reject all through the real panel, verifies cookies exist, checks the withdrawal reload, then opens a fresh context with saved storage and checks that the three switches remain unchecked. This is a preview-host equivalent test, not a Vercel deployment.

This fixture does not replace full-site QA. Local full-site builds have no `SANITY_API_READ_TOKEN`, so they compile and typecheck but stop when collecting page data. Both Vercel preview builds passed at PR head `685a44e` using the existing project environment. Those previews have an empty GA ID; the intercepted fixture proves the GA gate, not live preview analytics. Checkout submission and CMS-backed full pages still need validation with the normal site environment. No deployment or policy mutation is part of these tests.

## Sources

- [Iubenda advanced guide](https://www.iubenda.com/en/help/1205-how-to-configure-your-cookie-solution-advanced-guide-2/) — callbacks, `getPurposesState`, and `getPreferences`.
- Actual classic snippets returned for sites 4618045 and 4618044 (saved in the rollout task).
- [Current CMP core inspected during implementation](https://cdn.iubenda.com/cookie_solution/iubenda_cs/1.105.0/core-en.js) — US purpose defaults, GPC, callback order, footer detection.
- [DGF autoblocker](https://cs.iubenda.com/autoblocking/4618045.js) — targeted exclusion attribute.

## CodeRabbit review resolution

The single review for PR #177 reported two minor findings:

- **Fixed — hydration warning filter:** `scripts/test-consent-browser.mjs` now requires the React hydration marker and at least one parsed diff line. Every removed attribute must match a known Iubenda annotation. Missing markers, empty diffs, and unknown warnings remain errors. Eight focused cases passed, including valid vendor annotations and missing, empty, changed-format, and mixed-attribute messages.
- **Rejected — swap footer fallback URLs:** the current Notice at Collection link uses the cookie-policy URL with `iubenda-cs-uspr-link`; Your Privacy Choices uses the legal page's US-rights fragment with `iubenda-cs-preferences-link`. Main directly verified these native URLs on live DG2Go. The official guide assigns the classes to Notice at Collection and preferences respectively, and the provider's inline widget uses its cookie-policy URL for Notice at Collection. Swapping the URLs would change the useful native fallbacks. Both footers remain unchanged.

No second review was run. The existing import-sort change in `packages/ui/tests/iubenda.test.mjs` was preserved.

## Hosted legal lightboxes and footer controls

Branch `feat/iubenda-legal-lightbox` starts from production `13d135def4f898ad9ff51e857b6e58f5f003da6b`.

Both footers now use native hosted Privacy, Cookie, and Terms anchors with DG2Go's exact `iubenda-nostyle no-brand iubenda-noiframe iubenda-embed` classes. The shared `IubendaLegalLink` loads the official `https://cdn.iubenda.com/iubenda.js` after mount. It tracks initialized DOM nodes with a WeakSet and shares an in-flight load; new links mounted through client routing trigger the provider's normal scan again. Existing nodes are not rebound by this owner. No local click handler cancels navigation, so a failed embed script leaves the hosted URL as the fallback.

Foods `/terms-and-conditions` redirects permanently to `https://www.iubenda.com/terms-and-conditions/61608121`. Sauce redirects both `/terms-and-conditions` and its existing typo `/terms-and-conditons` to `https://www.iubenda.com/terms-and-conditions/49130163`. CMS content is unchanged. Main owns Terms configuration and final approval; loading a document in this test is not approval of its content.

The shared `IubendaPrivacyControls` moves Notice at Collection and Your Privacy Choices below the address in the left footer block. It uses the DG2Go white, bordered two-part group, blue opt-out icon, and original CMP hook classes. At very narrow widths (360px or less) it stacks the two links to prevent overflow. Only Privacy, Cookie, and Terms remain in the legal row. The CMP controller and tested native head implementation are unchanged.

Verification uses the existing production Next fixture with the real shared footer shell, compiled site CSS, and provider scripts. It checks 1440px, 390px, and 320px layouts, real legal content in the provider lightbox, remounted links after client routing, mobile and desktop CMP preferences, no duplicate widget, native fallbacks with the embed script blocked, and retained CSS/title. Run with `CONSENT_TEST_TERMS=1` in addition to the documented production-fixture command to include the current hosted Terms pages. Browser evidence is a local HTTPS preview-host equivalent fixture; full CMS page appearance remains a Vercel preview check.
