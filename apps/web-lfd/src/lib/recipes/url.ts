import {
  allMeatSlugs,
  allRecipeTagSlugs,
  type MeatSlug,
  type RecipeTagSlug,
} from "@/config/recipe-taxonomy";
import { allLineSlugs, type LineSlug } from "@/config/sauce-taxonomy";
import type { SortOrder } from "@/types";

// Utility function to generate slug from title
export function generateSlugFromTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim()
    .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
}

// Helper function to get category slug (existing slug or generated from title)
export function getCategorySlug(category: {
  _id: string;
  title: string;
  slug?: { current?: string };
}): string {
  return category.slug?.current || generateSlugFromTitle(category.title);
}

export interface RecipeQueryState {
  readonly search: string;
  readonly productLine: LineSlug[];
  readonly tags: RecipeTagSlug[];
  readonly meats: MeatSlug[];
  readonly category: string | "all";
  readonly hasVideo: boolean;
  readonly sort: SortOrder;
}

export type SearchParamsLike = Record<string, string | string[] | undefined>;

const DEFAULT_STATE: RecipeQueryState = {
  search: "",
  productLine: [],
  tags: [],
  meats: [],
  category: "all",
  hasVideo: false,
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

  const category =
    typeof params.category === "string" ? params.category : "all";

  const hasVideoRaw = params.hasVideo;
  const hasVideo =
    typeof hasVideoRaw === "string"
      ? hasVideoRaw === "1" || hasVideoRaw.toLowerCase() === "true"
      : false;

  const sortRaw = typeof params.sort === "string" ? params.sort : undefined;
  const sort: SortOrder = sortRaw === "za" ? "za" : "az";

  return { search, productLine, tags, meats, category, hasVideo, sort };
}

export function serializeStateToParams(
  state: RecipeQueryState,
): URLSearchParams {
  const sp = new URLSearchParams();
  const { search, productLine, tags, meats, category, hasVideo, sort } = state;

  if (search?.trim()) sp.set("search", search.trim());
  for (const l of productLine) sp.append("productLine", l);
  for (const t of tags) sp.append("tags", t);
  for (const m of meats) sp.append("meats", m);
  if (category && category !== "all") sp.set("category", category);
  if (hasVideo) sp.set("hasVideo", "1");
  if (sort && sort !== "az") sp.set("sort", sort);
  return sp;
}

export { DEFAULT_STATE };
