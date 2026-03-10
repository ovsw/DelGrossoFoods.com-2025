import {
  expandRedirectSpecs,
  type NextRedirect,
  type RedirectSpec,
} from "./shared";

export const legacyShopOnlineRedirectSpec: readonly RedirectSpec[] = [
  { source: "/shop-online", destination: "/store" },
  { source: "/shop-online/sauce", destination: "/store" },
  {
    source: "/shop-online/sauce/gift-packs",
    destination: "/store?packaging=gift",
  },
  {
    source: "/shop-online/sauce/gift-packs/italian-classics",
    destination: "/store/italian-classics-gift-pack",
  },
  {
    source: "/shop-online/sauce/gift-packs/puttanesca-gift-pack",
    destination: "/store/puttanesca-gift-pack",
  },
  {
    source: "/shop-online/sauce/gift-packs/marinara-gift-pack",
    destination: "/store/marinara-gift-pack",
  },
  {
    source: "/shop-online/sauce/gift-packs/tomato-basil-gift-pack",
    destination: "/store/tomato-basil-gift-pack",
  },
  {
    source: "/shop-online/sauce/gift-packs/fireworks-sauce-gift-pack",
    destination: "/store/fireworks-sauce-gift-pack",
  },
  {
    source: "/shop-online/sauce/gift-packs/vodka-sauce-gift-pack",
    destination: "/store/vodka-sauce-gift-pack",
  },
  {
    source: "/shop-online/sauce/gift-packs/roasted-garlic-gift-pack",
    destination: "/store/roasted-garlic-gift-pack",
  },
  {
    source: "/shop-online/sauce/four-season-selections",
    destination: "/store",
  },
  {
    source:
      "/shop-online/sauce/four-season-selections/four-seasons-all-year-gift",
    destination: "/store/four-seasons-all-year-gift",
  },
  {
    source: "/shop-online/sauce/cases-of-12",
    destination: "/store?packaging=case",
  },
  {
    source: "/shop-online/sauce/cases-of-12/mixed-case",
    destination: "/store/mixed-case",
  },
  {
    source: "/shop-online/sauce/cases-of-12/pappy-freds-old-style-pizza-sauce",
    destination: "/store/pappy-freds-old-style-pizza-sauce",
  },
  {
    source: "/shop-online/sauce/cases-of-12/aunt-cindys-roasted-garlic-gala",
    destination: "/store/aunt-cindys-roasted-garlic-gala",
  },
  {
    source: "/shop-online/sauce/cases-of-12/aunt-mary-anns-sunday-marinara",
    destination: "/store/aunt-mary-anns-sunday-marinara",
  },
  {
    source:
      "/shop-online/sauce/cases-of-12/chef-johns-tomato-basil-masterpiece",
    destination: "/store/chef-johns-tomato-basil-masterpiece",
  },
  {
    source: "/shop-online/sauce/cases-of-12/uncle-freds-fireworks-sauce",
    destination: "/store/uncle-freds-fireworks-sauce",
  },
  {
    source: "/shop-online/sauce/cases-of-12/uncle-jims-late-night-puttanesca",
    destination: "/store/uncle-jims-late-night-puttanesca",
  },
  {
    source: "/shop-online/sauce/cases-of-12/uncle-joes-vodka-celebration",
    destination: "/store/uncle-joes-vodka-celebration",
  },
  {
    source: "/shop-online/sauce/cases-of-12/aunt-lindas-classic-alfredo-sauce",
    destination: "/store/aunt-lindas-classic-alfredo",
  },
  {
    source: "/shop-online/sauce/cases-of-12/joe-joes-sloppy-joe-sauce",
    destination: "/store/joe-joes-sloppy-joe-sauce",
  },
  {
    source: "/shop-online/merchandise",
    destination: "/store?packaging=other",
  },
  {
    source: "/shop-online/merchandise/merchandise",
    destination: "/store?packaging=other",
  },
  {
    source: "/shop-online/merchandise/merchandise/la-famiglia-delgrosso-apron",
    destination: "/store/la-famiglia-delgrosso-apron",
  },
  {
    source: "/shop-online/merchandise/merchandise/free-poster",
    destination: "/store/free-18-x-24-italian-americans-poster",
  },
] as const;

export function getLegacyShopOnlineRedirects(): NextRedirect[] {
  return expandRedirectSpecs(legacyShopOnlineRedirectSpec);
}
