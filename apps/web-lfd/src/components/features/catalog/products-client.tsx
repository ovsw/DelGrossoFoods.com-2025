"use client";
import type { BadgeVariant } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
// (checkbox/radio rendered via shared primitives)
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { CheckboxList } from "@/components/elements/filterable/checkbox-list";
import { FilterGroupSection } from "@/components/elements/filterable/filter-group-section";
import { FilterableListLayout } from "@/components/elements/filterable/filterable-list-layout";
import { RadioList } from "@/components/elements/filterable/radio-list";
import { SearchField } from "@/components/elements/filterable/search-field";
import { SortDropdown } from "@/components/elements/filterable/sort-dropdown";
import { ProductCard } from "@/components/elements/product-card";
import { packagingMap, type PackagingSlug } from "@/config/product-taxonomy";
import { allTypeSlugs, typeMap, type TypeSlug } from "@/config/sauce-taxonomy";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useFirstPaint } from "@/hooks/use-first-paint";
import { useUrlStateSync } from "@/hooks/use-url-state-sync";
import { applyFiltersAndSort } from "@/lib/products/filters";
import {
  parseSearchParams,
  type ProductQueryState,
  serializeStateToParams,
} from "@/lib/products/url";
import type { ProductListItem, SortOrder } from "@/types";

type FiltersFormProps = {
  idPrefix?: string;
  search: string;
  setSearch: (v: string) => void;
  packaging: PackagingSlug[];
  togglePackaging: (p: PackagingSlug, checked: boolean) => void;
  sauceType: ProductQueryState["sauceType"];
  setSauceType: (v: ProductQueryState["sauceType"]) => void;
  clearPackaging: () => void;
  clearSauceType: () => void;
};

// Strongly-typed map from sauce type slug → Badge variant
const sauceTypeToBadgeVariant: Record<TypeSlug, BadgeVariant> = {
  pasta: "pasta",
  pizza: "pizza",
  salsa: "salsa",
  sandwich: "sandwich",
};

function FiltersForm({
  idPrefix = "filters",
  search,
  setSearch,
  packaging,
  togglePackaging,
  sauceType,
  setSauceType,
  clearPackaging,
  clearSauceType,
}: FiltersFormProps) {
  const searchId = `${idPrefix}-product-search`;
  return (
    <div>
      <SearchField
        id={searchId}
        label="Search"
        value={search}
        onChange={setSearch}
        placeholder="Search"
        ariaLabel="Search products"
        visuallyHideLabel
      />

      <div className="my-4 border-b border-input" />

      <FilterGroupSection
        title="Packaging"
        showClear={packaging.length > 0}
        onClear={clearPackaging}
        contentClassName=""
      >
        <CheckboxList
          items={(Object.keys(packagingMap) as PackagingSlug[]).map((slug) => ({
            id: `${idPrefix}-packaging-${slug}`,
            label: packagingMap[slug].display,
            checked: packaging.includes(slug),
            ariaLabel: packagingMap[slug].display,
          }))}
          onToggle={(id, checked) => {
            const slug = id.replace(
              `${idPrefix}-packaging-`,
              "",
            ) as PackagingSlug;
            togglePackaging(slug, checked);
          }}
        />
      </FilterGroupSection>

      <div className="my-4 border-b border-input" />

      <FilterGroupSection
        title="Sauce Type"
        showClear={sauceType !== "all"}
        onClear={clearSauceType}
        contentClassName=""
      >
        <RadioList
          value={sauceType}
          onChange={(v) => setSauceType(v as ProductQueryState["sauceType"])}
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
              label: typeMap[slug as keyof typeof typeMap].display,
              ariaLabel: typeMap[slug as keyof typeof typeMap].display,
            })),
            {
              id: `${idPrefix}-sauce-type-mix`,
              value: "mix",
              label: "Mix",
              ariaLabel: "Mix",
            },
          ]}
        />
      </FilterGroupSection>
    </div>
  );
}

type Props = {
  readonly items: ProductListItem[];
  readonly initialState: ProductQueryState;
};

