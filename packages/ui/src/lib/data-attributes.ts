import type { HTMLAttributes } from "react";

type DataAttributeRecord = {
  [K in `data-${string}`]?: string | number | undefined;
};

export type RootProps<TElement extends HTMLElement = HTMLDivElement> =
  HTMLAttributes<TElement> & DataAttributeRecord;

export type DataAttributes = DataAttributeRecord;
