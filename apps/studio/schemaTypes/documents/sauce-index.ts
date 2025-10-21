import { defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { createSlug, isUnique } from "../../utils/slug";
import { pageBuilderField } from "../common";

export const sauceIndex = defineType({
  name: "sauceIndex",
  type: "document",
  title: "Sauce Listing Page",
  description:
    "This is the main page that shows all sauces. You can customize how the sauce listing page looks, what title and SEO settings you want to use.",
  groups: GROUPS,
  fields: [
    defineField({
      name: "pageHeader",
      title: "Page Header",
      type: "pageHeader",
      description:
        "Controls the eyebrow, main heading, supporting copy, and background image displayed on the sauce index page.",
      group: GROUP.HEADER,
    }),
    defineField({
      name: "slug",
      type: "slug",
      description:
        "The web address for your sauces listing page (for example, '/sauces'). Do not change this one unless you know what you're doing (you'll break the site).",
      group: GROUP.MAIN_CONTENT,
      readOnly: true,
      options: {
        source: "pageHeader.heading",
        slugify: createSlug,
        isUnique: isUnique,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "displayFeaturedSauces",
      title: "Display Featured Sauces",
      description:
        "When enabled, this will take the top sauces from the ordered sauce list and display them as featured at the top of the page",
      type: "string",
      options: {
        list: [
          { title: "Yes", value: "yes" },
          { title: "No", value: "no" },
        ],
        layout: "radio",
      },
      initialValue: "yes",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "featuredSaucesCount",
      title: "Number of Featured Sauces",
      description: "Select the number of sauces to display as featured.",
      type: "string",
      options: {
        list: [
          { title: "1", value: "1" },
          { title: "2", value: "2" },
          { title: "3", value: "3" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "1",
      hidden: ({ parent }) => parent?.displayFeaturedSauces !== "yes",
      group: GROUP.MAIN_CONTENT,
    }),
    pageBuilderField,
    ...seoFields.filter(
      (field) => !["seoNoIndex", "seoHideFromLists"].includes(field.name),
    ),
    ...ogFields,
  ],
  preview: {
    select: {
      title: "pageHeader.heading",
      description: "pageHeader.text",
      slug: "slug.current",
    },
    prepare: ({ title, description, slug }) => ({
      title: title || "Untitled Sauce Index",
      subtitle: description || slug || "Sauce Index",
    }),
  },
});
