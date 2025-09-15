import type { IFuseOptions } from "fuse.js";
import Fuse from "fuse.js";

import {
  fromLineSlug,
  fromTypeSlug,
  type LineSlug,
  toLineSlug,
  toTypeSlug,
  type TypeSlug,
} from "@/config/sauce-taxonomy";
import type { SauceListItem, SortOrder } from "@/types";

import type { SauceQueryState } from "./url";

function normalize(value: unknown): string {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

function isSubsequence(needle: string, haystack: string): boolean {
  if (!needle) return true;
  let i = 0;
  for (let j = 0; j < haystack.length && i < needle.length; j++) {
    if (needle[i] === haystack[j]) i++;
  }
  return i === needle.length;
}

const fuseOptions: IFuseOptions<SauceListItem> = {
  keys: ["name", "descriptionPlain"],
  threshold: 0.3,
  ignoreLocation: true,
  isCaseSensitive: false,
  includeScore: false,
  minMatchCharLength: 1,
};

export function sortByName(
  items: SauceListItem[],
  order: SortOrder = "az",
): SauceListItem[] {
  const cmp = (a: SauceListItem, b: SauceListItem) =>
    a.name.localeCompare(b.name, "en-US", { sensitivity: "base" });
  const sorted = [...items].sort(cmp);
  return order === "za" ? sorted.reverse() : sorted;
}

export function filterBySearch(
  items: SauceListItem[],
  search: string,
): SauceListItem[] {
  const query = search?.trim();
  if (!query) return items;
  const fuse = new Fuse(items, fuseOptions);
  return fuse.search(query).map((r) => r.item);
}

export function filterByProductLine(
  items: SauceListItem[],
  lines: LineSlug[],
): SauceListItem[] {
  if (!lines?.length) return items;
  const set = new Set<LineSlug>(lines);
  return items.filter((it) => set.has(toLineSlug(it.line)));
}

export function filterBySauceType(
  items: SauceListItem[],
  type: TypeSlug | "all",
): SauceListItem[] {
  if (!type || type === "all") return items;
  return items.filter((it) => toTypeSlug(it.category) === type);
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
