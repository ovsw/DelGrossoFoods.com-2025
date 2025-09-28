---
"web": patch
---

Open Foxy Sidecart from the header Cart button; document env and loader script

- Include FoxyCart loader (`loader.js`) in the root layout with `beforeInteractive` so forms/links are intercepted and the Sidecart opens without navigation.
- Use `NEXT_PUBLIC_FOXY_DOMAIN` with `resolveFoxyConfig` to build the cart URL.
- Update header `CartButton` to link to `https://<store>.foxycart.com/cart?cart=view` so the loader opens Sidecart; fall back to full cart navigation if the loader isn't available.
- Add a FoxyCart form on product pages that opens the Sidecart when a product is added.

- Note: HMAC/webhooks are not included in this MVP; the quantity badge updates via Foxy loader (`data-fc-id`).
