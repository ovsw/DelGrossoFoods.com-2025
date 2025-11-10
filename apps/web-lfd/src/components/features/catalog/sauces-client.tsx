"use client";
import { Button } from "@workspace/ui/components/button";
// (checkbox/radio rendered via shared primitives)
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { FilterGroupSection } from "@/components/elements/filterable/filter-group-section";
import { FilterableListLayout } from "@/components/elements/filterable/filterable-list-layout";
import { RadioList } from "@/components/elements/filterable/radio-list";
import { SearchField } from "@/components/elements/filterable/search-field";
import { SortDropdown } from "@/components/elements/filterable/sort-dropdown";
import { SauceCard } from "@/components/elements/sauce-card";
import {
  allTypeSlugs,
  getTypeBadge,
  typeMap,
  type TypeSlug,
} from "@/config/sauce-taxonomy";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useFirstPaint } from "@/hooks/use-first-paint";
import { useUrlStateSync } from "@/hooks/use-url-state-sync";
import { applyFiltersAndSort } from "@/lib/sauces/filters";
import {
  parseSearchParams,
  type SauceQueryState,
  serializeStateToParams,
} from "@/lib/sauces/url";
import type { SauceListItem, SortOrder } from "@/types";

type FiltersFormProps = {
  idPrefix?: string;
  search: string;
  setSearch: (v: string) => void;
  sauceType: SauceQueryState["sauceType"];
  setSauceType: (v: SauceQueryState["sauceType"]) => void;
  clearSauceType: () => void;
};

function isSauceType(value: string): value is SauceQueryState["sauceType"] {
  return value === "all" || (allTypeSlugs as readonly string[]).includes(value);
}

function FiltersForm({
  idPrefix = "filters",
  search,
  setSearch,
  sauceType,
  setSauceType,
  clearSauceType,
}: FiltersFormProps) {
  const searchId = `${idPrefix}-sauce-search`;
  return (
    <div>
      <SearchField
        id={searchId}
        label="Search"
        value={search}
        onChange={setSearch}
        placeholder="Search"
        ariaLabel="Search sauces"
        visuallyHideLabel
      />

      <hr className="my-4 border-input" />

      <FilterGroupSection
        title="Sauce Type"
        showClear={sauceType !== "all"}
        onClear={clearSauceType}
        contentClassName=""
      >
        <RadioList
          value={sauceType}
          onChange={(v) => setSauceType(isSauceType(v) ? v : "all")}
          items={[
            {
              id: `${idPrefix}-sauce-type-all`,
              value: "all",
              label: "All",
              ariaLabel: "All",
            },
            ...allTypeSlugs.map((slug) => ({
              id: `${idPrefix}-type-${slug}`,
              value: slug,
              label: typeMap[slug].display,
              ariaLabel: typeMap[slug].display,
            })),
          ]}
        />
      </FilterGroupSection>
    </div>
  );
}

type Props = {
  readonly items: SauceListItem[];
  readonly initialState: SauceQueryState;
};

export function SaucesClient({ items, initialState }: Props) {
  const pathname = usePathname();

  const [search, setSearch] = useState<string>(initialState.search);
  const [sauceType, setSauceType] = useState<SauceQueryState["sauceType"]>(
    initialState.sauceType,
  );
  const [sort, setSort] = useState<SortOrder>(initialState.sort);

  const applyingPopStateRef = useRef(false);

  // Apply URL -> state on browser back/forward within the listing page
  useEffect(() => {
    function handlePopState() {
      applyingPopStateRef.current = true;
      try {
        const sp = new URLSearchParams(window.location.search);
        const params: Record<string, string | string[] | undefined> = {};
        // collect repeated params as arrays
        sp.forEach((value, key) => {
          if (params[key] === undefined) params[key] = value;
          else
            params[key] = ([] as string[])
              .concat(params[key] as string[])
              .concat(value);
        });
        const next = parseSearchParams(params);
        setSearch(next.search);
        setSauceType(next.sauceType);
        setSort(next.sort);
      } finally {
        // allow one microtask/frame for state to settle before resuming URL sync
        setTimeout(() => {
          applyingPopStateRef.current = false;
        }, 0);
      }
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const debouncedSearch = useDebouncedValue(search, 200);

  const state: SauceQueryState = useMemo(
    () => ({ search: debouncedSearch, sauceType, sort }),
    [debouncedSearch, sauceType, sort],
  );

  // Sync URL on state changes without triggering a Next.js navigation
  useUrlStateSync({
    pathname,
    state,
    serialize: serializeStateToParams,
    suppress: applyingPopStateRef.current,
  });

  // Compute filtered and sorted results
  const results = useMemo(
    () => applyFiltersAndSort(items, state),
    [items, state],
  );
  const initialResults = useMemo(
    () => applyFiltersAndSort(items, initialState),
    [items, initialState],
  );
  // Avoid hydration flash: use SSR-computed initial results for first paint
  const firstPaint = useFirstPaint();
  const effectiveResults = firstPaint ? initialResults : results;

  const totalCount = items.length;
  const resultsCount = effectiveResults.length;
  const filtersActive = Boolean(search.trim()) || sauceType !== "all";
  const scrollKey = JSON.stringify({
    search: debouncedSearch,
    sauceType,
    sort,
  });

  const activeTypeChip =
    sauceType !== "all"
      ? {
          key: `type-${sauceType as TypeSlug}`,
          ...getTypeBadge(typeMap[sauceType as TypeSlug].label),
          onRemove: () => setSauceType("all"),
        }
      : null;

  function clearAll() {
    setSearch("");
    setSauceType("all");
    setSort("az");
  }

  function clearSauceType() {
    setSauceType("all");
  }

  return (
    <FilterableListLayout
      renderFilters={({ idPrefix }) => (
        <FiltersForm
          idPrefix={idPrefix}
          search={search}
          setSearch={setSearch}
          sauceType={sauceType}
          setSauceType={setSauceType}
          clearSauceType={clearSauceType}
        />
      )}
      resultsCount={resultsCount}
      resultsTotal={totalCount}
      isAnyActive={filtersActive}
      onClearAll={clearAll}
      activeChips={activeTypeChip ? [activeTypeChip] : []}
      scrollToTopKey={scrollKey}
      skipScroll={firstPaint}
      sortControl={
        <SortDropdown value={sort} onChange={setSort} className="ms-auto" />
      }
    >
      {resultsCount === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No sauces match your filters.
          </p>
          <Button type="button" onClick={clearAll} className="cursor-pointer">
            Clear all
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-y-12">
          {effectiveResults.map((item) => (
            <SauceCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </FilterableListLayout>
  );
}
