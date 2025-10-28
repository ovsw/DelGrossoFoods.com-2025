import { defineArrayMember, defineType } from "sanity";

import { homePageBuilderBlocks, pageBuilderBlocks } from "../blocks";

// Disable specific blocks from CMS selection
const DISABLED_BLOCKS = new Set(["imageLinkCards", "featureCardsIcon"]);

const filteredPageBuilderBlocks = pageBuilderBlocks.filter(
  ({ name }) => !DISABLED_BLOCKS.has(name),
);

export const pagebuilderBlockTypes = filteredPageBuilderBlocks.map(
  ({ name }) => ({
    type: name,
  }),
);

export const pageBuilder = defineType({
  name: "pageBuilder",
  type: "array",
  of: pagebuilderBlockTypes.map((block) => defineArrayMember(block)),
});

// Also filter for home page builder
const filteredHomePageBuilderBlocks = homePageBuilderBlocks.filter(
  ({ name }) => !DISABLED_BLOCKS.has(name),
);

const homePageBlockTypes = filteredHomePageBuilderBlocks.map(({ name }) => ({
  type: name,
}));

export const homePageBuilder = defineType({
  name: "homePageBuilder",
  type: "array",
  of: homePageBlockTypes.map((block) => defineArrayMember(block)),
});
