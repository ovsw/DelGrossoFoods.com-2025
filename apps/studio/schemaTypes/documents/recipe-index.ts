import { defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { createSlug, isUnique } from "../../utils/slug";
import { pageBuilderField } from "../common";

export const recipeIndex = defineType({
  name: "recipeIndex",
  type: "document",
  title: "Recipe Listing Page",
  description:
    "This is the main page that shows all recipes. You can customize how the recipe listing page looks, what title and SEO settings you want to use.",
  groups: GROUPS,
  fields: [
    defineField({
      name: "title",
      type: "string",
      description:
        "The main heading that will appear at the top of your recipe listing page",
      group: GROUP.HEADER,
    }),
    defineField({
      name: "description",
      type: "text",
      description:
        "A short summary of what visitors can find on your page. This helps people understand what your page is about.",
      rows: 3,
      group: GROUP.HEADER,
    }),
    defineField({
      name: "pageHeaderImage",
      title: "Header Background Image",
      type: "image",
      description:
        "Background image displayed behind the page heading. Crop using hotspot to control the focal point.",
      options: { hotspot: true },
      group: GROUP.HEADER,
    }),
    defineField({
      name: "slug",
      type: "slug",
      description:
        "The web address for your recipes listing page (for example, '/recipes'). Do not change this one unless you know what you're doing (you'll break the site).",
      group: GROUP.MAIN_CONTENT,
      readOnly: true,
      options: {
        source: "title",
        slugify: createSlug,
        isUnique: isUnique,
      },
      validation: (Rule) => Rule.required(),
    }),
    pageBuilderField,
    ...seoFields.filter(
      (field) => !["seoNoIndex", "seoHideFromLists"].includes(field.name),
    ),
    ...ogFields,
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
      slug: "slug.current",
    },
    prepare: ({ title, description, slug }) => ({
      title: title || "Untitled Recipe Index",
      subtitle: description || slug || "Recipe Index",
    }),
  },
});
