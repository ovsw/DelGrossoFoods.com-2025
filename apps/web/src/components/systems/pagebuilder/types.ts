import type { PageBuilderBlockTypes, PagebuilderType } from "@/types";

export type PageBuilderBlockProps<T extends PageBuilderBlockTypes> =
  PagebuilderType<T> & {
    readonly isPageTop?: boolean;
  };
