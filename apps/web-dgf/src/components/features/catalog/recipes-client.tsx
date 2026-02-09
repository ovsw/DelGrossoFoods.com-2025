"use client";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { CatalogFilterableListLayout } from "@workspace/ui/components/catalog-filterable-list-layout";
import { CheckboxList } from "@workspace/ui/components/checkbox-list";
import { SearchField } from "@workspace/ui/components/search-field";
import { SortDropdown } from "@workspace/ui/components/sort-dropdown";
import { useCatalogController } from "@workspace/ui/hooks/use-catalog-controller";
import { useEffect, useMemo, useState } from "react";

import { FilterGroupSection } from "@/components/elements/filterable/filter-group-section";
import { RecipeCard } from "@/components/elements/recipe-card";
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
import { applyFiltersAndSort } from "@/lib/recipes/filters";
import {
  getCategorySlug,
  parseSearchParams,
  type RecipeQueryState,
  serializeStateToParams,
} from "@/lib/recipes/url";
import type { RecipeCategoryOption, RecipeListItem } from "@/types";

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
  category: string | "all";
  setCategory: (category: string | "all") => void;
  hasVideo: boolean;
  setHasVideo: (v: boolean) => void;
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
  category,
  setCategory,
  hasVideo,
  setHasVideo,
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
        placeholder="Search"
        ariaLabel="Search recipes"
        visuallyHideLabel
      />

      <div className="my-4 border-b border-input" />

      <CheckboxList
        items={[
          {
            id: `${idPrefix}-has-video`,
            label: "Has video",
            checked: hasVideo,
            ariaLabel: "Has video",
          },
        ]}
        onToggle={(id, checked) => {
          if (id === `${idPrefix}-has-video`) setHasVideo(checked);
        }}
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
        showClear={category !== "all"}
        onClear={clearCategory}
        contentClassName=""
      >
        <div className="mt-2">
          <div className="relative">
            <select
              id={`${idPrefix}-category-select`}
              className="w-full appearance-none rounded-md border border-input bg-white/70 px-3 py-2 text-sm ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              value={category}
              onChange={(e) => setCategory(e.currentTarget.value || "all")}
              aria-label="Category"
            >
              <option value="all">Select</option>
              {categoryOptions.map((c) => (
                <option key={c._id} value={getCategorySlug(c)}>
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
  const [filters, setFilters] = useState<RecipeQueryState>(initialState);
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
        productLine: state.productLine,
        tags: state.tags,
        meats: state.meats,
        category: state.category,
        hasVideo: state.hasVideo,
        sort: state.sort,
      }),
    });

  const filtersActive =
    Boolean(filters.search) ||
    filters.productLine.length > 0 ||
    filters.tags.length > 0 ||
    filters.meats.length > 0 ||
    filters.category !== "all" ||
    filters.hasVideo;

  const resultsAnchorId = "recipes-results-top";

  function clearAll() {
    setFilters({
      search: "",
      productLine: [],
      tags: [],
      meats: [],
      category: "all",
      hasVideo: false,
      sort: "az",
    });
  }
  const clearProductLine = () =>
    setFilters((prev) => ({ ...prev, productLine: [] }));
  const clearTags = () => setFilters((prev) => ({ ...prev, tags: [] }));
  const clearMeats = () => setFilters((prev) => ({ ...prev, meats: [] }));
  const clearCategory = () =>
    setFilters((prev) => ({ ...prev, category: "all" }));
  const toggleLine = (l: LineSlug, checked: boolean) =>
    setFilters((prev) => ({
      ...prev,
      productLine: checked
        ? prev.productLine.includes(l)
          ? prev.productLine
          : [...prev.productLine, l]
        : prev.productLine.filter((x) => x !== l),
    }));
  const toggleTag = (t: RecipeTagSlug, checked: boolean) =>
    setFilters((prev) => ({
      ...prev,
      tags: checked
        ? prev.tags.includes(t)
          ? prev.tags
          : [...prev.tags, t]
        : prev.tags.filter((x) => x !== t),
    }));
  const toggleMeat = (m: MeatSlug) =>
    setFilters((prev) => ({
      ...prev,
      meats: prev.meats.includes(m)
        ? prev.meats.filter((x) => x !== m)
        : [...prev.meats, m],
    }));

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
          tags={filters.tags}
          toggleTag={toggleTag}
          meats={filters.meats}
          toggleMeat={toggleMeat}
          category={filters.category}
          setCategory={(value) =>
            setFilters((prev) => ({
              ...prev,
              category: value,
            }))
          }
          hasVideo={filters.hasVideo}
          setHasVideo={(value) =>
            setFilters((prev) => ({
              ...prev,
              hasVideo: value,
            }))
          }
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
        ...filters.productLine.map((slug) => ({
          key: `line-${slug}`,
          text: lineMap[slug].display,
          variant: slug,
          onRemove: () => toggleLine(slug, false),
        })),
        ...filters.tags.map((slug) => ({
          key: `tag-${slug}`,
          text: tagMap[slug].display,
          variant: tagMap[slug].badgeVariant,
          onRemove: () => toggleTag(slug, false),
        })),
        ...filters.meats.map((slug) => ({
          key: `meat-${slug}`,
          text: meatMap[slug].display,
          variant: "meat" as const,
          onRemove: () => toggleMeat(slug),
        })),
        ...(filters.hasVideo
          ? [
              {
                key: "has-video",
                text: "Has video",
                variant: "neutral" as const,
                onRemove: () =>
                  setFilters((prev) => ({ ...prev, hasVideo: false })),
              },
            ]
          : []),
      ]}
      scrollToTopKey={scrollKey}
      skipScroll={skipScroll}
      resultsAnchorId={resultsAnchorId}
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
    </CatalogFilterableListLayout>
  );
}
