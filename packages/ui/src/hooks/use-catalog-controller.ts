"use client";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

type CatalogSearchParams = Record<string, string | string[] | undefined>;

type UseCatalogControllerArgs<TState, TQueryState, TItem> = {
  setState: React.Dispatch<React.SetStateAction<TState>>;
  queryState: TQueryState;
  initialState: TState;
  initialQueryState?: TQueryState;
  items: TItem[];
  parseSearchParams: (params: CatalogSearchParams) => TState;
  serializeState: (state: TQueryState) => URLSearchParams;
  applyFiltersAndSort: (items: TItem[], state: TQueryState) => TItem[];
  scrollStateSelector?: (state: TQueryState) => unknown;
};

type UseCatalogControllerReturn<TQueryState, TItem> = {
  results: TItem[];
  initialResults: TItem[];
  effectiveResults: TItem[];
  resultsCount: number;
  totalCount: number;
  firstPaint: boolean;
  scrollKey: string;
  skipScroll: boolean;
  queryState: TQueryState;
};

function searchParamsToRecord(params: URLSearchParams): CatalogSearchParams {
  const record: CatalogSearchParams = {};
  params.forEach((value, key) => {
    const current = record[key];
    if (current === undefined) {
      record[key] = value;
      return;
    }
    if (Array.isArray(current)) {
      current.push(value);
      return;
    }
    record[key] = [current, value];
  });
  return record;
}

export function useCatalogController<TState, TQueryState, TItem>({
  setState,
  queryState,
  initialState,
  initialQueryState,
  items,
  parseSearchParams,
  serializeState,
  applyFiltersAndSort,
  scrollStateSelector,
}: UseCatalogControllerArgs<
  TState,
  TQueryState,
  TItem
>): UseCatalogControllerReturn<TQueryState, TItem> {
  const pathname = usePathname();
  const [firstPaint, setFirstPaint] = useState(true);
  useEffect(() => setFirstPaint(false), []);

  const applyingPopStateRef = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;

    function handlePopState() {
      applyingPopStateRef.current = true;
      try {
        const params = new URLSearchParams(window.location.search);
        const next = parseSearchParams(searchParamsToRecord(params));
        setState(next);
      } finally {
        setTimeout(() => {
          applyingPopStateRef.current = false;
        }, 0);
      }
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [parseSearchParams, setState]);

  const isFirstSyncRef = useRef(true);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (applyingPopStateRef.current) return;

    const basePath = pathname ?? window.location.pathname;
    const params = serializeState(queryState);
    const query = params.toString();
    const targetUrl = query ? `${basePath}?${query}` : basePath;
    const currentUrl = `${window.location.pathname}${window.location.search}`;

    if (isFirstSyncRef.current) {
      isFirstSyncRef.current = false;
      if (targetUrl !== currentUrl) {
        window.history.replaceState(window.history.state, "", targetUrl);
      }
      return;
    }

    if (targetUrl !== currentUrl) {
      window.history.pushState(window.history.state, "", targetUrl);
    }
  }, [pathname, queryState, serializeState]);

  const initialQuerySnapshot = useMemo(() => {
    if (initialQueryState) return initialQueryState;
    return initialState as unknown as TQueryState;
  }, [initialQueryState, initialState]);

  const results = useMemo(
    () => applyFiltersAndSort(items, queryState),
    [items, queryState, applyFiltersAndSort],
  );
  const initialResults = useMemo(
    () => applyFiltersAndSort(items, initialQuerySnapshot),
    [items, initialQuerySnapshot, applyFiltersAndSort],
  );

  const effectiveResults = firstPaint ? initialResults : results;
  const totalCount = items.length;
  const resultsCount = effectiveResults.length;

  const scrollState = useMemo(
    () => (scrollStateSelector ? scrollStateSelector(queryState) : queryState),
    [scrollStateSelector, queryState],
  );
  const scrollKey = useMemo(() => JSON.stringify(scrollState), [scrollState]);

  return {
    results,
    initialResults,
    effectiveResults,
    resultsCount,
    totalCount,
    firstPaint,
    scrollKey,
    skipScroll: firstPaint,
    queryState,
  };
}

export type {
  CatalogSearchParams,
  UseCatalogControllerArgs,
  UseCatalogControllerReturn,
};
