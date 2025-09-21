import type { IFuseOptions } from "fuse.js";
import Fuse from "fuse.js";

import type { SortOrder } from "@/types";

export function sortByName<T extends { name: string }>(
  items: T[],
  order: SortOrder = "az",
): T[] {
  const cmp = (a: T, b: T) =>
    a.name.localeCompare(b.name, "en-US", {
      sensitivity: "base",
      numeric: true,
    });
  const sorted = [...items].sort(cmp);
  return order === "za" ? sorted.reverse() : sorted;
}

export function filterBySearch<T>(
  items: T[],
  search: string,
  options: IFuseOptions<T>,
): T[] {
  const query = search?.trim();
  if (!query) return items;
  const fuse = new Fuse(items, options);
  return fuse.search(query).map((r) => r.item);
}
