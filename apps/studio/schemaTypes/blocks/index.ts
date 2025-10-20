import { cta } from "./cta";
import { faqAccordion } from "./faq-accordion";
import { feature } from "./feature";
import { featureCardsIcon } from "./feature-cards-icon";
import { homeSlideshow } from "./home-slideshow";
import { imageLinkCards } from "./image-link-cards";
import { subscribeNewsletter } from "./subscribe-newsletter";
import { threeProductPanels } from "./three-product-panels";

const sharedBlocks = [
  feature,
  cta,
  featureCardsIcon,
  faqAccordion,
  imageLinkCards,
  subscribeNewsletter,
  threeProductPanels,
];

const homeExclusiveBlocks = [homeSlideshow];

export const pageBuilderBlocks = sharedBlocks;
export const homePageBuilderBlocks = [...sharedBlocks, ...homeExclusiveBlocks];
export const registeredPageBuilderBlocks = [
  ...sharedBlocks,
  ...homeExclusiveBlocks,
];
