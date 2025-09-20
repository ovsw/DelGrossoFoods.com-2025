"use client";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { DrawerClose, DrawerFooter } from "@workspace/ui/components/drawer";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { CheckboxList } from "@/components/filterable/checkbox-list";
import { ClearSection } from "@/components/filterable/clear-section";
import { FilterableListLayout } from "@/components/filterable/filterable-list-layout";
import { SearchField } from "@/components/filterable/search-field";
import { SortDropdown } from "@/components/filterable/sort-dropdown";
import { RecipeCard } from "@/components/recipes/recipe-card";
import {
  allMeatSlugs,
  allRecipeTagSlugs,
  meatMap,
  type MeatSlug,
  type RecipeTagSlug,
  tagMap,
} from "@/config/recipe-taxonomy";
import { allLineSlugs, lineMap, type LineSlug } from "@/config/sauce-taxonomy";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { useFirstPaint } from "@/hooks/use-first-paint";
import { useUrlStateSync } from "@/hooks/use-url-state-sync";
import { applyFiltersAndSort } from "@/lib/recipes/filters";
import {
  type RecipeQueryState,
  serializeStateToParams,
} from "@/lib/recipes/url";
import type { RecipeCategoryOption, RecipeListItem, SortOrder } from "@/types";

type FiltersFormProps = {
  idPrefix?: string;
  resultsText: string;
  search: string;
  setSearch: (v: string) => void;
  productLine: LineSlug[];
  toggleLine: (line: LineSlug) => void;
  tags: RecipeTagSlug[];
  toggleTag: (t: RecipeTagSlug) => void;
  meats: MeatSlug[];
  toggleMeat: (m: MeatSlug) => void;
  categoryId: string | "all";
  setCategoryId: (id: string | "all") => void;
  clearAll: () => void;
  clearProductLine: () => void;
  clearTags: () => void;
  clearMeats: () => void;
  clearCategory: () => void;
  categoryOptions: RecipeCategoryOption[];
  applyButton?: React.ReactNode;
  setSheetHeaderRight?: (node: React.ReactNode) => void;
};

