import type { IFuseOptions } from "fuse.js";

import type { PackagingSlug } from "@/config/product-taxonomy";
import { toPackagingSlug } from "@/config/product-taxonomy";
import { toTypeSlug, type TypeSlug } from "@/config/sauce-taxonomy";
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
  const afterType = filterBySauceType(afterPackaging, state.sauceType);
  return sortByName(afterType, state.sort);
}

// (Reserved) Utility for future canonical-to-display hydration if needed
