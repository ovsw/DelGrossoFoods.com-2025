"use client";
import type { BadgeVariant } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { FilterableListLayout } from "@/components/filterable/filterable-list-layout";
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
}: FiltersFormProps) {
  const searchId = `${idPrefix}-product-search`;
  const legendClass = "px-0 text-lg font-semibold";
  return (
    <div className="space-y-6">
      <div
        aria-live="polite"
        aria-atomic="true"
        className="text-muted-foreground"
      >
        {resultsText}
      </div>
      <div className="my-4 border-b border-input" />
      <div>
        <label htmlFor={searchId} className="block text-xl font-medium">
          Search
        </label>
        <div className="mt-2 flex items-center gap-2">
          <input
            id={searchId}
            type="search"
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            className="w-full rounded-md border border-input bg-white/70 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            placeholder="Search by name or description"
            aria-label="Search products"
          />
          {search ? (
            <Button
              type="button"
              variant="secondary"
              onClick={() => setSearch("")}
            >
              Clear
            </Button>
          ) : null}
        </div>
      </div>

      <div className="my-4 border-b border-input" />

      <fieldset className="m-0 border-0 p-0 my-4">
        <legend className={legendClass}>Packaging</legend>
        <div className="mt-2 grid grid-cols-1 gap-2">
          {(Object.keys(packagingMap) as PackagingSlug[]).map((slug) => {
            const id = `${idPrefix}-packaging-${slug}`;
            const cfg = packagingMap[slug];
            const checked = packaging.includes(slug);
            return (
              <label
                key={slug}
                htmlFor={id}
                className="flex items-center gap-2"
              >
                <Checkbox
                  id={id}
                  checked={checked}
                  onCheckedChange={() => togglePackaging(slug)}
                  aria-label={cfg.display}
                />
                <span>{cfg.display}</span>
              </label>
            );
          })}
        </div>
        {packaging.length > 0 ? (
          <div className="mt-2">
            <Button type="button" variant="ghost" onClick={clearPackaging}>
              Clear
            </Button>
          </div>
        ) : null}
      </fieldset>

      <div className="my-4 border-b border-input" />

      <fieldset className="m-0 border-0 p-0 my-4">
        <legend className={legendClass}>Product Line</legend>
        <div className="mt-2 grid grid-cols-1 gap-2">
          {allLineSlugs.map((slug) => {
            const id = `${idPrefix}-line-${slug}`;
            const cfg = lineMap[slug];
            const checked = productLine.includes(slug);
            return (
              <label
                key={slug}
                htmlFor={id}
                className="flex items-center gap-2"
              >
                <Checkbox
                  id={id}
                  checked={checked}
                  onCheckedChange={() => toggleLine(slug)}
                  aria-label={cfg.display}
                />
                <span>{cfg.display}</span>
              </label>
            );
          })}
        </div>
        {productLine.length > 0 ? (
          <div className="mt-2">
            <Button type="button" variant="ghost" onClick={clearProductLine}>
              Clear
            </Button>
          </div>
        ) : null}
      </fieldset>

      <div className="my-4 border-b border-input" />

      <fieldset className="m-0 border-0 p-0 my-4">
        <legend className={legendClass}>Sauce Type</legend>
        <div className="mt-2 grid grid-cols-1 gap-2">
          <RadioGroup
            value={sauceType}
            onValueChange={(v: ProductQueryState["sauceType"]) =>
              setSauceType(v)
            }
          >
            <label
              className="flex items-center gap-2"
              htmlFor={`${idPrefix}-sauce-type-all`}
            >
              <RadioGroupItem
                id={`${idPrefix}-sauce-type-all`}
                value="all"
                aria-label="All"
              />
              <span>All</span>
            </label>
            {(allTypeSlugs as readonly string[]).map((slug) => {
              const id = `${idPrefix}-type-${slug}`;
              const cfg = typeMap[slug as keyof typeof typeMap];
              return (
                <label
                  key={slug}
                  htmlFor={id}
                  className="flex items-center gap-2"
                >
                  <RadioGroupItem
                    id={id}
                    value={slug}
                    aria-label={cfg.display}
                  />
                  <span>{cfg.display}</span>
                </label>
              );
            })}
            <label
              className="flex items-center gap-2"
              htmlFor={`${idPrefix}-sauce-type-mix`}
            >
              <RadioGroupItem
                id={`${idPrefix}-sauce-type-mix`}
                value="mix"
                aria-label="Mix"
              />
              <span>Mix</span>
            </label>
          </RadioGroup>
        </div>
        {sauceType !== "all" ? (
          <div className="mt-2">
            <Button type="button" variant="ghost" onClick={clearSauceType}>
              Clear
            </Button>
          </div>
        ) : null}
      </fieldset>

      <div className="my-4 border-b border-input" />

      <div className="flex items-center justify-between gap-2">
        <Button type="button" variant="secondary" onClick={clearAll}>
          Clear all
        </Button>
        {applyButton}
      </div>
    </div>
  );
}

type Props = {
  readonly items: ProductListItem[];
  readonly initialState: ProductQueryState;
};

function useDebouncedValue<T>(value: T, delay = 200): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

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

  useEffect(() => {
    const params = serializeStateToParams(state);
    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    if (typeof window !== "undefined") {
      window.history.replaceState(window.history.state, "", url);
    }
  }, [pathname, state]);

  const results = useMemo(
    () => applyFiltersAndSort(items, state),
    [items, state],
  );

  const [firstPaint, setFirstPaint] = useState(true);
  useEffect(() => setFirstPaint(false), []);

  const resultsText = `${results.length} of ${items.length}`;
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
      filters={({ idPrefix, applyButton }) => (
        <FiltersForm
          idPrefix={idPrefix}
          resultsText={
            firstPaint
              ? `Showing ${applyFiltersAndSort(items, initialState).length} of ${items.length}`
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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="secondary" className="ms-auto">
              Sort
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort by name</DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={sort}
              onValueChange={(v) => setSort((v as SortOrder) ?? "az")}
            >
              <DropdownMenuRadioItem value="az">A → Z</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="za">Z → A</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      }
    >
      {(firstPaint ? applyFiltersAndSort(items, initialState) : results)
        .length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No products match your filters.
          </p>
          <Button type="button" onClick={clearAll}>
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
