"use client";
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
import { SauceCard } from "@/components/elements/sauce-card";
import {
  allLineSlugs,
  allTypeSlugs,
  getLineBadge,
  getTypeBadge,
  lineMap,
  type LineSlug,
  typeMap,
  type TypeSlug,
} from "@/config/sauce-taxonomy";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { applyFiltersAndSort } from "@/lib/sauces/filters";
import {
  parseSearchParams,
  type SauceQueryState,
  serializeStateToParams,
} from "@/lib/sauces/url";
import type { SauceListItem } from "@/types";

type FiltersFormProps = {
  idPrefix?: string;
  search: string;
  setSearch: (v: string) => void;
  productLine: LineSlug[];
  toggleLine: (line: LineSlug, checked: boolean) => void;
  sauceType: SauceQueryState["sauceType"];
  setSauceType: (v: SauceQueryState["sauceType"]) => void;
  clearProductLine: () => void;
  clearSauceType: () => void;
};

function isSauceType(value: string): value is SauceQueryState["sauceType"] {
  return value === "all" || (allTypeSlugs as readonly string[]).includes(value);
}

function FiltersForm({
  idPrefix = "filters",
  search,
  setSearch,
  productLine,
  toggleLine,
  sauceType,
  setSauceType,
  clearProductLine,
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
          onToggle={(id, checked) => {
            const slug = id.replace(`${idPrefix}-line-`, "") as LineSlug;
            toggleLine(slug, checked);
          }}
        />
      </FilterGroupSection>

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
  const [filters, setFilters] = useState<SauceQueryState>(initialState);
  useEffect(() => {
    setFilters(initialState);
  }, [initialState]);

  const debouncedSearch = useDebouncedValue(filters.search, 200);
  const queryState = useMemo(
    () => ({ ...filters, search: debouncedSearch }),
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
        productLine: state.productLine,
        sauceType: state.sauceType,
        sort: state.sort,
      }),
    });

  const filtersActive =
    Boolean(filters.search.trim()) ||
    filters.productLine.length > 0 ||
    filters.sauceType !== "all";

  const activeTypeChip =
    filters.sauceType !== "all"
      ? {
          key: `type-${filters.sauceType as TypeSlug}`,
          ...getTypeBadge(typeMap[filters.sauceType as TypeSlug].label),
          onRemove: () => setFilters((prev) => ({ ...prev, sauceType: "all" })),
        }
      : null;

  function clearAll() {
    setFilters({
      search: "",
      productLine: [],
      sauceType: "all",
      sort: "az",
    });
  }

  function clearProductLine() {
    setFilters((prev) => ({ ...prev, productLine: [] }));
  }

  function clearSauceType() {
    setFilters((prev) => ({ ...prev, sauceType: "all" }));
  }

  function toggleLine(line: LineSlug, checked: boolean) {
    setFilters((prev) => ({
      ...prev,
      productLine: checked
        ? prev.productLine.includes(line)
          ? prev.productLine
          : [...prev.productLine, line]
        : prev.productLine.filter((l) => l !== line),
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
          productLine={filters.productLine}
          toggleLine={toggleLine}
          sauceType={filters.sauceType}
          setSauceType={(value) =>
            setFilters((prev) => ({
              ...prev,
              sauceType: value,
            }))
          }
          clearProductLine={clearProductLine}
          clearSauceType={clearSauceType}
        />
      )}
      resultsCount={resultsCount}
      resultsTotal={totalCount}
      isAnyActive={filtersActive}
      onClearAll={clearAll}
      activeChips={[
        ...filters.productLine.map((slug) => {
          const { text, variant } = getLineBadge(lineMap[slug].label);
          return {
            key: `line-${slug}`,
            text,
            variant,
            onRemove: () => toggleLine(slug, false),
          };
        }),
        ...(activeTypeChip ? [activeTypeChip] : []),
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
            No sauces match your filters.
          </p>
          <Button type="button" onClick={clearAll} className="cursor-pointer">
            Clear all
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3  gap-y-12">
          {effectiveResults.map((item) => (
            <SauceCard
              key={item._id}
              item={item}
              showLineLabel={false}
              showBadges={false}
            />
          ))}
        </div>
      )}
    </CatalogFilterableListLayout>
  );
}
