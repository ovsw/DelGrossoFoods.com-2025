import {
  allLineSlugs,
  allTypeSlugs,
  type LineSlug,
  type TypeSlug,
} from "@/config/sauce-taxonomy";
import type { SortOrder } from "@/types";

export interface SauceQueryState {
  readonly search: string;
  readonly productLine: LineSlug[]; // canonical slugs
  readonly sauceType: TypeSlug | "all";
  readonly sort: SortOrder; // az | za
}

export type SearchParamsLike = Record<string, string | string[] | undefined>;

const DEFAULT_STATE: SauceQueryState = {
  search: "",
  productLine: [],
  sauceType: "all",
  sort: "az",
} as const;

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function parseSearchParams(
  params: SearchParamsLike = {},
): SauceQueryState {
  const search = typeof params.search === "string" ? params.search : "";

  const productLineRaw = toArray(params.productLine);
  const productLine = productLineRaw.filter((v): v is LineSlug =>
    (allLineSlugs as readonly string[]).includes(v),
  ) as LineSlug[];

  const sauceTypeRaw =
    typeof params.sauceType === "string" ? params.sauceType : undefined;
  const sauceType: SauceQueryState["sauceType"] =
    sauceTypeRaw && (allTypeSlugs as readonly string[]).includes(sauceTypeRaw)
      ? (sauceTypeRaw as TypeSlug)
      : sauceTypeRaw === "all" || !sauceTypeRaw
        ? "all"
        : "all";

  const sortRaw = typeof params.sort === "string" ? params.sort : undefined;
  const sort: SortOrder = sortRaw === "za" ? "za" : "az";

  return {
    search,
    productLine,
    sauceType,
    sort,
  };
}

export function serializeStateToParams(
  state: SauceQueryState,
): URLSearchParams {
  const sp = new URLSearchParams();
  const { search, productLine, sauceType, sort } = state;

  if (search?.trim()) sp.set("search", search.trim());
  for (const line of productLine) sp.append("productLine", line);
  if (sauceType && sauceType !== "all") sp.set("sauceType", sauceType);
  if (sort && sort !== "az") sp.set("sort", sort);

  return sp;
}

export { DEFAULT_STATE };
