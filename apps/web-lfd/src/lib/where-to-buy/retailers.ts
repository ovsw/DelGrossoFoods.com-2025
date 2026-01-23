import {
  type WhereToBuyProductFilterOption,
  type WhereToBuyProductLine,
  type WhereToBuyProductLineInfo,
  type WhereToBuyProductLineLabels,
  type WhereToBuyStateStores,
  type WhereToBuyStoreChain,
} from "@workspace/ui/components/where-to-buy-types";
import { type PortableTextBlock, stegaClean } from "next-sanity";

const lfdProductLines = [
  "LFD - pizza and pasta sauce",
  "LFD - Sloppy Joe Sauce",
] as const;

type LfdProductLine = (typeof lfdProductLines)[number];

type RetailerStateEntry = {
  productLine?: string | null;
  states?: { label?: string | null; value?: string | null }[] | null;
  note?: PortableTextBlock[] | null;
};

export type RetailerDocument = {
  _id?: string;
  _type?: string;
  name?: string | null;
  productLinesByState?: RetailerStateEntry[] | null;
};

type WhereToBuyData = {
  storeLocations: WhereToBuyStateStores[];
  allStates: string[];
  productLineLabels: WhereToBuyProductLineLabels;
  productFilterOptions: WhereToBuyProductFilterOption[];
};

const productLineLabels = lfdProductLines.reduce((acc, line) => {
  acc[line] = line;
  return acc;
}, {} as WhereToBuyProductLineLabels);

const productFilterOptions: WhereToBuyProductFilterOption[] = [
  { value: "all", label: "All Products" },
  ...lfdProductLines.map((line) => ({
    value: line,
    label: line,
  })),
];

const isLfdProductLine = (value: string): value is LfdProductLine =>
  lfdProductLines.includes(value as LfdProductLine);

const toPlainText = (value?: PortableTextBlock[] | null) => {
  if (!value?.length) return null;

  const text = value
    .map((block) => {
      if (block._type !== "block") return "";
      return block.children?.map((child) => child.text).join("") ?? "";
    })
    .filter(Boolean)
    .join(" ")
    .trim();

  return text ? stegaClean(text) : null;
};

const addProductLine = (
  store: WhereToBuyStoreChain,
  line: WhereToBuyProductLine,
  note?: string | null,
) => {
  const existing = store.productLines.find((entry) => entry.line === line);
  if (existing) {
    if (note && !existing.note) {
      existing.note = note;
    }
    return;
  }
  store.productLines.push({
    line,
    availability: "all",
    ...(note ? { note } : {}),
  } satisfies WhereToBuyProductLineInfo);
};

export const buildWhereToBuyData = (
  retailers: RetailerDocument[] | null | undefined,
): WhereToBuyData => {
  const stateMap = new Map<string, Map<string, WhereToBuyStoreChain>>();

  (retailers ?? []).forEach((retailer) => {
    const displayName = retailer.name;
    if (!displayName) return;

    const storeKey = stegaClean(displayName);
    if (!storeKey) return;

    retailer.productLinesByState?.forEach((entry) => {
      const rawProductLine = entry.productLine;
      if (!rawProductLine) return;
      const cleanProductLine = stegaClean(rawProductLine);
      if (!isLfdProductLine(cleanProductLine)) return;
      const note = toPlainText(entry.note);

      entry.states?.forEach((state) => {
        const label = state?.label ?? "";
        const cleanLabel = stegaClean(label);
        if (!cleanLabel) return;

        const storeMap = stateMap.get(cleanLabel) ?? new Map();
        const store =
          storeMap.get(storeKey) ??
          ({
            name: displayName,
            productLines: [],
          } satisfies WhereToBuyStoreChain);

        addProductLine(store, cleanProductLine, note);
        storeMap.set(storeKey, store);
        stateMap.set(cleanLabel, storeMap);
      });
    });
  });

  const storeLocations = Array.from(stateMap.entries())
    .map(([state, stores]) => ({
      state,
      stores: Array.from(stores.values()).sort((a, b) =>
        a.name.localeCompare(b.name),
      ),
    }))
    .sort((a, b) => a.state.localeCompare(b.state));

  return {
    storeLocations,
    allStates: storeLocations.map((entry) => entry.state),
    productLineLabels,
    productFilterOptions,
  };
};
