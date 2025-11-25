"use client";

import Fuse, { type FuseResult } from "fuse.js";
import { Info, Store } from "lucide-react";
import { type JSX, useCallback, useEffect, useMemo, useState } from "react";

import { type RootProps } from "../lib/data-attributes";
import { cn } from "../lib/utils";
import { Badge } from "./badge";
import { Combobox, type ComboboxOption } from "./combobox";
import type {
  WhereToBuyProductFilterOption,
  WhereToBuyProductLine,
  WhereToBuyProductLineInfo,
  WhereToBuyProductLineLabels,
  WhereToBuyStoreChain,
} from "./where-to-buy-types";

type ProductFilter = "all" | WhereToBuyProductLine;

const defaultProductFilterOptions: WhereToBuyProductFilterOption[] = [
  { value: "all", label: "All Products" },
  { value: "original", label: "Original Sauces" },
  { value: "organic", label: "Organic Sauces" },
  { value: "la-famiglia", label: "La Famiglia DelGrosso" },
  { value: "specialty", label: "Sloppy Joe, Salsa & Meatballs" },
];

export type WhereToBuyClientProps = {
  allStates: string[];
  getStoresByState: (
    state: string,
    productLineFilter?: WhereToBuyProductLine,
  ) => WhereToBuyStoreChain[];
  productLineLabels: WhereToBuyProductLineLabels;
  productFilterOptions?: WhereToBuyProductFilterOption[];
  forcedProductFilter?: WhereToBuyProductLine;
  showProductLineBadges?: boolean;
  rootProps?: RootProps<HTMLDivElement>;
};

