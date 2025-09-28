"use client";

import { useEffect } from "react";

/**
 * Ensures Next.js' internal App Router announcer stays under <body> even if
 * third-party scripts (e.g., overlays, sidecarts) reparent DOM nodes.
 *
 * This prevents NotFoundError from Next's cleanup when it tries to remove the
 * announcer from document.body after it has been moved elsewhere.
 */
export function AnnouncerGuard(): null {
  useEffect(() => {
    let disconnected = false;

    const ensureUnderBody = () => {
      if (disconnected) return;
      try {
        const el = document.getElementsByTagName("next-route-announcer")[0] as
          | HTMLElement
          | undefined;
        if (!el) return;
        if (el.parentElement !== document.body) {
          document.body.appendChild(el);
        }
      } catch {
        // ignore
      }
    };

    // Run once immediately and then observe DOM changes.
    ensureUnderBody();
    const mo = new MutationObserver(ensureUnderBody);
    try {
      mo.observe(document.documentElement, { subtree: true, childList: true });
    } catch {
      // ignore
    }
    return () => {
      disconnected = true;
      mo.disconnect();
    };
  }, []);

  return null;
}
