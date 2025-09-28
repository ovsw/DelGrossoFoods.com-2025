---
"web": patch
---

Guard Next.js App Router announcer from third‑party DOM reparenting and add development‑only DOM mutation tolerance to stabilize FoxyCart Sidecart interactions.

- Add `AnnouncerGuard` to keep `<next-route-announcer>` anchored under `<body>` so Next’s cleanup doesn’t throw when overlays move nodes.
- Add `DevDomRemoveTolerance` (development only) to make `insertBefore`, `replaceChild`, and `removeChild` tolerant when reference/child nodes have been reparented by the Sidecart.
- Mount both in root layout after `<SanityLive />`, before the Foxy provider.

- Add `A11yLiveAnnouncer` and standardize active announcements via `document.dispatchEvent(new CustomEvent("a11y:announce", { detail: { message, politeness } }))`. Refactor `FoxycartProvider` to use the global announcer (remove local sr-only live region).
- Add `announce(message, politeness?)` helper in `apps/web/src/lib/a11y/announce.ts` so developers import a single function instead of hand-crafting `CustomEvent`s.

Notes

- Production behavior is unchanged; the tolerance runs only in `NODE_ENV=development`.
- This eliminates NotFoundError noise (removeChild/insertBefore) seen when changing Sidecart quantity, focusing country select, or tabbing away while the Sidecart is open.
