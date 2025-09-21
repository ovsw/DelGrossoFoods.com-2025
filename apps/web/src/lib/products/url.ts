import type { PackagingSlug } from "@/config/product-taxonomy";
import {
  allLineSlugs,
  allTypeSlugs,
  type LineSlug,
  type TypeSlug,
} from "@/config/sauce-taxonomy";
import type { SortOrder } from "@/types";

export interface ProductQueryState {
  readonly search: string;
  readonly packaging: PackagingSlug[]; // case | gift | other
  readonly productLine: LineSlug[];
  readonly sauceType: TypeSlug | "mix" | "all"; // products may have mix
  readonly sort: SortOrder; // az | za
}

export type SearchParamsLike = Record<string, string | string[] | undefined>;

const DEFAULT_STATE: ProductQueryState = {
  search: "",
  packaging: [],
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
): ProductQueryState {
  const search = typeof params.search === "string" ? params.search : "";

  const packagingRaw = toArray(params.packaging);
  const packaging = packagingRaw.filter((v): v is PackagingSlug =>
    ["case", "gift", "other"].includes(v),
  );

  const productLineRaw = toArray(params.productLine);
  const productLine = productLineRaw.filter((v): v is LineSlug =>
    (allLineSlugs as readonly string[]).includes(v),
  ) as LineSlug[];

  const sauceTypeRaw =
    typeof params.sauceType === "string" ? params.sauceType : undefined;
  const sauceType: ProductQueryState["sauceType"] =
    sauceTypeRaw && (allTypeSlugs as readonly string[]).includes(sauceTypeRaw)
      ? (sauceTypeRaw as TypeSlug)
      : sauceTypeRaw === "mix"
        ? "mix"
        : "all";

  const sortRaw = typeof params.sort === "string" ? params.sort : undefined;
  const sort: SortOrder = sortRaw === "za" ? "za" : "az";

  return { search, packaging, productLine, sauceType, sort };
}

export function serializeStateToParams(
  state: ProductQueryState,
): URLSearchParams {
  const sp = new URLSearchParams();
  const { search, packaging, productLine, sauceType, sort } = state;

  if (search?.trim()) sp.set("search", search.trim());
  for (const p of packaging) sp.append("packaging", p);
  for (const l of productLine) sp.append("productLine", l);
  if (sauceType && sauceType !== "all") sp.set("sauceType", sauceType);
  if (sort && sort !== "az") sp.set("sort", sort);

  return sp;
}

export { DEFAULT_STATE };
