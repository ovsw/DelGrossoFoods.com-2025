import { defineArrayMember, defineType } from "sanity";

import { homePageBuilderBlocks, pageBuilderBlocks } from "../blocks";

export const pagebuilderBlockTypes = pageBuilderBlocks.map(({ name }) => ({
  type: name,
}));

export const pageBuilder = defineType({
  name: "pageBuilder",
  type: "array",
  of: pagebuilderBlockTypes.map((block) => defineArrayMember(block)),
});

const homePageBlockTypes = homePageBuilderBlocks.map(({ name }) => ({
  type: name,
}));

export const homePageBuilder = defineType({
  name: "homePageBuilder",
  type: "array",
  of: homePageBlockTypes.map((block) => defineArrayMember(block)),
});
