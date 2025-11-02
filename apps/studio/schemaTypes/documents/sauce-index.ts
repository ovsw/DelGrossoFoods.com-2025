import { defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { createSlug } from "../../utils/slug";
import { isUniqueWithinSite } from "../../utils/slug-validation";
import { pageBuilderField, siteReferenceField } from "../common";

export const sauceIndex = defineType({
  name: "sauceIndex",
  type: "document",
  title: "Sauce Listing Page",
  description:
    "This is the main page that shows all sauces. You can customize how the sauce listing page looks, what title and SEO settings you want to use.",
  groups: GROUPS,
  fields: [
    defineField({
      ...siteReferenceField,
      group: GROUP.HEADER,
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        "The main heading that appears at the top of your sauce listing page.",
      group: GROUP.HEADER,
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description:
        "A short summary of what visitors can expect to find on this page.",
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
        "The web address for your sauces listing page (for example, '/sauces'). Do not change this one unless you know what you're doing (you'll break the site).",
      group: GROUP.MAIN_CONTENT,
      readOnly: true,
      options: {
        source: "title",
        slugify: createSlug,
        isUnique: isUniqueWithinSite,
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
      title: "title",
      description: "description",
      slug: "slug.current",
    },
    prepare: ({ title, description, slug }) => ({
      title: title || "Untitled Sauce Index",
      subtitle: description || slug || "Sauce Index",
    }),
  },
});