export function WhereToBuyClient({
  allStates,
  getStoresByState,
  productLineLabels,
  productFilterOptions,
  forcedProductFilter,
  showProductLineBadges = true,
  rootProps,
}: WhereToBuyClientProps) {
  const [selectedState, setSelectedState] = useState<string>("");
  const [productFilter, setProductFilter] = useState<ProductFilter>("all");

  const effectiveProductFilterOptions =
    productFilterOptions ?? defaultProductFilterOptions;
  const showProductFilter = effectiveProductFilterOptions.length > 0;

  useEffect(() => {
    if (!showProductFilter && productFilter !== "all") {
      setProductFilter("all");
    }
  }, [showProductFilter, productFilter]);

  const stateOptions: ComboboxOption[] = useMemo(
    () =>
      allStates.map((state) => ({
        label: state,
        value: state,
      })),
    [allStates],
  );

  const filterStateOptions = useCallback(
    (options: ComboboxOption[], searchValue: string) => {
      if (!searchValue.trim()) {
        return options;
      }
      const fuse = new Fuse(options, {
        keys: ["label"],
        threshold: 0.3,
        includeScore: true,
      });
      return fuse
        .search(searchValue)
        .map((result: FuseResult<ComboboxOption>) => result.item);
    },
    [],
  );

  const filteredStores = useMemo<WhereToBuyStoreChain[]>(() => {
    if (!selectedState) return [];

    if (forcedProductFilter) {
      return getStoresByState(selectedState, forcedProductFilter);
    }

    if (!showProductFilter) {
      return getStoresByState(selectedState);
    }

    if (productFilter === "all") {
      return getStoresByState(selectedState);
    }

    return getStoresByState(selectedState, productFilter);
  }, [
    selectedState,
    productFilter,
    getStoresByState,
    showProductFilter,
    forcedProductFilter,
  ]);

  const resultsCount = filteredStores.length;
  const hasResults = resultsCount > 0;
  const showEmptyState = selectedState && !hasResults;

  const { className: rootClassName, ...restRootProps } = rootProps ?? {};

  return (
    <div className={cn("mt-12", rootClassName)} {...restRootProps}>
      <div className="bg-white/50 rounded-lg border border-input p-6 mb-8">
        <div
          className={cn(
            "grid grid-cols-1 gap-6",
            showProductFilter && "md:grid-cols-2",
          )}
        >
          <div>
            <label
              htmlFor="state-combobox"
              className="block text-lg font-medium mb-2"
            >
              Select Your State
            </label>
            <Combobox
              id="state-combobox"
              options={stateOptions}
              value={selectedState}
              onSelect={setSelectedState}
              placeholder="Choose a state..."
              searchPlaceholder="Type to search states..."
              emptyMessage="No states found."
              filterOptions={filterStateOptions}
              aria-label="Select your state"
            />
          </div>

          {showProductFilter && (
            <div>
              <label
                htmlFor="product-select"
                className="block text-lg font-medium mb-2"
              >
                Looking For
              </label>
              <div className="relative">
                <select
                  id="product-select"
                  className="w-full appearance-none rounded-md border border-input bg-white/70 px-3 py-2 text-base ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  value={productFilter}
                  onChange={(e) =>
                    setProductFilter(e.currentTarget.value as ProductFilter)
                  }
                  aria-label="Select product type"
                >
                  {effectiveProductFilterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-muted-foreground">
                  ▾
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {selectedState && (
        <div>
          <div className="mb-4">
            <p className="text-lg font-medium text-muted-foreground">
              {hasResults
                ? `Found ${resultsCount} store${resultsCount === 1 ? "" : "s"} in ${selectedState}`
                : null}
            </p>
          </div>

          {showEmptyState ? (
            <div className="text-center py-12 bg-white/50 rounded-lg border border-input">
              <p className="text-lg text-muted-foreground mb-2">
                No stores found in {selectedState}
                {showProductFilter && productFilter !== "all"
                  ? ` for ${productLineLabels[productFilter]}`
                  : null}
              </p>
              <p className="text-sm text-muted-foreground">
                Try selecting a different state or product filter
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredStores.map((store) => (
                <StoreCard
                  key={store.name}
                  store={store}
                  productLineLabels={productLineLabels}
                  showProductLineBadges={showProductLineBadges}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {!selectedState && (
        <div className="text-center py-12 bg-white/50 rounded-lg border border-input">
          <p className="text-lg text-muted-foreground">
            Select a state to find stores near you
          </p>
        </div>
      )}
    </div>
  );
}

type StoreCardProps = {
  store: WhereToBuyStoreChain;
  productLineLabels: WhereToBuyProductLineLabels;
  showProductLineBadges: boolean;
};

function StoreCard({
  store,
  productLineLabels,
  showProductLineBadges,
}: StoreCardProps) {
  const productLineDetails = store.productLines.reduce<JSX.Element[]>(
    (
      acc: JSX.Element[],
      pl: WhereToBuyProductLineInfo,
      idx: number,
    ): JSX.Element[] => {
      const showAvailability = pl.availability === "select";
      const showNote = Boolean(pl.note);
      const shouldRender =
        showProductLineBadges || showAvailability || showNote;

      if (!shouldRender) {
        return acc;
      }

      acc.push(
        <div
          key={`${store.name}-${pl.line}-${idx}`}
          className="flex items-center gap-1 flex-wrap"
        >
          {showProductLineBadges && (
            <Badge
              variant={getProductLineBadgeVariant(pl.line)}
              text={productLineLabels[pl.line]}
              className="min-w-fit"
            />
          )}
          {showAvailability && (
            <span className="inline-flex items-center gap-0.5 tracking-tight text-xs text-th-dark-700/80">
              <Info className="w-3 h-3 flex-shrink-0" />
              <span>Select stores (call ahead)</span>
            </span>
          )}
          {showNote && (
            <span className="inline-flex items-center gap-0.5 tracking-tight text-xs text-th-dark-700/80">
              <Info className="w-3 h-3 flex-shrink-0" />
              <span>{pl.note}</span>
            </span>
          )}
        </div>,
      );

      return acc;
    },
    [],
  );
  const hasProductLineDetails = productLineDetails.length > 0;

  return (
    <div className="bg-white/50 rounded-lg border border-input shadow-sm p-4 transition-shadow">
      <div
        className={cn(
          "flex items-center gap-3",
          hasProductLineDetails && "mb-3",
        )}
      >
        <div className="flex-shrink-0 flex items-center justify-center bg-brand-green rounded w-16 h-16">
          <Store className="w-6 h-6 text-th-light-100" />
        </div>
        <h3 className="text-lg font-semibold">{store.name}</h3>
      </div>

      {hasProductLineDetails && (
        <div className="flex items-center gap-2.5 flex-wrap">
          {productLineDetails}
        </div>
      )}
    </div>
  );
}

function getProductLineBadgeVariant(
  line: WhereToBuyProductLine,
): "original" | "organic" | "premium" | "neutral" {
  switch (line) {
    case "original":
      return "original";
    case "organic":
      return "organic";
    case "la-famiglia":
      return "premium";
    case "specialty":
      return "neutral";
    default:
      return "neutral";
  }
}
