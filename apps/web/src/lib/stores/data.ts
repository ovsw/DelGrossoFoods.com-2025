/**
 * Store location data for "Where to Buy" page
 */

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
const o = (note?: string): ProductLineInfo => ({
  line: "original",
  availability: note ? "specific-location" : "all",
  note,
});
const org = (note?: string): ProductLineInfo => ({
  line: "organic",
  availability: "specific-location",
  note,
});
const lf = (
  availability: "all" | "select" | "specific-location" = "all",
  note?: string,
): ProductLineInfo => ({ line: "la-famiglia", availability, note });
const sp = (note?: string): ProductLineInfo => ({
  line: "specialty",
  availability: note ? "specific-location" : "all",
  note,
});

const rawStateData: Record<string, Record<string, ProductLineInfo[]>> = {
  Alabama: {
    Ingles: [lf()],
    Kroger: [lf("select")],
    Publix: [lf()],
    "Rouse's": [lf("select")],
    "Winn Dixie": [lf()],
  },
  Arkansas: { Kroger: [lf("select")] },
  Arizona: {
    "Albertson's/Safeway": [sp("Southwestern Division")],
  },
  California: {
    "Bel Air Market": [lf()],
    "Draeger's": [lf()],
    "Nob Hill Food": [lf()],
    "Lunardi's": [lf()],
    "Mollie Stone's Markets": [lf()],
    "Raley's": [lf()],
    Ralphs: [lf()],
    "Bristol Farms": [sp("Southern CA")],
  },
  Connecticut: {
    "Shop Rite": [lf("select")],
    "Stop & Shop": [sp()],
  },
  Delaware: {
    "Harris Teeter": [lf()],
    Weis: [lf(), sp()],
  },
  "District of Columbia": {
    "Harris Teeter": [lf()],
    "Whole Foods": [
      lf("specific-location", "Sloppy Joe Only"),
      sp("Mid-Atlantic Division"),
    ],
  },
  Florida: {
    "Fresco y Mas": [lf()],
    "Harris Teeter": [lf()],
    "Harvey's": [lf()],
    "Milam's Market": [lf()],
    Publix: [lf()],
    "Winn Dixie": [lf()],
  },
  Georgia: {
    "Harris Teeter": [lf()],
    "Harvey's": [lf()],
    Ingles: [lf()],
    Kroger: [lf("select")],
    Publix: [lf()],
    "Winn Dixie": [lf()],
  },
  Hawaii: {
    "Island Naturals Market": [lf()],
    Foodland: [lf()],
    "Natural Grocers": [sp("Most locations")],
  },
  Idaho: {
    Albertsons: [lf("select")],
    "Rosauer's": [lf()],
  },
  Illinois: {
    "Fresh Thyme": [lf("specific-location", "Sloppy Joe Only")],
    Jewel: [lf("select")],
    Kroger: [lf("select")],
    Meijer: [lf()],
  },
  Indiana: {
    "Fresh Thyme": [lf("specific-location", "Sloppy Joe Only")],
    Kroger: [lf("select")],
    "Market District": [lf()],
    Meijer: [lf()],
  },
  Kansas: { Kroger: [lf("select")] },
  Kentucky: {
    "Fresh Thyme": [lf("specific-location", "Sloppy Joe Only")],
    Kroger: [lf("select")],
    Meijer: [lf()],
    Publix: [lf()],
    "Whole Foods": [lf("specific-location", "Sloppy Joe Only")],
  },
  Louisiana: {
    "Breaux Mart": [lf()],
    Calandros: [lf("all", "Baton Rouge")],
    "Robért Fresh Market": [lf()],
    "Rouse's": [lf()],
    "Winn Dixie": [lf()],
  },
  Maine: {
    Hannaford: [lf(), sp()],
  },
  Maryland: {
    "Giant Eagle": [lf(), o()],
    "Graul's": [lf()],
    "Harris Teeter": [lf()],
    Weis: [lf(), o(), sp()],
    "Whole Foods": [
      lf("specific-location", "Sloppy Joe Only"),
      sp("Mid-Atlantic Division"),
    ],
  },
  Massachusetts: {
    "Roche Bros.": [lf()],
    Hannaford: [sp()],
    "Stop & Shop": [sp()],
  },
  Michigan: {
    "Fresh Thyme": [lf("specific-location", "Sloppy Joe Only")],
    Kroger: [lf("select")],
    Meijer: [lf()],
    "Oleson's": [lf()],
  },
  Minnesota: {
    "Cub Foods": [lf("select")],
    "Fresh Thyme": [lf("specific-location", "Sloppy Joe Only")],
    "Jerry's": [lf()],
    "Kowalski's": [lf()],
    "Lunds & Byerly's": [lf()],
  },
  Mississippi: {
    Kroger: [lf("select")],
    "Rouse's": [lf("select")],
    "Winn Dixie": [lf()],
  },
  Missouri: {
    "Fresh Thyme": [lf("specific-location", "Sloppy Joe Only")],
    "Dierberg's": [lf()],
  },
  Montana: {
    "Albertson's": [lf("select")],
    "Joe's Parkway": [lf("all", "Bozeman")],
    "Rosauer's": [lf()],
  },
  Nebraska: {
    "Fresh Thyme": [lf("specific-location", "Sloppy Joe Only")],
  },
  Nevada: {
    "Raley's": [lf()],
    "Albertson's/Safeway": [sp("Southern NV - Southwestern Division")],
  },
  "New Hampshire": {
    Hannaford: [lf(), sp()],
  },
  "New Jersey": {
    "Shop Rite": [lf("select")],
    "Whole Foods": [
      lf("specific-location", "Sloppy Joe Only; Select Stores"),
      sp("Southern NJ - Mid-Atlantic Division"),
    ],
    "Uncle Giuseppe's": [lf()],
    Weis: [o(), sp()],
    "Stop & Shop": [sp()],
  },
  "New Mexico": {
    "Albertson's/Safeway": [sp("Western NM - Southwestern Division")],
  },
  "New York": {
    "Shop Rite": [lf("select")],
    Tops: [lf()],
    "Uncle Giuseppe's": [lf()],
    Weis: [o(), sp()],
    Hannaford: [sp()],
    "Stop & Shop": [sp()],
  },
  "North Carolina": {
    "Harris Teeter": [lf()],
    "Harvey's": [lf()],
    Ingles: [lf()],
    Kroger: [lf("select")],
    Publix: [lf()],
  },
  Ohio: {
    "Fresh Thyme": [lf("specific-location", "Sloppy Joe Only")],
    "Giant Eagle": [lf(), o(), org("Altoona only")],
    Kroger: [lf("select")],
    "Market District": [lf()],
    Meijer: [lf()],
    "Whole Foods": [
      lf("specific-location", "Sloppy Joe Only"),
      sp("Mid-Atlantic Division"),
    ],
    Acme: [o()],
    "Marc's": [o()],
    "Shop N Save": [o()],
  },
  Oregon: {
    "Albertson's": [lf()],
    "Market of Choice": [lf()],
    "New Seasons": [lf()],
    "Rosauer's": [lf(), sp("Pacific NW")],
    Safeway: [lf()],
  },
  Pennsylvania: {
    "Fresh Thyme": [lf("specific-location", "Sloppy Joe Only")],
    "Giant Eagle": [lf(), o(), org("Altoona only")],
    Giant: [lf(), o()],
    "Martin's": [lf(), o()],
    "Price Chopper": [lf()],
    "Shop Rite": [lf("select")],
    Weis: [lf(), o(), org("Altoona only"), sp()],
    Wegmans: [
      lf("specific-location", "State College only"),
      o("State College only"),
    ],
    "Whole Foods": [
      lf("specific-location", "Sloppy Joe Only"),
      sp("Mid-Atlantic Division"),
    ],
    "Shur Fine": [o()],
    "Shop N Save": [o()],
    "Wal-Mart": [o("Select PA locations")],
    "Hometown Market": [org()],
  },
  "Rhode Island": {
    "Dave's Marketplace": [lf()],
    "Stop & Shop": [sp()],
  },
  "South Carolina": {
    "Harris Teeter": [lf()],
    "Harvey's": [lf()],
    Ingles: [lf()],
    Kroger: [lf("select")],
    Publix: [lf()],
  },
  "South Dakota": {
    Safeway: [lf("select")],
  },
  Tennessee: {
    "Harris Teeter": [lf()],
    Ingles: [lf()],
    Kroger: [lf("select")],
    Publix: [lf()],
  },
  Texas: {
    "Albertson's": [
      lf("specific-location", "Sloppy Joe Only"),
      sp("El Paso - Southwestern Division"),
    ],
    Kroger: [lf()],
    "Randall's": [lf("specific-location", "Sloppy Joe Only")],
    "Tom Thumb": [lf("specific-location", "Sloppy Joe Only")],
  },
  Utah: {
    "Associated Food Stores": [lf("specific-location", "Sloppy Joe Only")],
    "Albertson's/Safeway": [sp("Southern UT - Southwestern Division")],
  },
  Vermont: {
    Hannaford: [lf(), sp()],
  },
  Virginia: {
    "Harris Teeter": [lf()],
    Ingles: [lf()],
    Kroger: [lf("select")],
    "Martin's": [lf(), o()],
    Publix: [lf()],
    Safeway: [lf("select")],
    Weis: [lf(), sp()],
    "Whole Foods": [
      lf("specific-location", "Sloppy Joe Only"),
      sp("Mid-Atlantic Division"),
    ],
  },
  Washington: {
    "New Seasons": [lf()],
    "Rosauer's": [lf(), sp("Pacific NW")],
    "Super 1": [lf(), sp("Pacific NW")],
    "Yoke's": [lf(), sp("Pacific NW")],
  },
  "West Virginia": {
    "Giant Eagle": [lf(), o()],
    Kroger: [lf("select")],
    Weis: [lf()],
  },
  Wisconsin: {
    "Fresh Thyme": [lf("specific-location", "Sloppy Joe Only")],
    Meijer: [lf()],
    "Sendik's": [lf("specific-location", "Sloppy Joe Only")],
  },
  Wyoming: {
    "Albertson's": [lf("select")],
  },
};

export const storeLocations: StateStores[] = Object.entries(rawStateData)
  .map(([state, stores]) => ({
    state,
    stores: Object.entries(stores).map(([name, productLines]) => ({
      name,
      productLines,
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
  "la-famiglia": "La Famiglia",
  specialty: "Sloppy Joe, Salsa & Meatballs",
};
