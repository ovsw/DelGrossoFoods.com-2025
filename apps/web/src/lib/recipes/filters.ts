import type { IFuseOptions } from "fuse.js";

import {
  type MeatSlug,
  type RecipeTagSlug,
  toMeatSlug,
  toRecipeTagSlug,
} from "@/config/recipe-taxonomy";
import { type LineSlug, toLineSlug } from "@/config/sauce-taxonomy";
import {
  filterBySearch as filterBySearchShared,
  sortByName as sortByNameShared,
} from "@/lib/list/shared-filters";
import type { RecipeListItem, SortOrder } from "@/types";

import type { RecipeQueryState } from "./url";

const fuseOptions: IFuseOptions<RecipeListItem> = {
  keys: ["name"],
  threshold: 0.3,
  ignoreLocation: true,
  isCaseSensitive: false,
  includeScore: false,
  minMatchCharLength: 1,
};

export const sortByName = (items: RecipeListItem[], order: SortOrder = "az") =>
  sortByNameShared(items, order);

export function filterBySearch(
  items: RecipeListItem[],
  search: string,
): RecipeListItem[] {
  return filterBySearchShared(items, search, fuseOptions);
}

function recipeLineSlugs(item: RecipeListItem): LineSlug[] {
  const set = new Set<LineSlug>();
  for (const v of item.sauceLines ?? []) {
    const slug = toLineSlug(v);
    if (slug) set.add(slug);
  }
  return [...set];
}

export function filterByProductLine(
  items: RecipeListItem[],
  lines: LineSlug[],
): RecipeListItem[] {
  if (!lines?.length) return items;
  const set = new Set(lines);
  return items.filter((it) => recipeLineSlugs(it).some((l) => set.has(l)));
}

export function filterByTags(
  items: RecipeListItem[],
  tags: RecipeTagSlug[],
): RecipeListItem[] {
  if (!tags?.length) return items;
  const set = new Set(tags);
  return items.filter((it) => {
    const slugs = (it.tags ?? [])
      .map((t) => toRecipeTagSlug(t))
      .filter((s): s is RecipeTagSlug => Boolean(s));
    return slugs.some((s) => set.has(s));
  });
}

export function filterByMeats(
  items: RecipeListItem[],
  meats: MeatSlug[],
): RecipeListItem[] {
  if (!meats?.length) return items;
  const set = new Set(meats);
  return items.filter((it) => {
    const slugs = (it.meat ?? [])
      .map((m) => toMeatSlug(m))
      .filter((s): s is MeatSlug => Boolean(s));
    return slugs.some((s) => set.has(s));
  });
}

export function filterByCategory(
  items: RecipeListItem[],
  categorySlug: string | "all",
): RecipeListItem[] {
  if (!categorySlug || categorySlug === "all") return items;
  return items.filter((it) =>
    (it.categories ?? []).some((c) => c?.slug?.current === categorySlug),
  );
}

export function applyFiltersAndSort(
  items: RecipeListItem[],
  state: RecipeQueryState,
): RecipeListItem[] {
  const afterSearch = filterBySearch(items, state.search);
  const afterLine = filterByProductLine(afterSearch, state.productLine);
  const afterTags = filterByTags(afterLine, state.tags);
  const afterMeats = filterByMeats(afterTags, state.meats);
  const afterCategory = filterByCategory(afterMeats, state.categorySlug);
  return sortByName(afterCategory, state.sort);
}
