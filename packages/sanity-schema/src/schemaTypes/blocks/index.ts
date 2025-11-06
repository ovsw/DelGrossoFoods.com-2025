import { cta } from "./cta";
import { faqAccordion } from "./faq-accordion";
import { feature } from "./feature";
import { featureCardsIcon } from "./feature-cards-icon";
import { featuredRecipes } from "./featured-recipes";
import { homeSlideshow } from "./home-slideshow";
import { imageLinkCards } from "./image-link-cards";
import { longForm } from "./long-form";
import { subscribeNewsletter } from "./subscribe-newsletter";
import { threeProductPanels } from "./three-product-panels";

const sharedBlocks = [
  cta,
  feature,
  featuredRecipes,
  featureCardsIcon,
  faqAccordion,
  imageLinkCards,
  subscribeNewsletter,
  longForm,
  threeProductPanels,
];

const homeExclusiveBlocks = [homeSlideshow];

export const pageBuilderBlocks = sharedBlocks;
export const homePageBuilderBlocks = [...sharedBlocks, ...homeExclusiveBlocks];
export const registeredPageBuilderBlocks = [
  ...sharedBlocks,
  ...homeExclusiveBlocks,
];
