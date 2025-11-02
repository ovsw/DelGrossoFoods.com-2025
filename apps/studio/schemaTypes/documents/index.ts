import { author } from "./author";
import { blog } from "./blog";
import { blogIndex } from "./blog-index";
import { contactPage } from "./contact-page";
import { faq } from "./faq";
import { footer } from "./footer";
import { historyPage } from "./history-page";
import { homePage } from "./home-page";
import { navbar } from "./navbar";
import { page } from "./page";
import { productIndex } from "./product-index";
import { productType } from "./productType";
import { recipeIndex } from "./recipe-index";
import { recipeCategoryType } from "./recipeCategoryType";
import { recipeType } from "./recipeType";
import { sauce } from "./sauce";
import { sauceIndex } from "./sauce-index";
import { settings } from "./settings";
import { site } from "./site";
import { storeLocator } from "./store-locator";

export const singletons = [
  homePage,
  blogIndex,
  sauceIndex,
  recipeIndex,
  productIndex,
  settings,
  footer,
  navbar,
  historyPage,
  storeLocator,
  contactPage,
];

export const documents = [
  site,
  blog,
  page,
  faq,
  author,
  sauce,
  productType,
  recipeType,
  recipeCategoryType,
  ...singletons,
];
