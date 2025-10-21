import { PackageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { createSlug, isUnique } from "../../utils/slug";
import { pageBuilderField } from "../common";

export const productIndex = defineType({
  name: "productIndex",
  title: "Product Index Page",
  type: "document",
  icon: PackageIcon,
  description:
    "This is the main page that shows all products. You can customize how the product listing page looks, what title and SEO settings you want to use.",
  groups: GROUPS,
  fields: [
    defineField({
      name: "pageHeader",
      title: "Page Header",
      type: "pageHeader",
      description:
        "Controls the eyebrow, main heading, supporting copy, and background image displayed on the product index page.",
      group: GROUP.HEADER,
    }),
    defineField({
      name: "slug",
      type: "slug",
      description:
        "The web address for your products listing page (for example, '/store'). Do not change this one unless you know what you're doing (you'll break the site).",
      group: GROUP.MAIN_CONTENT,
      readOnly: true,
      options: {
        source: "pageHeader.heading",
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
      title: "pageHeader.heading",
      description: "pageHeader.text",
      slug: "slug.current",
    },
    prepare: ({ title, description, slug }) => ({
      title: title || "Untitled Product Index",
      subtitle: description || slug || "Product Index",
    }),
  },
});
