import {
  expandRedirectSpecs,
  type NextRedirect,
  type RedirectSpec,
} from "./shared";

const legacyRecipePageSlugs = [
  "aunt-cindys-eggplant-casserole",
  "baked-barbecue-wings",
  "baked-ziti",
  "bbq-chicken-french-bread-pizza",
  "beef-tips-italiana",
  "breakfast-casserole",
  "cauliflower-crust-pizza",
  "cheesy-artichoke-bread",
  "cheesy-sausage-skillet",
  "chicken-cacciatore",
  "crab-soup",
  "deep-dish-lasagna",
  "eggplant-towers",
  "finizio-tomato-bean-soup",
  "fried-mozzarella",
  "huntin-camp-chili",
  "italian-sliders",
  "italian-style-meatloaf",
  "italian-tailgate-squares",
  "jalepeno-popper-grilled-cheese",
  "kalamata-spaghetti",
  "laguna-splash-stromboli",
  "lentil-soup",
  "loaded-nachos",
  "mediterranean-flatbread-pizza",
  "minestrone",
  "parmesan-potato-bites",
  "pasta-fagioli",
  "pasta-risottata",
  "pepperoni-pizza-cups",
  "pepperoni-pizza-peppers",
  "pizza-burger-bites",
  "pizza-fritta",
  "portobello-bun-burgers",
  "pulled-pork-sliders",
  "ravioli-lasagna",
  "ravioli-with-tomato-basil-cream-sauce",
  "red-zone-chili",
  "roasted-fennel-onion-pizza",
  "rosemary-parmesan-zucchini-boats",
  "spicy-zucchini-noodles",
  "stuffed-green-peppers",
  "stuffed-mushroom",
  "stuffed-portobello-mushrooms",
  "stuffed-shells",
  "sweet-sausage-sliders",
  "three-cheese-stuffed-tomatoes",
  "tomato-zucchini-bake",
  "touchdown-pizza-dip",
  "vegetable-medley-romesco",
] as const;

const legacyRecipeSlugOverrides: Partial<
  Record<(typeof legacyRecipePageSlugs)[number], string>
> = {
  "roasted-fennel-onion-pizza": "roasted-fennel-and-onion-pizza",
  "stuffed-mushroom": "stuffed-mushrooms",
};

export const legacyRecipeRedirectSpec: readonly RedirectSpec[] = [
  { source: "/delgrosso-dish", destination: "/recipes" },
  {
    source: "/delgrosso-dish/video-recipes",
    destination: "/recipes?hasVideo=1",
  },
  {
    source: "/delgrosso-dish/pizzas-and-calzones",
    destination: "/recipes?category=pizzas-and-calzones",
  },
  ...legacyRecipePageSlugs.map((legacySlug) => ({
    source: `/delgrosso-dish/recipes/${legacySlug}`,
    destination: `/recipes/${legacyRecipeSlugOverrides[legacySlug] ?? legacySlug}`,
  })),
];

export function getLegacyRecipeRedirects(): NextRedirect[] {
  return expandRedirectSpecs(legacyRecipeRedirectSpec);
}
