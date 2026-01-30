import { defineLocations } from "sanity/presentation";

export const locations = {
  home: defineLocations({
    select: {
      title: "title",
      slug: "slug.current",
    },
    resolve: () => {
      return {
        locations: [
          {
            title: "Home",
            href: "/",
          },
        ],
      };
    },
  }),
  page: defineLocations({
    select: {
      title: "title",
      slug: "slug.current",
    },
    resolve: (doc) => {
      return {
        locations: [
          {
            title: doc?.title || "Untitled",
            href: `${doc?.slug}`,
          },
        ],
      };
    },
  }),
  // Detail page resolvers for custom content types
  sauce: defineLocations({
    select: {
      title: "name",
      slug: "slug.current",
    },
    resolve: (doc) => {
      return {
        locations: [
          {
            title: doc?.title || "Untitled Sauce",
            href: `${doc?.slug}`,
          },
          {
            title: "Sauces",
            href: "/sauces",
          },
        ],
      };
    },
  }),
  recipe: defineLocations({
    select: {
      title: "name",
      slug: "slug.current",
    },
    resolve: (doc) => {
      return {
        locations: [
          {
            title: doc?.title || "Untitled Recipe",
            href: `${doc?.slug}`,
          },
          {
            title: "Recipes",
            href: "/recipes",
          },
        ],
      };
    },
  }),
  product: defineLocations({
    select: {
      title: "name",
      slug: "slug.current",
    },
    resolve: (doc) => {
      return {
        locations: [
          {
            title: doc?.title || "Untitled Product",
            href: `${doc?.slug}`,
          },
          {
            title: "Store",
            href: "/store",
          },
        ],
      };
    },
  }),
  historyPage: defineLocations({
    select: {
      title: "title",
      slug: "slug.current",
    },
    resolve: (doc) => {
      return {
        locations: [
          {
            title: doc?.title || "History",
            href: `${doc?.slug || "/history"}`,
          },
        ],
      };
    },
  }),
  storeLocator: defineLocations({
    select: {
      title: "title",
      slug: "slug.current",
    },
    resolve: (doc) => {
      return {
        locations: [
          {
            title: doc?.title || "Where to Buy",
            href: `${doc?.slug || "/where-to-buy"}`,
          },
        ],
      };
    },
  }),
  contactPage: defineLocations({
    select: {
      title: "title",
      slug: "slug.current",
    },
    resolve: (doc) => {
      return {
        locations: [
          {
            title: doc?.title || "Contact",
            href: `${doc?.slug || "/contact"}`,
          },
        ],
      };
    },
  }),
  // Index page resolvers
  sauceIndex: defineLocations({
    select: {
      title: "title",
      slug: "slug.current",
    },
    resolve: (doc) => {
      return {
        locations: [
          {
            title: doc?.title || "Sauces",
            href: `${doc?.slug || "/sauces"}`,
          },
        ],
      };
    },
  }),
  recipeIndex: defineLocations({
    select: {
      title: "title",
      slug: "slug.current",
    },
    resolve: (doc) => {
      return {
        locations: [
          {
            title: doc?.title || "Recipes",
            href: `${doc?.slug || "/recipes"}`,
          },
        ],
      };
    },
  }),
  productIndex: defineLocations({
    select: {
      title: "title",
      slug: "slug.current",
    },
    resolve: (doc) => {
      return {
        locations: [
          {
            title: doc?.title || "Store",
            href: `${doc?.slug || "/store"}`,
          },
        ],
      };
    },
  }),
};
