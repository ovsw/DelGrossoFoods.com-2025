export { InfoRow, RecipeBadges } from "./recipe-info";
export {
  mapSaucesToDisplay,
  type SauceDisplayItem,
  SauceLink,
  SauceList,
} from "./sauce-display";
export { buildRecipesFilterLink, hasBlocks, normalizeSauceHref } from "./utils";
export { VariantContent } from "./variant-content";

export type VariantKey = "original" | "premium";
