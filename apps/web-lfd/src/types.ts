import type {
  GetAllProductsForIndexQueryResult,
  GetAllRecipesForIndexQueryResult,
  GetAllSaucesForIndexQueryResult,
  GetProductBySlugQueryResult,
  GetProductsBySauceIdQueryResult,
  GetRecipeBySlugQueryResult,
  LfdHomePageQueryResult,
  LfdProductIndexPageQueryResult,
  LfdRecipeCategoriesQueryResult,
  LfdRecipeIndexPageQueryResult,
  LfdSauceIndexPageQueryResult,
  QueryImageTypeResult,
} from "@workspace/sanity-config/types";

export type PageBuilderBlockTypes = NonNullable<
  NonNullable<LfdHomePageQueryResult>["pageBuilder"]
>[number]["_type"];

export type PagebuilderType<T extends PageBuilderBlockTypes> = Extract<
  NonNullable<NonNullable<LfdHomePageQueryResult>["pageBuilder"]>[number],
  { _type: T }
>;

export type SanityButtonProps = NonNullable<
  NonNullable<PagebuilderType<"feature">>["buttons"]
>[number];

export type SanityImageProps = Omit<
  NonNullable<QueryImageTypeResult>,
  "alt"
> & {
  alt?: string | null;
};

// Generic portable text definitions for heading extraction (decoupled from blog types)
export type SanityRichTextChild = {
  readonly _type: "span";
  readonly _key: string;
  readonly text?: string;
  readonly marks?: readonly string[];
};

export type SanityRichTextNode = {
  readonly _type: string; // e.g., "block", "image"
  readonly _key: string;
  readonly style?: string;
  readonly children?: readonly SanityRichTextChild[];
};

export type SanityRichTextProps =
  | readonly SanityRichTextNode[]
  | null
  | undefined;

export type SanityRichTextBlock = Extract<
  SanityRichTextNode,
  { _type: "block" }
>;

export type Maybe<T> = T | null | undefined;

// Sauces index types derived from generated query result types (tight coupling)
export type SauceIndexPageData = NonNullable<LfdSauceIndexPageQueryResult>;
export type SauceListItem = GetAllSaucesForIndexQueryResult[number];

export type SortOrder = "az" | "za";

// Products index types
export type ProductIndexPageData = NonNullable<LfdProductIndexPageQueryResult>;
export type ProductListItem = GetAllProductsForIndexQueryResult[number];
export type SauceProductListItem = GetProductsBySauceIdQueryResult[number];
export type ProductDetailData = NonNullable<GetProductBySlugQueryResult>;

// Recipes index types
export type RecipeIndexPageData = NonNullable<LfdRecipeIndexPageQueryResult>;
export type RecipeListItem = GetAllRecipesForIndexQueryResult[number];
export type RecipeCategoryOption = LfdRecipeCategoriesQueryResult[number];
export type RecipeDetailData = NonNullable<GetRecipeBySlugQueryResult>;
