import type { LineLabel, TypeLabel } from "@/config/sauce-taxonomy";
import type {
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

// Sauces index types
export interface SauceIndexPageData {
  readonly _id: string;
  readonly _type: string;
  readonly title?: string | null;
  readonly description?: string | null;
  readonly slug?: string | null;
}

export interface SauceCardImage extends SanityImageProps {
  readonly alt?: string | null;
}

export interface SauceListItem {
  readonly _id: string;
  readonly name: string;
  readonly slug: string;
  readonly line: LineLabel;
  readonly category: TypeLabel;
  readonly descriptionPlain?: string | null;
  readonly mainImage?: SauceCardImage | null;
}

export type SortOrder = "az" | "za";
