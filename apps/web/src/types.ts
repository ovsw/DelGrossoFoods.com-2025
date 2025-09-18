import type {
  GetAllProductsForIndexQueryResult,
  GetAllRecipeCategoriesQueryResult,
  GetAllRecipesForIndexQueryResult,
  GetAllSaucesForIndexQueryResult,
  GetProductIndexPageQueryResult,
  GetRecipeIndexPageQueryResult,
  GetSauceIndexPageQueryResult,
  QueryBlogSlugPageDataResult,
  QueryHomePageDataResult,
  QueryImageTypeResult,
} from "@/lib/sanity/sanity.types";

export type PageBuilderBlockTypes = NonNullable<
  NonNullable<QueryHomePageDataResult>["pageBuilder"]
>[number]["_type"];

export type PagebuilderType<T extends PageBuilderBlockTypes> = Extract<
  NonNullable<NonNullable<QueryHomePageDataResult>["pageBuilder"]>[number],
  { _type: T }
>;

export type SanityButtonProps = NonNullable<
  NonNullable<PagebuilderType<"hero">>["buttons"]
>[number];

export type SanityImageProps = NonNullable<QueryImageTypeResult>;

export type SanityRichTextProps =
  NonNullable<QueryBlogSlugPageDataResult>["richText"];

export type SanityRichTextBlock = Extract<
  NonNullable<NonNullable<SanityRichTextProps>[number]>,
  { _type: "block" }
>;

export type Maybe<T> = T | null | undefined;

// Sauces index types derived from generated query result types (tight coupling)
export type SauceIndexPageData = NonNullable<GetSauceIndexPageQueryResult>;
export type SauceListItem = GetAllSaucesForIndexQueryResult[number];

export type SortOrder = "az" | "za";

// Products index types
export type ProductIndexPageData = NonNullable<GetProductIndexPageQueryResult>;
export type ProductListItem = GetAllProductsForIndexQueryResult[number];

// Recipes index types
export type RecipeIndexPageData = NonNullable<GetRecipeIndexPageQueryResult>;
export type RecipeListItem = GetAllRecipesForIndexQueryResult[number];
export type RecipeCategoryOption = GetAllRecipeCategoriesQueryResult[number];
