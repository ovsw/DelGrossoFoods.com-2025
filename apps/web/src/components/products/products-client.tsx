"use client";
import type { BadgeVariant } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
// (checkbox/radio rendered via shared primitives)
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { CheckboxList } from "@/components/filterable/checkbox-list";
import { FilterGroupSection } from "@/components/filterable/filter-group-section";
import { FilterableListLayout } from "@/components/filterable/filterable-list-layout";
import { RadioList } from "@/components/filterable/radio-list";
import { SearchField } from "@/components/filterable/search-field";
import { SortDropdown } from "@/components/filterable/sort-dropdown";
import { ProductCard } from "@/components/products/product-card";
import { packagingMap, type PackagingSlug } from "@/config/product-taxonomy";
import {
  allLineSlugs,
  allTypeSlugs,
  lineMap,
  type LineSlug,
  typeMap,
  type TypeSlug,
} from "@/config/sauce-taxonomy";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useFirstPaint } from "@/hooks/use-first-paint";
import { useUrlStateSync } from "@/hooks/use-url-state-sync";
import { applyFiltersAndSort } from "@/lib/products/filters";
import {
  type ProductQueryState,
  serializeStateToParams,
} from "@/lib/products/url";
import type { ProductListItem, SortOrder } from "@/types";

type FiltersFormProps = {
  idPrefix?: string;
  search: string;
  setSearch: (v: string) => void;
  packaging: PackagingSlug[];
  togglePackaging: (p: PackagingSlug) => void;
  productLine: LineSlug[];
  toggleLine: (line: LineSlug) => void;
  sauceType: ProductQueryState["sauceType"];
  setSauceType: (v: ProductQueryState["sauceType"]) => void;
  clearPackaging: () => void;
  clearProductLine: () => void;
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
  productLine,
  toggleLine,
  sauceType,
  setSauceType,
  clearPackaging,
  clearProductLine,
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
        placeholder="Search by name or description"
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
          onToggle={(id) => {
            const slug = id.replace(
              `${idPrefix}-packaging-`,
              "",
            ) as PackagingSlug;
            togglePackaging(slug);
          }}
        />
      </FilterGroupSection>

      <div className="my-4 border-b border-input" />

      <FilterGroupSection
        title="Product Line"
        showClear={productLine.length > 0}
        onClear={clearProductLine}
        contentClassName=""
      >
        <CheckboxList
          items={allLineSlugs.map((slug) => ({
            id: `${idPrefix}-line-${slug}`,
            label: lineMap[slug].display,
            checked: productLine.includes(slug),
            ariaLabel: lineMap[slug].display,
          }))}
          onToggle={(id) => {
            const slug = id.replace(`${idPrefix}-line-`, "") as LineSlug;
            toggleLine(slug);
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
  const [productLine, setProductLine] = useState<LineSlug[]>([
    ...initialState.productLine,
  ]);
  const [sauceType, setSauceType] = useState<ProductQueryState["sauceType"]>(
    initialState.sauceType,
  );
  const [sort, setSort] = useState<SortOrder>(initialState.sort);

  const debouncedSearch = useDebouncedValue(search, 200);

  const state: ProductQueryState = useMemo(
    () => ({
      search: debouncedSearch,
      packaging,
      productLine,
      sauceType,
      sort,
    }),
    [debouncedSearch, packaging, productLine, sauceType, sort],
  );

  useUrlStateSync({ pathname, state, serialize: serializeStateToParams });

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
    Boolean(search) ||
    packaging.length > 0 ||
    productLine.length > 0 ||
    sauceType !== "all";
  const scrollKey = JSON.stringify({
    search: debouncedSearch,
    packaging,
    productLine,
    sauceType,
    sort,
  });

  function clearAll() {
    setSearch("");
    setPackaging([]);
    setProductLine([]);
    setSauceType("all");
    setSort("az");
  }
  function clearPackaging() {
    setPackaging([]);
  }
  function clearProductLine() {
    setProductLine([]);
  }
  function clearSauceType() {
    setSauceType("all");
  }
  function togglePackaging(p: PackagingSlug) {
    setPackaging((prev) =>
      prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p],
    );
  }
  function toggleLine(line: LineSlug) {
    setProductLine((prev) =>
      prev.includes(line) ? prev.filter((l) => l !== line) : [...prev, line],
    );
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
          productLine={productLine}
          toggleLine={toggleLine}
          sauceType={sauceType}
          setSauceType={setSauceType}
          clearPackaging={clearPackaging}
          clearProductLine={clearProductLine}
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
          onRemove: () => togglePackaging(slug),
        })),
        ...productLine.map((slug) => ({
          key: `line-${slug}`,
          text: lineMap[slug].display,
          variant: slug,
          onRemove: () => toggleLine(slug),
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
