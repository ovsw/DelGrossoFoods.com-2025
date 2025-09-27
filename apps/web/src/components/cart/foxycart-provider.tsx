"use client";

import { stegaClean } from "next-sanity";
import * as React from "react";

import { resolveFoxyConfig } from "@/lib/foxy/config";
import { urlFor } from "@/lib/sanity/client";

type AddToCartDetail = {
  id?: string | null;
  sku?: string | null;
  name?: string | null;
  quantity?: number | null;
  unitPrice?: number | null;
  packagingLabel?: string | null;
  weightText?: string | null;
  slug?: string | null;
  shippingCategory?: string | null;
  weight?: number | null;
  imageAssetId?: string | null;
};

function clampQuantity(q: unknown): number {
  const n = typeof q === "number" ? q : Number(q);
  if (!Number.isFinite(n)) return 1;
  return Math.min(99, Math.max(1, Math.floor(n)));
}

function formatPriceUSD(value: unknown): string | null {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;
  // Normalize to 2 decimals to satisfy Foxy expectations
  return (Math.round(n * 100) / 100).toFixed(2);
}

function buildImageUrl(imageAssetId?: string | null): string | null {
  if (!imageAssetId) return null;
  try {
    // urlFor accepts a ref via {_ref}
    const u = urlFor({ _ref: imageAssetId })
      .width(600)
      .height(600)
      .dpr(2)
      .url();
    return typeof u === "string" ? u : null;
  } catch {
    return null;
  }
}

function addHiddenInput(form: HTMLFormElement, name: string, value: unknown) {
  if (value == null) return;
  const str = String(value);
  if (str.length === 0) return;
  const input = document.createElement("input");
  input.type = "hidden";
  input.name = name;
  input.value = str;
  form.appendChild(input);
}

export function FoxycartProvider() {
  const foxyConfig = React.useMemo(
    () => resolveFoxyConfig(process.env.NEXT_PUBLIC_FOXY_DOMAIN),
    [],
  );

  React.useEffect(() => {
    function onAddToCart(evt: Event) {
      const e = evt as CustomEvent<AddToCartDetail>;
      const detail = e.detail || {};

      // Env checks
      if (!foxyConfig) {
        console.error(
          "Foxycart: NEXT_PUBLIC_FOXY_DOMAIN is not set; skipping add-to-cart.",
        );
        return;
      }

      const { cartDomain } = foxyConfig;

      // Required fields
      const sku = detail.sku ?? null;
      const price = formatPriceUSD(detail.unitPrice);
      const quantity = clampQuantity(detail.quantity ?? 1);

      if (!sku || typeof sku !== "string" || sku.trim().length === 0) {
        console.error("Foxycart: Missing SKU for product; cannot add to cart.");
        return;
      }

      if (price == null) {
        console.error(
          "Foxycart: Invalid price for product; cannot add to cart.",
        );
        return;
      }

      // Optional fields
      const rawName = detail.name ?? "";
      const cleanedName = stegaClean(rawName);
      const name =
        typeof cleanedName === "string" && cleanedName.trim().length > 0
          ? cleanedName.trim()
          : String(rawName).trim();

      // Build return URL
      let returnUrl: string | null = null;
      try {
        const origin = window.location.origin;
        const slug = (detail.slug ?? "").replace(/^\/+|\/+$/g, "");
        const path = slug.startsWith("store/") ? `/${slug}` : `/store/${slug}`;
        returnUrl = `${origin}${path}`;
      } catch {
        returnUrl = null;
      }

      // Build form
      const form = document.createElement("form");
      form.action = `https://${cartDomain}/cart`;
      form.method = "post";
      form.className = "foxycart"; // Foxy loader intercepts this
      form.style.display = "none";

      // Required / recommended params
      addHiddenInput(form, "name", name || sku);
      addHiddenInput(form, "price", price);
      addHiddenInput(form, "quantity", quantity);
      addHiddenInput(form, "code", sku);

      // Category and weight are optional but recommended if store is configured for them
      if (detail.shippingCategory) {
        addHiddenInput(form, "category", detail.shippingCategory);
      }
      if (typeof detail.weight === "number" && !Number.isNaN(detail.weight)) {
        addHiddenInput(form, "weight", detail.weight);
      }

      if (returnUrl) {
        addHiddenInput(form, "url", returnUrl);
      }

      const imageUrl = buildImageUrl(detail.imageAssetId ?? null);
      if (imageUrl) {
        addHiddenInput(form, "image", imageUrl);
      }

      // Submit via DOM so loader can intercept and open Sidecart
      try {
        document.body.appendChild(form);
        form.submit();
      } catch (err) {
        console.error("Foxycart: Form submission failed", err);
      } finally {
        // Cleanup asap
        if (form.parentNode) {
          form.remove();
        }
      }
    }

    document.addEventListener(
      "product:add-to-cart",
      onAddToCart as EventListener,
    );
    return () => {
      document.removeEventListener(
        "product:add-to-cart",
        onAddToCart as EventListener,
      );
    };
  }, [foxyConfig]);

  return null;
}
