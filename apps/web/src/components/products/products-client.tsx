"use client";
import type { BadgeVariant } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { DrawerClose, DrawerFooter } from "@workspace/ui/components/drawer";
// (checkbox/radio rendered via shared primitives)
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { CheckboxList } from "@/components/filterable/checkbox-list";
import { ClearSection } from "@/components/filterable/clear-section";
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
  resultsText: string;
  search: string;
  setSearch: (v: string) => void;
  packaging: PackagingSlug[];
  togglePackaging: (p: PackagingSlug) => void;
  productLine: LineSlug[];
  toggleLine: (line: LineSlug) => void;
  sauceType: ProductQueryState["sauceType"];
  setSauceType: (v: ProductQueryState["sauceType"]) => void;
  clearAll: () => void;
  clearPackaging: () => void;
  clearProductLine: () => void;
  clearSauceType: () => void;
  applyButton?: React.ReactNode;
  setSheetHeaderRight?: (node: React.ReactNode) => void;
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
  resultsText,
  search,
  setSearch,
  packaging,
  togglePackaging,
  productLine,
  toggleLine,
  sauceType,
  setSauceType,
  clearAll,
  clearPackaging,
  clearProductLine,
  clearSauceType,
  applyButton,
  setSheetHeaderRight,
}: FiltersFormProps) {
  const searchId = `${idPrefix}-product-search`;
  const legendClass = "sr-only";
  const anyFiltersActive =
    Boolean(search) ||
    packaging.length > 0 ||
    productLine.length > 0 ||
    sauceType !== "all";
  useEffect(() => {
    if (idPrefix === "sheet" && setSheetHeaderRight) {
      setSheetHeaderRight(
        <ClearSection
          label="Clear all"
          show={anyFiltersActive}
          onClear={clearAll}
        />,
      );
    }
  }, [idPrefix, setSheetHeaderRight, anyFiltersActive, clearAll]);
  return (
    <div className="space-y-6">
      {idPrefix === "desktop" ? (
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Filters</h2>
          <ClearSection
            label="Clear all"
            show={anyFiltersActive}
            onClear={clearAll}
          />
        </div>
      ) : null}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="text-xs text-muted-foreground"
      >
        {resultsText}
      </div>
      <div className="my-4 border-b border-input" />
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

      <fieldset className="m-0 border-0 p-0 my-4">
        <legend className={legendClass}>Packaging</legend>
        <div className="flex items-center justify-between gap-2">
          <span className="px-0 text-lg font-semibold">Packaging</span>
          <ClearSection show={packaging.length > 0} onClear={clearPackaging} />
        </div>
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
      </fieldset>

      <div className="my-4 border-b border-input" />

      <fieldset className="m-0 border-0 p-0 my-4">
        <legend className={legendClass}>Product Line</legend>
        <div className="flex items-center justify-between gap-2">
          <span className="px-0 text-lg font-semibold">Product Line</span>
          <ClearSection
            show={productLine.length > 0}
            onClear={clearProductLine}
          />
        </div>
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
      </fieldset>

      <div className="my-4 border-b border-input" />

      <fieldset className="m-0 border-0 p-0 my-4">
        <legend className={legendClass}>Sauce Type</legend>
        <div className="flex items-center justify-between gap-2">
          <span className="px-0 text-lg font-semibold">Sauce Type</span>
          <ClearSection show={sauceType !== "all"} onClear={clearSauceType} />
        </div>
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
      </fieldset>

      <div className="my-4 border-b border-input" />
      {idPrefix === "sheet" ? (
        <DrawerFooter className="flex-row items-center justify-between gap-2">
          <Button
            type="button"
            variant="link"
            size="sm"
            className="px-0 h-auto cursor-pointer underline font-medium"
            onClick={clearAll}
          >
            Clear all
          </Button>
          <DrawerClose asChild>
            <Button type="button">Apply</Button>
          </DrawerClose>
        </DrawerFooter>
      ) : applyButton ? (
        <div className="mt-2">{applyButton}</div>
      ) : null}
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

  const firstPaint = useFirstPaint();

  const resultsText = `Showing ${results.length} out of ${items.length}`;
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
      filters={({ idPrefix, applyButton, setSheetHeaderRight }) => (
        <FiltersForm
          idPrefix={idPrefix}
          resultsText={
            firstPaint
              ? `Showing ${applyFiltersAndSort(items, initialState).length} out of ${items.length}`
              : resultsText
          }
          search={search}
          setSearch={setSearch}
          packaging={packaging}
          togglePackaging={togglePackaging}
          productLine={productLine}
          toggleLine={toggleLine}
          sauceType={sauceType}
          setSauceType={setSauceType}
          clearAll={clearAll}
          clearPackaging={clearPackaging}
          clearProductLine={clearProductLine}
          clearSauceType={clearSauceType}
          applyButton={applyButton}
          setSheetHeaderRight={setSheetHeaderRight}
        />
      )}
      resultsText={resultsText}
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
      {(firstPaint ? applyFiltersAndSort(items, initialState) : results)
        .length === 0 ? (
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
          {(firstPaint
            ? applyFiltersAndSort(items, initialState)
            : results
          ).map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </FilterableListLayout>
  );
}
