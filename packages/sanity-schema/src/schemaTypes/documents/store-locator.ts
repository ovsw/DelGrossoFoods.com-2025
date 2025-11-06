import { MarkerIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { siteReferenceField } from "../common";

import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { createSlug } from "../../utils/slug";
import { createSlugValidator } from "../../utils/slug-validation";

export const storeLocator = defineType({
  name: "storeLocator",
  title: "Store Locator Page",
  type: "document",
  icon: MarkerIcon,
  description:
    "Manage the hero content, supporting sections, and SEO settings for the Where to Buy page",
  groups: GROUPS,
  fields: [
    siteReferenceField,
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description:
        "The main heading that appears on the page and helps visitors know they are in the right place",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("A page title is required"),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description:
        "A short introduction that appears below the title and doubles as the search engine description",
      rows: 3,
      group: GROUP.MAIN_CONTENT,
      validation: (rule) => [
        rule
          .min(140)
          .warning(
            "Aim for at least 140 characters so search results show a complete description",
          ),
        rule
          .max(160)
          .warning(
            "Keep this under 160 characters to avoid truncation in search results",
          ),
      ],
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description:
        "The web address for the Where to Buy page. Keep this set to '/where-to-buy'.",
      group: GROUP.MAIN_CONTENT,
      options: {
        source: "title",
        slugify: createSlug,
      },
      validation: (Rule) =>
        Rule.required().custom(
          createSlugValidator({
            sanityDocumentType: "storeLocator",
          }),
        ),
    }),
    defineField({
      name: "pageBuilder",
      title: "Additional Content Sections",
      type: "pageBuilder",
      description:
        "Add optional content blocks like CTAs, FAQs, or promotions that support the store locator",
      group: GROUP.MAIN_CONTENT,
    }),
    ...seoFields,
    ...ogFields,
  ],
  preview: {
    select: {
      title: "title",
      description: "description",
    },
    prepare: ({ title, description }) => ({
      title: title || "Store Locator Page",
      subtitle: description,
    }),
  },
});
