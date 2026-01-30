"use client";

import Fuse, { type FuseResult } from "fuse.js";
import { Info } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";

import { type RootProps } from "../lib/data-attributes";
import { cn } from "../lib/utils";
import { Badge } from "./badge";
import { Combobox, type ComboboxOption } from "./combobox";
import type {
  WhereToBuyProductFilterOption,
  WhereToBuyProductLine,
  WhereToBuyProductLineLabels,
  WhereToBuyStoreChain,
} from "./where-to-buy-types";
import { whereToBuyProductLines } from "./where-to-buy-types";

type ProductFilter = "all" | WhereToBuyProductLine;

const defaultProductFilterOptions: WhereToBuyProductFilterOption[] = [
  { value: "all", label: "All Products" },
  ...whereToBuyProductLines.map((line) => ({
    value: line,
    label: line,
  })),
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
                  className="w-full appearance-none rounded-md border border-brand-green bg-white/70 px-3 py-2 text-base font-normal text-brand-green shadow-xs ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-brand-green/80">
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
            <ul className="grid gap-3 sm:grid-cols-2">
              {filteredStores.map((store) => (
                <StoreRow
                  key={store.name}
                  store={store}
                  productLineLabels={productLineLabels}
                  showProductLineBadges={showProductLineBadges}
                />
              ))}
            </ul>
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

type StoreRowProps = {
  store: WhereToBuyStoreChain;
  productLineLabels: WhereToBuyProductLineLabels;
  showProductLineBadges: boolean;
};

function StoreRow({
  store,
  productLineLabels,
  showProductLineBadges,
}: StoreRowProps) {
  const productLineDetails = store.productLines.map((pl, idx) => {
    const showAvailability = pl.availability === "select";
    const showNote = Boolean(pl.note);
    const shouldRender = showProductLineBadges || showAvailability || showNote;

    if (!shouldRender) {
      return null;
    }

    return (
      <div
        key={`${store.name}-${pl.line}-${idx}`}
        className="flex flex-wrap items-center gap-2"
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
      </div>
    );
  });
  const hasProductLineDetails = productLineDetails.some(Boolean);

  return (
    <li className="rounded-lg border border-input bg-white/50 px-4 py-3">
      <h3 className="text-base font-semibold sm:text-lg">{store.name}</h3>

      {hasProductLineDetails && (
        <div className="mt-2 flex flex-col gap-2">{productLineDetails}</div>
      )}
    </li>
  );
}

function getProductLineBadgeVariant(
  line: WhereToBuyProductLine,
): "original" | "organic" | "premium" | "neutral" {
  switch (line) {
    case "Original":
      return "original";
    case "Organic":
      return "organic";
    case "LFD - pizza and pasta sauce":
      return "premium";
    case "LFD - Sloppy Joe Sauce":
      return "premium";
    default:
      return "neutral";
  }
}
