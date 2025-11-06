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
import { storeLocator } from "./store-locator";

export const singletons = [
  homePage,
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
  page,
  faq,
  sauce,
  productType,
  recipeType,
  recipeCategoryType,
  ...singletons,
];
