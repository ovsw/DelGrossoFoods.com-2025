"use client";

import { Badge } from "@workspace/ui/components/badge";
import { useMemo, useState } from "react";

import {
  allStates,
  getStoresByState,
  type ProductLine,
  productLineLabels,
  type StoreChain,
} from "@/lib/stores/data";

type ProductFilter = "all" | ProductLine;

export function WhereToBuyClient() {
  const [selectedState, setSelectedState] = useState<string>("");
  const [productFilter, setProductFilter] = useState<ProductFilter>("all");

  const filteredStores = useMemo<StoreChain[]>(() => {
    if (!selectedState) return [];

    if (productFilter === "all") {
      return getStoresByState(selectedState);
    }

    return getStoresByState(selectedState, productFilter);
  }, [selectedState, productFilter]);

  const resultsCount = filteredStores.length;
  const hasResults = resultsCount > 0;
  const showEmptyState = selectedState && !hasResults;

  return (
    <div className="mt-12">
      {/* Filter Controls */}
      <div className="bg-white/70 rounded-lg border border-input p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* State Selector */}
          <div>
            <label
              htmlFor="state-select"
              className="block text-lg font-medium mb-2"
            >
              Select Your State
            </label>
            <div className="relative">
              <select
                id="state-select"
                className="w-full appearance-none rounded-md border border-input bg-white/70 px-3 py-2 text-base ring-offset-background focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={selectedState}
                onChange={(e) => setSelectedState(e.currentTarget.value)}
                aria-label="Select your state"
              >
                <option value="">Choose a state...</option>
                {allStates.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-muted-foreground">
                ▾
              </span>
            </div>
          </div>

          {/* Product Filter */}
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
                <option value="all">All Products</option>
                <option value="original">Original Sauces</option>
                <option value="organic">Organic Sauces</option>
                <option value="la-famiglia">La Famiglia DelGrosso</option>
                <option value="specialty">
                  Sloppy Joe, Salsa &amp; Meatballs
                </option>
              </select>
              <span className="pointer-events-none absolute inset-y-0 end-3 flex items-center text-muted-foreground">
                ▾
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Results */}
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
                {productFilter !== "all"
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
                <StoreCard key={store.name} store={store} />
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
  store: StoreChain;
};

function StoreCard({ store }: StoreCardProps) {
  return (
    <div className="bg-white rounded-lg border border-input p-4 hover:border-brand-green/50 transition-colors">
      <h3 className="text-lg font-semibold mb-3">{store.name}</h3>

      <div className="space-y-2">
        {store.productLines.map((pl, idx) => (
          <div key={idx}>
            <div className="flex items-start gap-2 flex-wrap">
              <Badge
                variant={getProductLineBadgeVariant(pl.line)}
                text={productLineLabels[pl.line]}
              />
              {pl.availability === "select" && (
                <Badge variant="accent" text="Select Stores" />
              )}
            </div>
            {pl.note && (
              <p className="mt-1 text-xs text-muted-foreground">
                Note: {pl.note}
              </p>
            )}
            {pl.availability === "select" && !pl.note && (
              <p className="mt-1 text-xs text-muted-foreground">
                Call ahead to confirm your local store carries this product
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function getProductLineBadgeVariant(
  line: ProductLine,
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
  }
}
