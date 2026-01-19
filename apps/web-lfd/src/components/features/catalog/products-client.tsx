"use client";
import type { BadgeVariant } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { CatalogFilterableListLayout } from "@workspace/ui/components/catalog-filterable-list-layout";
import { CheckboxList } from "@workspace/ui/components/checkbox-list";
import { RadioList } from "@workspace/ui/components/radio-list";
import { SearchField } from "@workspace/ui/components/search-field";
import { SortDropdown } from "@workspace/ui/components/sort-dropdown";
import { useCatalogController } from "@workspace/ui/hooks/use-catalog-controller";
// (checkbox/radio rendered via shared primitives)
import { useEffect, useMemo, useState } from "react";

import { FilterGroupSection } from "@/components/elements/filterable/filter-group-section";
import { ProductCard } from "@/components/elements/product-card";
import { packagingMap, type PackagingSlug } from "@/config/product-taxonomy";
import { allTypeSlugs, typeMap, type TypeSlug } from "@/config/sauce-taxonomy";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { applyFiltersAndSort } from "@/lib/products/filters";
import {
  parseSearchParams,
  type ProductQueryState,
  serializeStateToParams,
} from "@/lib/products/url";
import type { ProductListItem } from "@/types";

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
  const [filters, setFilters] = useState<ProductQueryState>(initialState);
  useEffect(() => {
    setFilters(initialState);
  }, [initialState]);

  const debouncedSearch = useDebouncedValue(filters.search, 200);
  const queryState = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch,
    }),
    [filters, debouncedSearch],
  );

  const { effectiveResults, resultsCount, totalCount, scrollKey, skipScroll } =
    useCatalogController({
      setState: setFilters,
      queryState,
      initialState,
      items,
      parseSearchParams,
      serializeState: serializeStateToParams,
      applyFiltersAndSort,
      scrollStateSelector: (state) => ({
        search: state.search,
        packaging: state.packaging,
        sauceType: state.sauceType,
        sort: state.sort,
      }),
    });

  const filtersActive =
    Boolean(filters.search) ||
    filters.packaging.length > 0 ||
    filters.sauceType !== "all";

  function clearAll() {
    setFilters({
      search: "",
      packaging: [],
      sauceType: "all",
      sort: "az",
    });
  }
  function clearPackaging() {
    setFilters((prev) => ({ ...prev, packaging: [] }));
  }
  function clearSauceType() {
    setFilters((prev) => ({ ...prev, sauceType: "all" }));
  }
  function togglePackaging(p: PackagingSlug, checked: boolean) {
    setFilters((prev) => ({
      ...prev,
      packaging: checked
        ? prev.packaging.includes(p)
          ? prev.packaging
          : [...prev.packaging, p]
        : prev.packaging.filter((x) => x !== p),
    }));
  }
  return (
    <CatalogFilterableListLayout
      renderFilters={({ idPrefix }) => (
        <FiltersForm
          idPrefix={idPrefix}
          search={filters.search}
          setSearch={(value) =>
            setFilters((prev) => ({
              ...prev,
              search: value,
            }))
          }
          packaging={filters.packaging}
          togglePackaging={togglePackaging}
          sauceType={filters.sauceType}
          setSauceType={(value) =>
            setFilters((prev) => ({
              ...prev,
              sauceType: value,
            }))
          }
          clearPackaging={clearPackaging}
          clearSauceType={clearSauceType}
        />
      )}
      resultsCount={resultsCount}
      resultsTotal={totalCount}
      isAnyActive={filtersActive}
      onClearAll={clearAll}
      activeChips={[
        ...filters.packaging.map((slug) => ({
          key: `pkg-${slug}`,
          text: packagingMap[slug].display,
          variant: "neutral" as const,
          onRemove: () => togglePackaging(slug, false),
        })),
        ...(filters.sauceType !== "all" && filters.sauceType !== "mix"
          ? [
              {
                key: `type-${filters.sauceType}`,
                text: typeMap[filters.sauceType].display,
                variant:
                  sauceTypeToBadgeVariant[filters.sauceType] ?? "neutral",
                onRemove: () =>
                  setFilters((prev) => ({ ...prev, sauceType: "all" })),
              },
            ]
          : []),
      ]}
      scrollToTopKey={scrollKey}
      skipScroll={skipScroll}
      sortControl={
        <SortDropdown
          value={filters.sort}
          onChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              sort: value,
            }))
          }
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
            <ProductCard key={item._id} item={item} showBadges={false} />
          ))}
        </div>
      )}
    </CatalogFilterableListLayout>
  );
}
