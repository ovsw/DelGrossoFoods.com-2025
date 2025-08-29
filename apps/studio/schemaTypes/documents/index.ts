import { author } from "./author";
import { blog } from "./blog";
import { blogIndex } from "./blog-index";
import { faq } from "./faq";
import { footer } from "./footer";
import { homePage } from "./home-page";
import { navbar } from "./navbar";
import { page } from "./page";
import { recipeIndex } from "./recipe-index";
import { recipeCategoryType } from "./recipeCategoryType";
import { recipeType } from "./recipeType";
import { sauce } from "./sauce";
import { sauceIndex } from "./sauce-index";
import { settings } from "./settings";

export const singletons = [
  homePage,
  blogIndex,
  sauceIndex,
  recipeIndex,
  settings,
  footer,
  navbar,
];

export const documents = [
  blog,
  page,
  faq,
  author,
  sauce,
  recipeType,
  recipeCategoryType,
  ...singletons,
];