function FiltersForm({
  idPrefix = "filters",
  resultsText,
  search,
  setSearch,
  productLine,
  toggleLine,
  tags,
  toggleTag,
  meats,
  toggleMeat,
  categoryId,
  setCategoryId,
  clearAll,
  clearProductLine,
  clearTags,
  clearMeats,
  clearCategory,
  categoryOptions,
  applyButton,
  setSheetHeaderRight,
}: FiltersFormProps) {
  const searchId = `${idPrefix}-recipe-search`;
  const legendClass = "sr-only";
  const anyFiltersActive =
    Boolean(search) ||
    productLine.length > 0 ||
    tags.length > 0 ||
    meats.length > 0 ||
    categoryId !== "all";
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
        placeholder="Search by name"
        ariaLabel="Search recipes"
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
          items={allLineSlugs
            .filter((slug) => slug !== "organic")
            .map((slug) => ({
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
        <legend className={legendClass}>Recipe Tags</legend>
        <div className="flex items-center justify-between gap-2">
          <span className="px-0 text-lg font-semibold">Recipe Tags</span>
          <ClearSection show={tags.length > 0} onClear={clearTags} />
        </div>
        <CheckboxList
          items={allRecipeTagSlugs.map((slug) => ({
            id: `${idPrefix}-tag-${slug}`,
            label: (
              <Badge
                text={tagMap[slug].display}
                variant={tagMap[slug].badgeVariant}
                className="text-sm"
              />
            ),
            checked: tags.includes(slug),
            ariaLabel: tagMap[slug].display,
          }))}
          onToggle={(id) => {
            const slug = id.replace(`${idPrefix}-tag-`, "") as RecipeTagSlug;
            toggleTag(slug);
          }}
        />
      </fieldset>

      <div className="my-4 border-b border-input" />

      <fieldset className="m-0 border-0 p-0 my-4">
        <legend className={legendClass}>Meat</legend>
        <div className="flex items-center justify-between gap-2">
          <span className="px-0 text-lg font-semibold">Meat</span>
          <ClearSection show={meats.length > 0} onClear={clearMeats} />
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {allMeatSlugs.map((slug) => {
            const id = `${idPrefix}-meat-${slug}`;
            const cfg = meatMap[slug];
            const checked = meats.includes(slug);
            return (
              <button
                key={slug}
                type="button"
                aria-pressed={checked}
                aria-label={cfg.display}
                onClick={() => toggleMeat(slug)}
                className="inline-flex items-center rounded-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
              >
                <Badge
                  text={cfg.display}
                  variant={checked ? "meat" : "outline"}
                  className="text-sm"
                />
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="my-4 border-b border-input" />

      <fieldset className="m-0 border-0 p-0 my-4">
        <legend className={legendClass}>Category</legend>
        <div className="flex items-center justify-between gap-2">
          <span className="px-0 text-lg font-semibold">Category</span>
          <ClearSection show={categoryId !== "all"} onClear={clearCategory} />
        </div>
        <div className="mt-2">
          <div className="relative">
            <select
              id={`${idPrefix}-category-select`}
              className="w-full appearance-none rounded-md border border-input bg-white/70 px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={categoryId}
              onChange={(e) => setCategoryId(e.currentTarget.value || "all")}
              aria-label="Category"
            >
              <option value="all">Select</option>
              {categoryOptions.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.title}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-muted-foreground">
              ▾
            </span>
          </div>
        </div>
      </fieldset>

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
  items: RecipeListItem[];
  initialState: RecipeQueryState;
  categories: RecipeCategoryOption[];
};

export function RecipesClient({ items, initialState, categories }: Props) {
  const pathname = usePathname();

  const [search, setSearch] = useState(initialState.search);
  const [productLine, setProductLine] = useState<LineSlug[]>([
    ...initialState.productLine,
  ]);
  const [tags, setTags] = useState<RecipeTagSlug[]>([...initialState.tags]);
  const [meats, setMeats] = useState<MeatSlug[]>([...initialState.meats]);
  const [categoryId, setCategoryId] = useState<string | "all">(
    initialState.categoryId,
  );
  const [sort, setSort] = useState<SortOrder>(initialState.sort);

  const debouncedSearch = useDebouncedValue(search, 200);
  const state: RecipeQueryState = useMemo(
    () => ({
      search: debouncedSearch,
      productLine,
      tags,
      meats,
      categoryId,
      sort,
    }),
    [debouncedSearch, productLine, tags, meats, categoryId, sort],
  );

  useUrlStateSync({ pathname, state, serialize: serializeStateToParams });

  const results = useMemo(
    () => applyFiltersAndSort(items, state),
    [items, state],
  );
  const firstPaint = useFirstPaint();
  const resultsText = `Showing ${results.length} out of ${items.length}`;

  // Key to trigger shared layout scroll behavior
  const resultsAnchorId = "recipes-results-top";
  const scrollKey = JSON.stringify({
    search: debouncedSearch,
    productLine,
    tags,
    meats,
    categoryId,
    sort,
  });

  function clearAll() {
    setSearch("");
    setProductLine([]);
    setTags([]);
    setMeats([]);
    setCategoryId("all");
    setSort("az");
  }
  const clearProductLine = () => setProductLine([]);
  const clearTags = () => setTags([]);
  const clearMeats = () => setMeats([]);
  const clearCategory = () => setCategoryId("all");
  const toggleLine = (l: LineSlug) =>
    setProductLine((prev) =>
      prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l],
    );
  const toggleTag = (t: RecipeTagSlug) =>
    setTags((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  const toggleMeat = (m: MeatSlug) =>
    setMeats((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );

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
          productLine={productLine}
          toggleLine={toggleLine}
          tags={tags}
          toggleTag={toggleTag}
          meats={meats}
          toggleMeat={toggleMeat}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          clearAll={clearAll}
          clearProductLine={clearProductLine}
          clearTags={clearTags}
          clearMeats={clearMeats}
          clearCategory={clearCategory}
          categoryOptions={categories}
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
        ...tags.map((slug) => ({
          key: `tag-${slug}`,
          text: tagMap[slug].display,
          variant: tagMap[slug].badgeVariant,
          onRemove: () => toggleTag(slug),
        })),
        ...meats.map((slug) => ({
          key: `meat-${slug}`,
          text: meatMap[slug].display,
          variant: "meat" as const,
          onRemove: () => toggleMeat(slug),
        })),
      ]}
      scrollToTopKey={scrollKey}
      skipScroll={firstPaint}
      resultsAnchorId={resultsAnchorId}
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
            No recipes match your filters.
          </p>
          <Button type="button" onClick={clearAll} className="cursor-pointer">
            Clear all
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-6 gap-x-6">
          {(firstPaint
            ? applyFiltersAndSort(items, initialState)
            : results
          ).map((item) => (
            <RecipeCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </FilterableListLayout>
  );
}
