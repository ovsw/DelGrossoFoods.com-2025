"use client";
import { Button } from "@workspace/ui/components/button";
import { Checkbox } from "@workspace/ui/components/checkbox";
// Drawer is now encapsulated in the shared FilterableListLayout
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
import { SauceCard } from "@/components/sauce-card";
import {
  allLineSlugs,
  allTypeSlugs,
  lineMap,
  type LineSlug,
  typeMap,
} from "@/config/sauce-taxonomy";
import { applyFiltersAndSort } from "@/lib/sauces/filters";
import { type SauceQueryState, serializeStateToParams } from "@/lib/sauces/url";
import type { SauceListItem, SortOrder } from "@/types";

type FiltersFormProps = {
  idPrefix?: string;
  resultsText: string;
  search: string;
  setSearch: (v: string) => void;
  productLine: LineSlug[];
  toggleLine: (line: LineSlug) => void;
  sauceType: SauceQueryState["sauceType"];
  setSauceType: (v: SauceQueryState["sauceType"]) => void;
  clearAll: () => void;
  clearProductLine: () => void;
  clearSauceType: () => void;
  applyButton?: React.ReactNode;
};

function FiltersForm({
  idPrefix = "filters",
  resultsText,
  search,
  setSearch,
  productLine,
  toggleLine,
  sauceType,
  setSauceType,
  clearAll,
  applyButton,
  clearProductLine,
  clearSauceType,
}: FiltersFormProps) {
  const searchId = `${idPrefix}-sauce-search`;
  // Unified styling for desktop and mobile: remove card borders and use simple section dividers
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
            aria-label="Search sauces"
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
            onValueChange={(v: SauceQueryState["sauceType"]) => setSauceType(v)}
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
            {allTypeSlugs.map((slug) => {
              const id = `${idPrefix}-type-${slug}`;
              const cfg = typeMap[slug];
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
  readonly items: SauceListItem[];
  readonly initialState: SauceQueryState;
};

function useDebouncedValue<T>(value: T, delay = 200): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export function SaucesClient({ items, initialState }: Props) {
  const pathname = usePathname();

  const [search, setSearch] = useState<string>(initialState.search);
  const [productLine, setProductLine] = useState<LineSlug[]>([
    ...initialState.productLine,
  ]);
  const [sauceType, setSauceType] = useState<SauceQueryState["sauceType"]>(
    initialState.sauceType,
  );
  const [sort, setSort] = useState<SortOrder>(initialState.sort);

  const debouncedSearch = useDebouncedValue(search, 200);

  const state: SauceQueryState = useMemo(
    () => ({ search: debouncedSearch, productLine, sauceType, sort }),
    [debouncedSearch, productLine, sauceType, sort],
  );

  // Sync URL on state changes without triggering a Next.js navigation
  useEffect(() => {
    const params = serializeStateToParams(state);
    const query = params.toString();
    const url = query ? `${pathname}?${query}` : pathname;
    if (typeof window !== "undefined") {
      window.history.replaceState(window.history.state, "", url);
    }
  }, [pathname, state]);

  // Compute filtered and sorted results
  const results = useMemo(
    () => applyFiltersAndSort(items, state),
    [items, state],
  );
  // Avoid hydration flash: use SSR-computed initial results for first paint
  const [firstPaint, setFirstPaint] = useState(true);
  useEffect(() => {
    setFirstPaint(false);
  }, []);

  // A11y live region and count display: "Showing X of Y"
  const resultsText = `${results.length} of ${items.length}`;
  const scrollKey = JSON.stringify({
    search: debouncedSearch,
    productLine,
    sauceType,
    sort,
  });

  function clearAll() {
    setSearch("");
    setProductLine([]);
    setSauceType("all");
    setSort("az");
  }

  function clearProductLine() {
    setProductLine([]);
  }

  function clearSauceType() {
    setSauceType("all");
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
              ? `Showing ${
                  initialState
                    ? applyFiltersAndSort(items, initialState).length
                    : results.length
                } of ${items.length}`
              : resultsText
          }
          search={search}
          setSearch={setSearch}
          productLine={productLine}
          toggleLine={toggleLine}
          sauceType={sauceType}
          setSauceType={setSauceType}
          clearAll={clearAll}
          clearProductLine={clearProductLine}
          clearSauceType={clearSauceType}
          applyButton={applyButton}
        />
      )}
      resultsText={resultsText}
      activeChips={[
        ...productLine.map((slug) => ({
          key: `line-${slug}`,
          text: lineMap[slug].display,
          variant: slug,
          onRemove: () => toggleLine(slug),
        })),
        ...(sauceType !== "all"
          ? [
              {
                key: `type-${sauceType}`,
                text: typeMap[sauceType as keyof typeof typeMap].display,
                variant: sauceType as any,
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
            No sauces match your filters.
          </p>
          <Button type="button" onClick={clearAll}>
            Clear all
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-y-12">
          {(firstPaint
            ? applyFiltersAndSort(items, initialState)
            : results
          ).map((item) => (
            <SauceCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </FilterableListLayout>
  );
}
