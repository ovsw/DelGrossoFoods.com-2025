"use client";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { CheckboxList } from "@/components/filterable/checkbox-list";
import { FilterGroupSection } from "@/components/filterable/filter-group-section";
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
  parseSearchParams,
  type RecipeQueryState,
  serializeStateToParams,
} from "@/lib/recipes/url";
import type { RecipeCategoryOption, RecipeListItem, SortOrder } from "@/types";

type FiltersFormProps = {
  idPrefix?: string;
  search: string;
  setSearch: (v: string) => void;
  productLine: LineSlug[];
  toggleLine: (line: LineSlug, checked: boolean) => void;
  tags: RecipeTagSlug[];
  toggleTag: (t: RecipeTagSlug, checked: boolean) => void;
  meats: MeatSlug[];
  toggleMeat: (m: MeatSlug) => void;
  categoryId: string | "all";
  setCategoryId: (id: string | "all") => void;
  clearProductLine: () => void;
  clearTags: () => void;
  clearMeats: () => void;
  clearCategory: () => void;
  categoryOptions: RecipeCategoryOption[];
};

function FiltersForm({
  idPrefix = "filters",
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
  clearProductLine,
  clearTags,
  clearMeats,
  clearCategory,
  categoryOptions,
}: FiltersFormProps) {
  const searchId = `${idPrefix}-recipe-search`;
  return (
    <div>
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

      <FilterGroupSection
        title="Product Line"
        showClear={productLine.length > 0}
        onClear={clearProductLine}
        contentClassName=""
      >
        <CheckboxList
          items={allLineSlugs
            .filter((slug) => slug !== "organic")
            .map((slug) => ({
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

      <div className="my-4 border-b border-input" />

      <FilterGroupSection
        title="Recipe Tags"
        showClear={tags.length > 0}
        onClear={clearTags}
        contentClassName=""
      >
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
          onToggle={(id, checked) => {
            const slug = id.replace(`${idPrefix}-tag-`, "") as RecipeTagSlug;
            toggleTag(slug, checked);
          }}
        />
      </FilterGroupSection>

      <div className="my-4 border-b border-input" />

      <FilterGroupSection
        title="Meat"
        showClear={meats.length > 0}
        onClear={clearMeats}
        contentClassName=""
      >
        <div className="mt-2 flex flex-wrap gap-1">
          {allMeatSlugs.map((slug) => {
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
      </FilterGroupSection>

      <div className="my-4 border-b border-input" />

      <FilterGroupSection
        title="Category"
        showClear={categoryId !== "all"}
        onClear={clearCategory}
        contentClassName=""
      >
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
      </FilterGroupSection>
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
        setProductLine([...next.productLine]);
        setTags([...next.tags]);
        setMeats([...next.meats]);
        setCategoryId(next.categoryId);
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
    Boolean(search) ||
    productLine.length > 0 ||
    tags.length > 0 ||
    meats.length > 0 ||
    categoryId !== "all";

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
  const toggleLine = (l: LineSlug, checked: boolean) =>
    setProductLine((prev) => {
      if (checked) {
        return prev.includes(l) ? prev : [...prev, l];
      }
      return prev.filter((x) => x !== l);
    });
  const toggleTag = (t: RecipeTagSlug, checked: boolean) =>
    setTags((prev) => {
      if (checked) {
        return prev.includes(t) ? prev : [...prev, t];
      }
      return prev.filter((x) => x !== t);
    });
  const toggleMeat = (m: MeatSlug) =>
    setMeats((prev) =>
      prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m],
    );

  return (
    <FilterableListLayout
      renderFilters={({ idPrefix }) => (
        <FiltersForm
          idPrefix={idPrefix}
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
          clearProductLine={clearProductLine}
          clearTags={clearTags}
          clearMeats={clearMeats}
          clearCategory={clearCategory}
          categoryOptions={categories}
        />
      )}
      resultsCount={resultsCount}
      resultsTotal={totalCount}
      isAnyActive={filtersActive}
      onClearAll={clearAll}
      activeChips={[
        ...productLine.map((slug) => ({
          key: `line-${slug}`,
          text: lineMap[slug].display,
          variant: slug,
          onRemove: () => toggleLine(slug, false),
        })),
        ...tags.map((slug) => ({
          key: `tag-${slug}`,
          text: tagMap[slug].display,
          variant: tagMap[slug].badgeVariant,
          onRemove: () => toggleTag(slug, false),
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
      {resultsCount === 0 ? (
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
          {effectiveResults.map((item) => (
            <RecipeCard key={item._id} item={item} />
          ))}
        </div>
      )}
    </FilterableListLayout>
  );
}
