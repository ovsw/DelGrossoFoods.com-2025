export const whereToBuyProductLines = [
  "Original",
  "Organic",
  "LFD - pizza and pasta sauce",
  "LFD - Sloppy Joe Sauce",
] as const;

export type WhereToBuyProductLine = (typeof whereToBuyProductLines)[number];

export type WhereToBuyProductLineInfo = {
  line: WhereToBuyProductLine;
  availability: "all" | "select" | "specific-location";
  note?: string;
};

export type WhereToBuyStoreChain = {
  name: string;
  productLines: WhereToBuyProductLineInfo[];
};

export type WhereToBuyStateStores = {
  state: string;
  stores: WhereToBuyStoreChain[];
};

export type WhereToBuyProductLineLabels = Record<WhereToBuyProductLine, string>;

export type WhereToBuyStoreLogos = Record<string, string>;

export type WhereToBuyProductFilterOption = {
  value: "all" | WhereToBuyProductLine;
  label: string;
};
