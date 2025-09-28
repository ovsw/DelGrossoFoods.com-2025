# FoxyCart Sidecart MVP Plan (Client‑Only)

## Goal

- Enable add‑to‑cart on product pages using FoxyCart Sidecart so users stay on the page and see an on‑page cart overlay. No server code, no webhooks, no HMAC in MVP.

## Key Decisions

- Use FoxyCart Sidecart (loader.js) to intercept cart submissions and open the cart overlay in‑page (no navigation).
- Rely on Foxy loader.js to provide jQuery if not present (per Foxy docs); we will not ship our own jQuery.
- Use SKU as the canonical product identifier mapped to Foxy `code`. Do not fall back to `_id`.
- Use a form submission (POST) with `class="foxycart"` (Option B) so the loader intercepts it and opens Sidecart.

## Scope (MVP)

- Client‑only integration in apps/web.
- No HMAC signing, no webhooks, no custom Foxy templates.
- Minimal field mapping for a single product add per submission.

## Environment

- Required: `NEXT_PUBLIC_FOXY_DOMAIN` (e.g., `storename.foxycart.com`).
- Optional: `NEXT_PUBLIC_FOXY_MODE` (`sandbox|live`) for clarity only; not required to function.

## Files To Touch

- apps/web/src/app/layout.tsx
  - Include `https://cdn.foxycart.com/<NEXT_PUBLIC_FOXY_DOMAIN>/loader.js` with Next `Script` using `strategy="beforeInteractive"` so Sidecart hooks links/forms site‑wide.
  - On load, optionally verify presence (e.g., `window.jQuery` and a Foxy marker) and log a clear error if missing.

- apps/web/src/components/cart/foxycart-provider.tsx (new)
  - Client component mounted globally that listens for our existing `product:add-to-cart` event and orchestrates a Foxy‑compatible form submission.

- apps/web/src/components/providers.tsx
  - Mount `<FoxycartProvider />` once so the listener is present across the app.

- apps/web/src/lib/foxy/build-params.ts (new)
  - Tiny client util to map our product event payload to Foxy POST fields (see Param Mapping below) and to build a hidden `<form>`.

- apps/web/src/components/products/product-summary-section.tsx
  - Event detail: ensure we include `sku`, `slug`, `shippingCategory`, and `weight` in addition to existing fields.
  - Guard UX: disable Add to Cart if `unitPrice == null` or `sku` missing.

## Event Contract (documented)

Dispatched from apps/web/src/components/products/product-summary-section.tsx

`document.dispatchEvent(new CustomEvent("product:add-to-cart", { detail }))`

Detail fields (all client‑safe):

- `id: string` (Sanity document id; not used by Foxy)
- `sku: string` (required; maps to Foxy `code`)
- `name: string`
- `quantity: number` (1..99)
- `unitPrice: number | null` (USD)
- `packagingLabel: string | null` (for analytics/UI only)
- `weightText: string | null` (display only)
- `slug: string` (canonical slug for return URL)
- `shippingCategory: "normal_item" | "large_crate" | "gift_pack"`
- `weight: number | null` (pounds; align with Foxy store unit)
- `imageAssetId?: string` (optional; for cart image)

Notes:

- Keep stega metadata on visible text; when using values in logic/URL, pass them through `stegaClean`.
- Clamp and validate numeric fields in the listener/util, not in the DOM.

## Param Mapping (Foxy form fields)

For a single product add, the form will POST to `https://<FOXY_DOMAIN>/cart` and be marked `class="foxycart"` for interception.

Required / Recommended fields:

- `name` → product name (sanitized for logic)
- `price` → `unitPrice` (normalized to 2‑decimal precision)
- `quantity` → clamped to 1..99
- `code` → `sku` (required; if missing, do not submit)
- `category` → shipping category key (`normal_item | large_crate | gift_pack`)
- `weight` → numeric pounds (if configured as such in Foxy)
- `url` → canonical product URL (`origin + "/store/" + slug`)
- `image` → Sanity CDN URL (optional; improves Sidecart UI)

Image URL:

- Reuse existing Sanity image helpers (`urlFor`) or derive CDN base (`https://cdn.sanity.io/images/${projectId}/${dataset}/`) as already used by `SanityImage`. If not reliably derivable from the current payload, omit `image` (still functional).

## Global Listener (Sidecart trigger)

Responsibilities:

- Wait for `product:add-to-cart`.
- Validate `NEXT_PUBLIC_FOXY_DOMAIN`, `sku`, and `unitPrice`.
- Build a hidden `<form action="https://<FOXY_DOMAIN>/cart" method="post" class="foxycart">` and append hidden inputs for the mapped fields.
- Append to `document.body`, call `form.requestSubmit()` (with fallback for older browsers), then remove the node. The loader intercepts and opens Sidecart; no navigation occurs.
- If loader not present or validation fails, log a clear error and no‑op (keep the user on the page).

Readiness:

- We load loader.js `beforeInteractive`; if the event fires very early, queue once until `document.readyState !== "loading"` or a minimal retry loop detects the loader.

## UX and A11y

- Keep the existing polite live region in `product-summary-section.tsx` for status announcements.
- Disable Add to Cart when `unitPrice == null` or `sku` missing.
- No page navigation; Sidecart opens in‑place.

## Error Handling

- Missing env or loader not loaded → `console.error` with actionable message + assertive announcement to screen readers, no submission.
- Missing `sku` or invalid `price`/`quantity` → `console.error` + assertive announcement to screen readers, no submission.
- Script errors should not break the page; catch and fail safely with user-friendly error announcements.

## QA (Sandbox Store)

- Confirm Sidecart opens on add‑to‑cart without navigation.
- Validate fields in Sidecart: `name`, `price`, `quantity`, `code=sku`, `category`, `weight`, `url`, and `image` (if provided).
- Test shipping categories (all 3), quantities (1 and 99), integer and cents prices, and SKU‑missing case (button disabled and/or console error).
- Temporarily break loader domain to verify graceful no‑op.

## Documentation Notes

- Prereqs: `NEXT_PUBLIC_FOXY_DOMAIN` set; Foxy categories configured to match our keys.
- Sidecart is enabled solely by the loader.js include; no separate jQuery import is required.
- Current limitations: no HMAC signing, no webhooks, default Sidecart styling.

## Follow‑ups (Post‑MVP)

- Add server‑side HMAC signing for cart integrity.
- Handle Foxy webhooks for order fulfillment and inventory.
- Customize Sidecart and checkout templates for branding.
- Add a header cart button that opens Sidecart programmatically.
