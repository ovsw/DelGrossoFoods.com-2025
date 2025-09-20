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
import { SauceCard } from "@/components/sauce-card";
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
  setSheetHeaderRight?: (node: React.ReactNode) => void;
};

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
  productLine,
  toggleLine,
  sauceType,
  setSauceType,
  clearAll,
  applyButton,
  clearProductLine,
  clearSauceType,
  setSheetHeaderRight,
}: FiltersFormProps) {
  const searchId = `${idPrefix}-sauce-search`;
  // Unified styling for desktop and mobile: remove card borders and use simple section dividers
  const legendClass = "sr-only";
  const anyFiltersActive =
    Boolean(search) || productLine.length > 0 || sauceType !== "all";
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
        ariaLabel="Search sauces"
        visuallyHideLabel
      />

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
          onChange={(v) => setSauceType(v as SauceQueryState["sauceType"])}
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
  readonly items: SauceListItem[];
  readonly initialState: SauceQueryState;
};

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
  useUrlStateSync({ pathname, state, serialize: serializeStateToParams });

  // Compute filtered and sorted results
  const results = useMemo(
    () => applyFiltersAndSort(items, state),
    [items, state],
  );
  // Avoid hydration flash: use SSR-computed initial results for first paint
  const firstPaint = useFirstPaint();

  // A11y live region and count display
  const resultsText = `Showing ${results.length} out of ${items.length}`;
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
      filters={({ idPrefix, applyButton, setSheetHeaderRight }) => (
        <FiltersForm
          idPrefix={idPrefix}
          resultsText={
            firstPaint
              ? `Showing ${
                  initialState
                    ? applyFiltersAndSort(items, initialState).length
                    : results.length
                } out of ${items.length}`
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
          setSheetHeaderRight={setSheetHeaderRight}
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
                variant:
                  sauceTypeToBadgeVariant[sauceType as TypeSlug] ?? "neutral",
                onRemove: () => setSauceType("all"),
              },
            ]
          : []),
      ]}
      scrollToTopKey={scrollKey}
      skipScroll={firstPaint}
      sortControl={
        <SortDropdown value={sort} onChange={setSort} className="ms-auto" />
      }
    >
      {(firstPaint ? applyFiltersAndSort(items, initialState) : results)
        .length === 0 ? (
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
