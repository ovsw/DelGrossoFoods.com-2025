"use client";

import { useEffect, useRef, useState } from "react";

export type A11yAnnouncementDetail = {
  message: string;
  politeness?: "polite" | "assertive";
  atomic?: boolean;
};

/**
 * A resilient app-level live announcer that attaches a shadow-hosted live
 * region under <body> and listens for `a11y:announce` CustomEvents.
 *
 * Usage:
 *   document.dispatchEvent(new CustomEvent("a11y:announce", { detail: { message, politeness: "polite" } }));
 */
export function A11yLiveAnnouncer(): null {
  const [hostEl, setHostEl] = useState<HTMLElement | null>(null);
  const politeRef = useRef<HTMLElement | null>(null);
  const assertiveRef = useRef<HTMLElement | null>(null);
  const seqRef = useRef(0);

  useEffect(() => {
    // Create a shadow host to minimize CSS bleed and keep it under <body>
    const container = document.createElement("app-live-announcer");
    container.style.cssText = "position:absolute";
    const shadow = container.attachShadow({ mode: "open" });

    const polite = document.createElement("div");
    polite.setAttribute("role", "status");
    polite.setAttribute("aria-live", "polite");
    polite.setAttribute("aria-atomic", "true");
    polite.style.cssText =
      "position:absolute;border:0;height:1px;margin:-1px;padding:0;width:1px;clip:rect(0 0 0 0);overflow:hidden;white-space:nowrap;word-wrap:normal";

    const assertive = document.createElement("div");
    assertive.setAttribute("role", "alert");
    assertive.setAttribute("aria-live", "assertive");
    assertive.setAttribute("aria-atomic", "true");
    assertive.style.cssText = polite.style.cssText;

    shadow.appendChild(polite);
    shadow.appendChild(assertive);
    document.body.appendChild(container);

    setHostEl(container);
    politeRef.current = polite;
    assertiveRef.current = assertive;

    // Keep it anchored under <body> even if reparented by overlays
    const mo = new MutationObserver(() => {
      if (!container.isConnected || container.parentElement !== document.body) {
        try {
          document.body.appendChild(container);
        } catch {
          // ignore
        }
      }
    });
    try {
      mo.observe(document.documentElement, { childList: true, subtree: true });
    } catch {
      // ignore
    }

    return () => {
      mo.disconnect();
      try {
        if (container.parentNode) container.remove();
      } catch {
        // ignore
      }
    };
  }, []);

  useEffect(() => {
    function onAnnounce(evt: Event) {
      const e = evt as CustomEvent<A11yAnnouncementDetail>;
      const d = e.detail;
      if (!d || !d.message) return;
      const politeness = d.politeness ?? "polite";
      const target =
        politeness === "assertive" ? assertiveRef.current : politeRef.current;
      if (!target) return;

      // Bump a seq to ensure screen readers re-announce identical messages
      seqRef.current = (seqRef.current + 1) % 1000;
      const suffix = ` ${seqRef.current}`; // visually hidden

      try {
        target.textContent = `${d.message}${suffix}`;
        // Clear after a short delay to allow repeated announcements later
        window.setTimeout(() => {
          if (target.textContent?.endsWith(suffix)) target.textContent = "";
        }, 1500);
      } catch {
        // ignore
      }
    }

    document.addEventListener("a11y:announce", onAnnounce as EventListener);
    return () => {
      document.removeEventListener(
        "a11y:announce",
        onAnnounce as EventListener,
      );
    };
  }, [hostEl]);

  return null;
}
