import type { IFuseOptions } from "fuse.js";

import type { PackagingSlug } from "@/config/product-taxonomy";
import { toPackagingSlug } from "@/config/product-taxonomy";
import {
  type LineSlug,
  toLineSlug,
  toTypeSlug,
  type TypeSlug,
} from "@/config/sauce-taxonomy";
import {
  filterBySearch as filterBySearchShared,
  sortByName as sortByNameShared,
} from "@/lib/list/shared-filters";
import type { ProductListItem, SortOrder } from "@/types";

import type { ProductQueryState } from "./url";

const fuseOptions: IFuseOptions<ProductListItem> = {
  keys: ["name", "descriptionPlain"],
  threshold: 0.3,
  ignoreLocation: true,
  isCaseSensitive: false,
  includeScore: false,
  minMatchCharLength: 1,
};

export const sortByName = (items: ProductListItem[], order: SortOrder = "az") =>
  sortByNameShared(items, order);

export function filterBySearch(
  items: ProductListItem[],
  search: string,
): ProductListItem[] {
  return filterBySearchShared(items, search, fuseOptions);
}

export function filterByPackaging(
  items: ProductListItem[],
  selected: PackagingSlug[],
): ProductListItem[] {
  if (!selected?.length) return items;
  const set = new Set<PackagingSlug>(selected);
  return items.filter((it) => {
    const p = toPackagingSlug(it.category);
    return p ? set.has(p) : false;
  });
}

function getUniqueLines(item: ProductListItem): LineSlug[] {
  const set = new Set<LineSlug>();
  for (const v of itOrEmpty(item.sauceLines)) {
    const slug = toLineSlug(v);
    if (slug) set.add(slug);
  }
  return [...set];
}

function getUniqueTypes(item: ProductListItem): TypeSlug[] {
  const set = new Set<TypeSlug>();
  for (const v of itOrEmpty(item.sauceTypes)) {
    const slug = toTypeSlug(v);
    if (slug) set.add(slug);
  }
  return [...set];
}

function itOrEmpty<T>(arr: readonly T[] | null | undefined): readonly T[] {
  return Array.isArray(arr) ? arr : [];
}

export function filterByProductLine(
  items: ProductListItem[],
  lines: LineSlug[],
): ProductListItem[] {
  if (!lines?.length) return items;
  const set = new Set<LineSlug>(lines);
  return items.filter((it) => {
    const unique = getUniqueLines(it);
    if (unique.length !== 1) return false; // exclude mixed or none when line filter is active
    const only = unique[0];
    if (!only) return false;
    return set.has(only);
  });
}

export function filterBySauceType(
  items: ProductListItem[],
  type: TypeSlug | "mix" | "all",
): ProductListItem[] {
  if (!type || type === "all") return items;
  return items.filter((it) => {
    const types = getUniqueTypes(it);
    if (type === "mix") return types.length > 1; // strictly more than one distinct type
    return types.length === 1 && types[0] === type;
  });
}

export function applyFiltersAndSort(
  items: ProductListItem[],
  state: ProductQueryState,
): ProductListItem[] {
  const afterSearch = filterBySearch(items, state.search);
  const afterPackaging = filterByPackaging(afterSearch, state.packaging);
  const afterLine = filterByProductLine(afterPackaging, state.productLine);
  const afterType = filterBySauceType(afterLine, state.sauceType);
  return sortByName(afterType, state.sort);
}

// (Reserved) Utility for future canonical-to-display hydration if needed
