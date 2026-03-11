"use client";

import { stegaClean } from "next-sanity";
import * as React from "react";

import { announce } from "@/lib/a11y/announce";

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

export function FoxycartProvider() {
  // Temporal dedupe state to prevent duplicate announcements
  const lastAnnouncementRef = React.useRef<{
    message: string;
    timestamp: number;
  } | null>(null);

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
  }, [shouldAnnounce]);

  return null;
}
