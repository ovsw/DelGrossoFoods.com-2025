import { allTypeSlugs, type TypeSlug } from "@/config/sauce-taxonomy";
import type { SortOrder } from "@/types";

export interface SauceQueryState {
  readonly search: string;
  readonly sauceType: TypeSlug | "all";
  readonly sort: SortOrder; // az | za
}

export type SearchParamsLike = Record<string, string | string[] | undefined>;

const DEFAULT_STATE: SauceQueryState = {
  search: "",
  sauceType: "all",
  sort: "az",
} as const;

export function parseSearchParams(
  params: SearchParamsLike = {},
): SauceQueryState {
  const search = typeof params.search === "string" ? params.search : "";

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
    sauceType,
    sort,
  };
}

export function serializeStateToParams(
  state: SauceQueryState,
): URLSearchParams {
  const sp = new URLSearchParams();
  const { search, sauceType, sort } = state;

  if (search?.trim()) sp.set("search", search.trim());
  if (sauceType && sauceType !== "all") sp.set("sauceType", sauceType);
  if (sort && sort !== "az") sp.set("sort", sort);

  return sp;
}

export { DEFAULT_STATE };
