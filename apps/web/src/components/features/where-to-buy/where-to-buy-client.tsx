"use client";

import { Badge } from "@workspace/ui/components/badge";
import { Info, Store } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import {
  allStates,
  getStoresByState,
  type ProductLine,
  productLineLabels,
  type StoreChain,
  storeLogos,
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
      <div className="bg-white/50 rounded-lg border border-input p-6 mb-8">
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
  const logoPath = storeLogos[store.name];
  const hasLogo = Boolean(logoPath);

  return (
    <div className="bg-white/40 rounded-lg border border-input shadow-sm p-4 transition-shadow">
      {/* Store header with logo */}
      <div className="flex items-center gap-3 mb-3">
        {hasLogo && logoPath ? (
          <div className="relative w-16 h-16 flex-shrink-0">
            <Image
              src={logoPath}
              alt={`${store.name} logo`}
              fill
              className="object-contain"
              sizes="72px"
            />
          </div>
        ) : (
          <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-brand-green rounded">
            <Store className="w-6 h-6 text-th-light-100" />
          </div>
        )}
        <h3 className="text-lg font-semibold">{store.name}</h3>
      </div>

      {/* Product lines */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {store.productLines.map((pl, idx) => (
          <div key={idx} className="flex items-center gap-1 flex-wrap">
            <Badge
              variant={getProductLineBadgeVariant(pl.line)}
              text={productLineLabels[pl.line]}
              className="min-w-fit"
            />
            {/* Inline note with info icon for select stores */}
            {pl.availability === "select" && (
              <span className="inline-flex items-center gap-0.5  tracking-tight text-xs text-th-dark-700/80">
                <Info className="w-3 h-3 flex-shrink-0" />
                <span>Select stores (call ahead)</span>
              </span>
            )}
            {/* Inline note with info icon for specific notes */}
            {pl.note && (
              <span className="inline-flex items-center gap-0.5  tracking-tight  text-xs text-th-dark-700/80">
                <Info className="w-3 h-3 flex-shrink-0" />
                <span>{pl.note}</span>
              </span>
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
