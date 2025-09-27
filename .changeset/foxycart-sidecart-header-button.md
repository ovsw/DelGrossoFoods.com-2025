---
"web": patch
---

Make header cart button open Foxy Sidecart and document env/script

- Include FoxyCart loader (`loader.js`) in the root layout with `beforeInteractive` so forms/links are intercepted and the Sidecart opens without navigation.
- Use custom store domain via `NEXT_PUBLIC_FOXY_DOMAIN` and `resolveFoxyConfig` to build the cart URL.
- Update header `CartButton` to render as an anchor linking to `https://<store>.foxycart.com/cart?cart=view` so the loader opens Sidecart; falls back to full cart navigation if the loader isn’t available.
- added foxycart form on product page that opens foycart side-cart when a product is added.
  Notes: No HMAC/webhooks yet (MVP). The quantity badge uses `data-fc-id` and updates via Foxy loader.
