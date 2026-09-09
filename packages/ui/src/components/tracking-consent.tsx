"use client";

import { useEffect, useSyncExternalStore } from "react";

import type { TrackingPermission } from "../lib/iubenda";

declare global {
  interface Window {
    __dgTracking?: { permission: TrackingPermission };
    __dgGaId?: string;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("dg:tracking-change", onChange);
  return () => window.removeEventListener("dg:tracking-change", onChange);
}

function getSnapshot(): TrackingPermission {
  return window.__dgTracking?.permission ?? "pending";
}

function getServerSnapshot(): TrackingPermission {
  return "pending";
}

// One document-scoped owner survives client routing and callbacks before hydration.
export function useTrackingPermission(): TrackingPermission {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function TrackingAnalytics({ gaId }: { gaId?: string }) {
  const permission = useTrackingPermission();
  useEffect(() => {
    if (permission !== "allowed" || !gaId || window.__dgGaId === gaId) return;
    window.__dgGaId = gaId;
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        // Google's gtag queue uses an Arguments object, not an event array.
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments);
      };
    window.gtag("js", new Date());
    window.gtag("config", gaId);
    const script = document.createElement("script");
    script.id = "dg-google-analytics";
    // This gate owns GA activation. Otherwise Iubenda can reactivate the same
    // script on a preference save. Set the exclusion BEFORE setting src.
    script.setAttribute("data-cmp-ab", "1");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    document.head.appendChild(script);
    // Do not remove a loaded script on React cleanup: it cannot unload GA.
    // The document controller disables GA and reloads after withdrawal is saved.
  }, [gaId, permission]);
  return null;
}
