"use client";
import { useEffect, useRef } from "react";

export type SerializeFn<S> = (state: S) => URLSearchParams;

type UseUrlStateSyncArgs<S> = {
  pathname: string | null | undefined;
  state: S;
  serialize: SerializeFn<S>;
  /** When true, do not modify history (used while applying popstate). */
  suppress?: boolean;
};

/**
 * Syncs a serializable state to the current URL's search params without
 * triggering a Next.js navigation.
 * - First run uses history.replaceState to avoid creating an extra entry on load
 * - Subsequent runs use history.pushState to preserve history for Back/Forward
 * - When suppress=true, does nothing (used to avoid push during popstate)
 */
export function useUrlStateSync<S>({
  pathname,
  state,
  serialize,
  suppress = false,
}: UseUrlStateSyncArgs<S>) {
  const isFirstRunRef = useRef(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (suppress) return;

    const basePath = pathname ?? window.location.pathname;
    const params = serialize(state);
    const query = params.toString();
    const targetUrl = query ? `${basePath}?${query}` : basePath;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (isFirstRunRef.current) {
      // Mark that the first non-suppressed run has occurred, regardless of equality
      isFirstRunRef.current = false;
      // Only normalize the URL on first run if it actually differs
      if (targetUrl !== currentUrl) {
        window.history.replaceState(window.history.state, "", targetUrl);
      }
      return;
    }

    // Subsequent runs: only push when URL actually changes
    if (targetUrl !== currentUrl) {
      window.history.pushState(window.history.state, "", targetUrl);
    }
  }, [pathname, state, serialize, suppress]);
}
