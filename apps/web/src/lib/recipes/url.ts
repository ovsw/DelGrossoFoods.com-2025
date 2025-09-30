import {
  allMeatSlugs,
  allRecipeTagSlugs,
  type MeatSlug,
  type RecipeTagSlug,
} from "@/config/recipe-taxonomy";
import { allLineSlugs, type LineSlug } from "@/config/sauce-taxonomy";
import type { SortOrder } from "@/types";

export interface RecipeQueryState {
  readonly search: string;
  readonly productLine: LineSlug[];
  readonly tags: RecipeTagSlug[];
  readonly meats: MeatSlug[];
  readonly categorySlug: string | "all";
  readonly sort: SortOrder;
}

export type SearchParamsLike = Record<string, string | string[] | undefined>;

const DEFAULT_STATE: RecipeQueryState = {
  search: "",
  productLine: [],
  tags: [],
  meats: [],
  categorySlug: "all",
  sort: "az",
} as const;

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function parseSearchParams(
  params: SearchParamsLike = {},
): RecipeQueryState {
  const search = typeof params.search === "string" ? params.search : "";

  const productLineRaw = toArray(params.productLine);
  const productLine = productLineRaw.filter((v): v is LineSlug =>
    (allLineSlugs as readonly string[]).includes(v),
  ) as LineSlug[];

  const tagsRaw = toArray(params.tags);
  const tags = tagsRaw.filter((v): v is RecipeTagSlug =>
    (allRecipeTagSlugs as readonly string[]).includes(v),
  ) as RecipeTagSlug[];

  const meatsRaw = toArray(params.meats);
  const meats = meatsRaw.filter((v): v is MeatSlug =>
    (allMeatSlugs as readonly string[]).includes(v),
  ) as MeatSlug[];

  const categorySlug =
    typeof params.categorySlug === "string" ? params.categorySlug : "all";

  const sortRaw = typeof params.sort === "string" ? params.sort : undefined;
  const sort: SortOrder = sortRaw === "za" ? "za" : "az";

  return { search, productLine, tags, meats, categorySlug, sort };
}

export function serializeStateToParams(
  state: RecipeQueryState,
): URLSearchParams {
  const sp = new URLSearchParams();
  const { search, productLine, tags, meats, categorySlug, sort } = state;

  if (search?.trim()) sp.set("search", search.trim());
  for (const l of productLine) sp.append("productLine", l);
  for (const t of tags) sp.append("tags", t);
  for (const m of meats) sp.append("meats", m);
  if (categorySlug && categorySlug !== "all")
    sp.set("categorySlug", categorySlug);
  if (sort && sort !== "az") sp.set("sort", sort);
  return sp;
}

export { DEFAULT_STATE };
