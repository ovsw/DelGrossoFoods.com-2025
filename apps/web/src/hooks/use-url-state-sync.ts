"use client";
import { useEffect } from "react";

export type SerializeFn<S> = (state: S) => URLSearchParams;

type UseUrlStateSyncArgs<S> = {
  pathname: string | null | undefined;
  state: S;
  serialize: SerializeFn<S>;
};

/**
 * Syncs a serializable state to the current URL's search params without
 * triggering a Next.js navigation. Uses history.replaceState in the browser.
 */
export function useUrlStateSync<S>({
  pathname,
  state,
  serialize,
}: UseUrlStateSyncArgs<S>) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const basePath = pathname ?? window.location.pathname;
    const params = serialize(state);
    const query = params.toString();
    const targetUrl = query ? `${basePath}?${query}` : basePath;
    const currentUrl = `${window.location.pathname}${window.location.search}`;
    if (targetUrl === currentUrl) return;
    window.history.replaceState(window.history.state, "", targetUrl);
  }, [pathname, state, serialize]);
}
