import {
  expandRedirectSpecs,
  type NextRedirect,
  type RedirectSpec,
} from "./shared";

export const legacyProductRedirectSpec: readonly RedirectSpec[] = [
  { source: "/products/", destination: "/sauces" },
  {
    source: "/products/original/",
    destination: "/sauces?productLine=original",
  },
  {
    source: "/products/original/pasta-sauce/",
    destination: "/sauces?productLine=original&sauceType=pasta",
  },
  {
    source: "/products/original/pasta-sauce/marinara-all-natural-pasta-sauce/",
    destination: "/sauces/marinara-pasta-sauce",
  },
  {
    source:
      "/products/original/pasta-sauce/garlic-and-cheese-all-natural-pasta-sauce/",
    destination: "/sauces/garlic-and-cheese-pasta-sauce",
  },
  {
    source:
      "/products/original/pasta-sauce/roasted-garlic-all-natural-pasta-sauce/",
    destination: "/sauces/roasted-garlic-pasta-sauce",
  },
  {
    source:
      "/products/original/pasta-sauce/meat-flavored-all-natural-pasta-sauce/",
    destination: "/sauces/meat-flavored-pasta-sauce",
  },
  {
    source: "/products/original/pasta-sauce/meatless-all-natural-pasta-sauce/",
    destination: "/sauces/meatless-pasta-sauce",
  },
  {
    source: "/products/original/pasta-sauce/mushroom-all-natural-pasta-sauce/",
    destination: "/sauces/mushroom-pasta-sauce",
  },
  {
    source:
      "/products/original/pasta-sauce/garden-style-all-natural-pasta-sauce/",
    destination: "/sauces/garden-style-pasta-sauce",
  },
  {
    source:
      "/products/original/pasta-sauce/three-cheese-all-natural-pasta-sauce/",
    destination: "/sauces/three-cheese-pasta-sauce",
  },
  {
    source:
      "/products/original/pasta-sauce/extra-tomatoes-all-natural-pasta-sauce/",
    destination: "/sauces/extra-tomatoes-pasta-sauce",
  },
  {
    source:
      "/products/original/pasta-sauce/pepperoni-flavored-all-natural-pasta-sauce/",
    destination: "/sauces/pepperoni-flavored-pasta-sauce",
  },
  {
    source: "/products/original/pasta-sauce/tomato-basil-pasta-sauce/",
    destination: "/sauces/tomato-basil",
  },
  {
    source: "/products/original/pizza-sauce/",
    destination: "/sauces?productLine=original&sauceType=pizza",
  },
  {
    source: "/products/original/pizza-sauce/deluxe-pizza-sauce/",
    destination: "/sauces/deluxe-pizza-sauce",
  },
  {
    source: "/products/original/pizza-sauce/pepperoni-pizza-sauce/",
    destination: "/sauces/pepperoni-flavored-pizza-sauce-original",
  },
  {
    source: "/products/original/pizza-sauce/new-york-style-pizza-sauce/",
    destination: "/sauces/new-york-style-pizza-sauce",
  },
  {
    source: "/products/original/salsa/",
    destination: "/sauces?productLine=original&sauceType=salsa",
  },
  {
    source: "/products/original/salsa/mild-salsa/",
    destination: "/sauces/mild-salsa",
  },
  {
    source: "/products/original/salsa/medium-salsa/",
    destination: "/sauces/medium-salsa",
  },
  {
    source: "/products/original/salsa/hot-salsa/",
    destination: "/sauces/hot-salsa",
  },
  {
    source: "/products/original/sandwich-sauce/",
    destination: "/sauces?productLine=original&sauceType=sandwich",
  },
  {
    source: "/products/original/sandwich-sauce/sloppy-joe-sauce/",
    destination: "/sauces/original-sloppy-joe-sauce",
  },
  {
    source: "/products/organic/",
    destination: "/sauces?productLine=organic",
  },
  {
    source: "/products/organic/pasta-sauce/",
    destination: "/sauces?productLine=organic&sauceType=pasta",
  },
  {
    source: "/products/organic/pasta-sauce/organic-roasted-garlic-pasta-sauce/",
    destination: "/sauces/organic-roasted-garlic-pasta-sauce",
  },
  {
    source: "/products/organic/pasta-sauce/organic-marinara-pasta-sauce/",
    destination: "/sauces/organic-marinara-pasta-sauce",
  },
  {
    source: "/products/organic/pasta-sauce/organic-tomato-basil-pasta-sauce/",
    destination: "/sauces/organic-tomato-basil-pasta-sauce",
  },
  {
    source: "/products/ultra-premium/",
    destination: "/sauces?productLine=premium",
  },
  {
    source: "/products/ultra-premium/red-pasta-sauce/",
    destination: "/sauces?productLine=premium&sauceType=pasta",
  },
  {
    source: "/products/ultra-premium/white-pasta-sauce/",
    destination: "/sauces?productLine=premium&sauceType=pasta",
  },
  {
    source: "/products/ultra-premium/pizza-sauce/",
    destination: "/sauces?productLine=premium&sauceType=pizza",
  },
  {
    source: "/products/ultra-premium/sandwich-sauce/",
    destination: "/sauces?productLine=premium&sauceType=sandwich",
  },
] as const;

export function getLegacyProductRedirects(): NextRedirect[] {
  return expandRedirectSpecs(legacyProductRedirectSpec);
}
