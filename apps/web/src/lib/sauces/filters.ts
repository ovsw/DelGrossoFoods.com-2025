import type { IFuseOptions } from "fuse.js";

import {
  fromLineSlug,
  fromTypeSlug,
  type LineSlug,
  toLineSlug,
  toTypeSlug,
  type TypeSlug,
} from "@/config/sauce-taxonomy";
import {
  filterBySearch as filterBySearchShared,
  sortByName as sortByNameShared,
} from "@/lib/list/shared-filters";
import type { SauceListItem, SortOrder } from "@/types";

import type { SauceQueryState } from "./url";

const fuseOptions: IFuseOptions<SauceListItem> = {
  keys: ["name", "descriptionPlain"],
  threshold: 0.3,
  ignoreLocation: true,
  isCaseSensitive: false,
  includeScore: false,
  minMatchCharLength: 1,
};

export const sortByName = (items: SauceListItem[], order: SortOrder = "az") =>
  sortByNameShared(items, order);

export function filterBySearch(
  items: SauceListItem[],
  search: string,
): SauceListItem[] {
  return filterBySearchShared(items, search, fuseOptions);
}

export function filterByProductLine(
  items: SauceListItem[],
  lines: LineSlug[],
): SauceListItem[] {
  if (!lines?.length) return items;
  const set = new Set<LineSlug>(lines);
  return items.filter((it) => {
    const slug = toLineSlug(it.line);
    return slug ? set.has(slug) : false;
  });
}

export function filterBySauceType(
  items: SauceListItem[],
  type: TypeSlug | "all",
): SauceListItem[] {
  if (!type || type === "all") return items;
  return items.filter((it) => {
    const slug = toTypeSlug(it.category);
    return slug === type;
  });
}

export function applyFiltersAndSort(
  items: SauceListItem[],
  state: SauceQueryState,
): SauceListItem[] {
  const afterSearch = filterBySearch(items, state.search);
  const afterLine = filterByProductLine(afterSearch, state.productLine);
  const afterType = filterBySauceType(afterLine, state.sauceType);
  return sortByName(afterType, state.sort);
}

export function hydrateFromCanonical(
  item: Omit<SauceListItem, "line" | "category"> & {
    line: LineSlug;
    category: TypeSlug;
  },
): SauceListItem {
  return {
    ...item,
    line: fromLineSlug(item.line),
    category: fromTypeSlug(item.category),
  };
}
