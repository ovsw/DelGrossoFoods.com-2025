/**
 * Store location data for "Where to Buy" page
 */

import storeLocationData from "./store-locations.json";

export type ProductLine = "original" | "organic" | "la-famiglia" | "specialty";

export type ProductLineInfo = {
  line: ProductLine;
  availability: "all" | "select" | "specific-location";
  note?: string;
};

export type StoreChain = {
  name: string;
  productLines: ProductLineInfo[];
};

export type StateStores = {
  state: string;
  stores: StoreChain[];
};

// Helper to create product line entries
const createOriginalLine = (note?: string): ProductLineInfo => ({
  line: "original",
  availability: note ? "specific-location" : "all",
  note,
});
const createOrganicLine = (note?: string): ProductLineInfo => ({
  line: "organic",
  availability: "specific-location",
  note,
});
const createLaFamigliaLine = (
  availability: "all" | "select" | "specific-location" = "all",
  note?: string,
): ProductLineInfo => ({ line: "la-famiglia", availability, note });
const createSpecialtyLine = (note?: string): ProductLineInfo => ({
  line: "specialty",
  availability: note ? "specific-location" : "all",
  note,
});

type RawProductLineEntry = {
  line: ProductLine;
  availability?: ProductLineInfo["availability"];
  note?: string;
};

type RawStoreData = Record<string, Record<string, RawProductLineEntry[]>>;

const rawStoreData = storeLocationData as RawStoreData;

const mapToProductLineInfo = ({
  line,
  availability,
  note,
}: RawProductLineEntry): ProductLineInfo => {
  switch (line) {
    case "original": {
      const base = createOriginalLine(note);
      return availability ? { ...base, availability } : base;
    }
    case "organic": {
      const base = createOrganicLine(note);
      return availability ? { ...base, availability } : base;
    }
    case "la-famiglia":
      return createLaFamigliaLine(availability ?? "all", note);
    case "specialty": {
      const base = createSpecialtyLine(note);
      return availability ? { ...base, availability } : base;
    }
    default: {
      const exhaustiveCheck: never = line;
      throw new Error(`Unsupported product line: ${exhaustiveCheck}`);
    }
  }
};

export const storeLocations: StateStores[] = Object.entries(rawStoreData)
  .map(([state, stores]) => ({
    state,
    stores: Object.entries(stores).map(([name, productLines]) => ({
      name,
      productLines: productLines.map(mapToProductLineInfo),
    })),
  }))
  .sort((a, b) => a.state.localeCompare(b.state));

export const allStates = storeLocations.map((s) => s.state);

export function getStoresByState(
  state: string,
  productLineFilter?: ProductLine,
): StoreChain[] {
  const found = storeLocations.find((s) => s.state === state);
  if (!found) return [];

  if (!productLineFilter) return found.stores;

  return found.stores
    .map((store) => ({
      ...store,
      productLines: store.productLines.filter(
        (pl) => pl.line === productLineFilter,
      ),
    }))
    .filter((store) => store.productLines.length > 0);
}

export const productLineLabels: Record<ProductLine, string> = {
  original: "Original",
  organic: "Organic",
  "la-famiglia": "La Famiglia DelGrosso",
  specialty: "Sloppy Joe, Salsa & Meatballs",
};

// Store logo mapping - returns path to logo or undefined for fallback
export const storeLogos: Record<string, string> = {
  Albertsons: "/images/logos/stores/albertsons-logo-500x281.png",
  "Albertsons/Safeway":
    "/images/logos/stores/albertsons-safeway-combo-logo.png",
  "Giant Eagle": "/images/logos/stores/giant-eagle-logo-500x281.png",
  Hannaford: "/images/logos/stores/hannaford_logo.svg.png",
  "Harris Teeter": "/images/logos/stores/harris-teeter-logo-500x281.png",
  Kroger: "/images/logos/stores/logo-kroger-500x281.png",
  Meijer: "/images/logos/stores/Meijer-Logo-500x281.png",
  Publix: "/images/logos/stores/publix_logo-624x400.png",
  Safeway: "/images/logos/stores/safeway-logo-500x281.png",
  "Shop Rite": "/images/logos/stores/shoprite-logo-500x281.png",
  Wegmans: "/images/logos/stores/wegmans-logo-500x281.png",
  Weis: "/images/logos/stores/weis-logo.jpg",
  "Whole Foods": "/images/logos/stores/whole-foods-logo-500x281.png",
  "Winn Dixie": "/images/logos/stores/winn-dixie-logo.png",
};