export function ProductsClient({ items, initialState }: Props) {
  const pathname = usePathname();

  const [search, setSearch] = useState<string>(initialState.search);
  const [packaging, setPackaging] = useState<PackagingSlug[]>([
    ...initialState.packaging,
  ]);
  const [sauceType, setSauceType] = useState<ProductQueryState["sauceType"]>(
    initialState.sauceType,
  );
  const [sort, setSort] = useState<SortOrder>(initialState.sort);

  const applyingPopStateRef = useRef(false);
  useEffect(() => {
    function handlePopState() {
      applyingPopStateRef.current = true;
      try {
        const sp = new URLSearchParams(window.location.search);
        const params: Record<string, string | string[] | undefined> = {};
        sp.forEach((value, key) => {
          if (params[key] === undefined) params[key] = value;
          else
            params[key] = ([] as string[])
              .concat(params[key] as string[])
              .concat(value);
        });
        const next = parseSearchParams(params);
        setSearch(next.search);
        setPackaging([...next.packaging]);
        setSauceType(next.sauceType);
        setSort(next.sort);
      } finally {
        setTimeout(() => {
          applyingPopStateRef.current = false;
        }, 0);
      }
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const debouncedSearch = useDebouncedValue(search, 200);

  const state: ProductQueryState = useMemo(
    () => ({
      search: debouncedSearch,
      packaging,
      sauceType,
      sort,
    }),
    [debouncedSearch, packaging, sauceType, sort],
  );

  useUrlStateSync({
    pathname,
    state,
    serialize: serializeStateToParams,
    suppress: applyingPopStateRef.current,
  });

  const results = useMemo(
    () => applyFiltersAndSort(items, state),
    [items, state],
  );
  const initialResults = useMemo(
    () => applyFiltersAndSort(items, initialState),
    [items, initialState],
  );

  const firstPaint = useFirstPaint();
  const effectiveResults = firstPaint ? initialResults : results;

  const totalCount = items.length;
  const resultsCount = effectiveResults.length;
  const filtersActive =
    Boolean(search) || packaging.length > 0 || sauceType !== "all";
  const scrollKey = JSON.stringify({
    search: debouncedSearch,
    packaging,
    sauceType,
    sort,
  });

  function clearAll() {
    setSearch("");
    setPackaging([]);
    setSauceType("all");
    setSort("az");
  }
  function clearPackaging() {
    setPackaging([]);
  }
  function clearSauceType() {
    setSauceType("all");
  }
  function togglePackaging(p: PackagingSlug, checked: boolean) {
    setPackaging((prev) => {
      if (checked) {
        return prev.includes(p) ? prev : [...prev, p];
      }
      return prev.filter((x) => x !== p);
    });
  }
  return (
    <FilterableListLayout
      renderFilters={({ idPrefix }) => (
        <FiltersForm
          idPrefix={idPrefix}
          search={search}
          setSearch={setSearch}
          packaging={packaging}
          togglePackaging={togglePackaging}
          sauceType={sauceType}
          setSauceType={setSauceType}
          clearPackaging={clearPackaging}
          clearSauceType={clearSauceType}
        />
      )}
      resultsCount={resultsCount}
      resultsTotal={totalCount}
      isAnyActive={filtersActive}
      onClearAll={clearAll}
      activeChips={[
        ...packaging.map((slug) => ({
          key: `pkg-${slug}`,
          text: packagingMap[slug].display,
          variant: "neutral" as const,
          onRemove: () => togglePackaging(slug, false),
        })),
        ...(sauceType !== "all" && sauceType !== "mix"
          ? [
              {
                key: `type-${sauceType}`,
                text: typeMap[sauceType].display,
                variant: sauceTypeToBadgeVariant[sauceType] ?? "neutral",
                onRemove: () => setSauceType("all"),
              },
            ]
          : []),
      ]}
      scrollToTopKey={scrollKey}
      skipScroll={firstPaint}
      sortControl={
        <SortDropdown
          value={sort}
          onChange={(v) => setSort(v)}
          className="ms-auto"
        />
      }
    >
      {resultsCount === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No products match your filters.
          </p>
          <Button type="button" onClick={clearAll} className="cursor-pointer">
            Clear all
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12">
          {effectiveResults.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </FilterableListLayout>
  );
}
