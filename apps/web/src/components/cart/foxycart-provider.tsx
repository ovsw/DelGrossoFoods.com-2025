"use client";

import { stegaClean } from "next-sanity";
import * as React from "react";

import { announce } from "@/lib/a11y/announce";
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

type SidecartSuccessDetail = {
  error?: boolean | null;
  item?: {
    name?: string | null;
    product_name?: string | null;
    quantity?: number | string | null;
    quantity_total?: number | string | null;
  } | null;
  name?: string | null;
  quantity?: number | string | null;
  total_item_count?: number | string | null;
};

function clampQuantity(q: unknown): number {
  const n = typeof q === "number" ? q : Number(q);
  if (!Number.isFinite(n)) return 1;
  return Math.min(99, Math.max(1, Math.floor(n)));
}

function tryParseQuantity(value: unknown): number | null {
  if (value == null) return null;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  const clamped = Math.min(99, Math.max(1, Math.floor(parsed)));
  return clamped > 0 ? clamped : null;
}

function sanitizeText(value: unknown): string {
  if (typeof value !== "string") {
    if (value == null) return "";
    return String(value).trim();
  }
  const cleaned = stegaClean(value);
  if (typeof cleaned === "string" && cleaned.trim().length > 0) {
    return cleaned.trim();
  }
  return value.trim();
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
    const id = stegaClean(imageAssetId) as string | null;
    const ref = (typeof id === "string" ? id.trim() : "").length
      ? id
      : imageAssetId;
    // urlFor accepts a ref via {_ref}
    const u = urlFor({ _ref: ref as string })
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
  // Using global announce helper from lib/a11y/announce

  // Temporal dedupe state to prevent duplicate announcements
  const lastAnnouncementRef = React.useRef<{
    message: string;
    timestamp: number;
  } | null>(null);

  // FoxyCart loader readiness state
  const [isLoaderReady, setIsLoaderReady] = React.useState(false);

  // Helper to check and update announcement dedupe
  const shouldAnnounce = React.useCallback(
    (message: string, thresholdMs = 400): boolean => {
      const now = Date.now();
      const last = lastAnnouncementRef.current;

      if (
        last &&
        last.message === message &&
        now - last.timestamp < thresholdMs
      ) {
        return false; // Skip duplicate announcement
      }

      lastAnnouncementRef.current = { message, timestamp: now };
      return true;
    },
    [],
  );

  // Listen for FoxyCart loader readiness
  React.useEffect(() => {
    const checkReady = () => {
      try {
        if (
          typeof (window as any).FC !== "undefined" &&
          (window as any).FC.client
        ) {
          (window as any).FC.client.on("ready.done", () => {
            setIsLoaderReady(true);
          });
          // Also check if already ready
          if ((window as any).FC.client.ready) {
            setIsLoaderReady(true);
          }
        }
      } catch {
        // FoxyCart not available yet, will retry
      }
    };

    // Check immediately
    checkReady();

    // Also check after a short delay to catch late loading
    const timer = setTimeout(checkReady, 100);

    return () => clearTimeout(timer);
  }, []);

  React.useEffect(() => {
    const successEvents = [
      "fc-cart-item-add",
      "fc-cart-item-added",
      "fc::cart-item-add",
      "fc::cart-item-added",
    ];

    function handleSidecartSuccess(event: Event) {
      const detail = (event as CustomEvent<SidecartSuccessDetail>).detail;
      if (!detail || detail.error) {
        return;
      }

      const quantityCandidates: readonly unknown[] = [
        detail.quantity,
        detail.total_item_count,
        detail.item?.quantity,
        detail.item?.quantity_total,
      ];
      let parsedQuantity: number | null = null;
      for (const candidate of quantityCandidates) {
        const parsed = tryParseQuantity(candidate);
        if (parsed != null) {
          parsedQuantity = parsed;
          break;
        }
      }

      const nameCandidates: readonly unknown[] = [
        detail.name,
        detail.item?.name,
        detail.item?.product_name,
      ];
      const productName = nameCandidates
        .map(sanitizeText)
        .find((candidate) => candidate.length > 0);

      const quantityText =
        parsedQuantity != null
          ? parsedQuantity === 1
            ? "1 item"
            : `${parsedQuantity} items`
          : null;

      let message: string;
      if (productName && parsedQuantity != null) {
        message = `Added ${quantityText} of ${productName} to your cart.`;
      } else if (productName) {
        message = `Added ${productName} to your cart.`;
      } else if (parsedQuantity != null) {
        message = `Added ${quantityText} to your cart.`;
      } else {
        message = "Item added to your cart.";
      }

      if (shouldAnnounce(message)) {
        announce(message, "polite");
      }
    }

    successEvents.forEach((eventName) => {
      document.addEventListener(
        eventName,
        handleSidecartSuccess as EventListener,
      );
    });

    return () => {
      successEvents.forEach((eventName) => {
        document.removeEventListener(
          eventName,
          handleSidecartSuccess as EventListener,
        );
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    function onAddToCart(evt: Event) {
      const e = evt as CustomEvent<AddToCartDetail>;
      const detail = e.detail || {};

      // Env checks
      if (!foxyConfig) {
        const errorMessage =
          "Foxycart: NEXT_PUBLIC_FOXY_DOMAIN is not set; skipping add-to-cart.";
        console.error(errorMessage);
        announce(errorMessage, "assertive");
        return;
      }

      const { cartDomain } = foxyConfig;

      // Required fields
      const sku = detail.sku ?? null;
      const price = formatPriceUSD(detail.unitPrice);
      const quantity = clampQuantity(detail.quantity ?? 1);

      if (!sku || typeof sku !== "string" || sku.trim().length === 0) {
        const errorMessage =
          "Foxycart: Missing SKU for product; cannot add to cart.";
        console.error(errorMessage);
        announce(errorMessage, "assertive");
        return;
      }

      if (price == null) {
        const errorMessage =
          "Foxycart: Invalid price for product; cannot add to cart.";
        console.error(errorMessage);
        announce(errorMessage, "assertive");
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
        const raw = (detail.slug ?? "").replace(/^\/+|\/+$/g, "");
        const segs = raw.split("/").filter(Boolean).map(encodeURIComponent);
        const slug = segs.join("/");
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

      // Temporarily omit category to bypass invalid category errors during testing
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
        // Announce intention immediately for SR users
        const readableName = name || sku;
        const addingMessage = `Adding ${quantity} ${readableName}${quantity > 1 ? "s" : ""} to cart`;

        if (shouldAnnounce(addingMessage)) {
          announce(addingMessage, "polite");
        }
        document.body.appendChild(form);

        // Wait for FoxyCart loader to be ready before submitting
        const submitForm = () => {
          if ("requestSubmit" in form) {
            (
              form as HTMLFormElement & { requestSubmit: () => void }
            ).requestSubmit();
          } else {
            const ev = new Event("submit", { bubbles: true, cancelable: true });
            if (!(form as HTMLFormElement).dispatchEvent(ev)) return;
            (form as HTMLFormElement).submit();
          }
        };

        if (isLoaderReady) {
          // Loader is ready, submit immediately
          submitForm();
        } else {
          // Wait for loader to be ready
          const readyCheck = () => {
            if (isLoaderReady) {
              submitForm();
            } else {
              setTimeout(readyCheck, 50);
            }
          };
          setTimeout(readyCheck, 50);
        }
      } catch (err) {
        console.error("Foxycart: Form submission failed", err);
        const errorMessage = "Sorry, could not add to cart";
        if (shouldAnnounce(errorMessage)) {
          announce(errorMessage, "assertive");
        }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [foxyConfig]);

  return null;
}
