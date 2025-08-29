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
      name: "title",
      type: "string",
      description:
        "The main heading that will appear at the top of your product listing page",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "description",
      type: "text",
      description:
        "A short summary of what visitors can find on your page. This helps people understand what your page is about.",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "slug",
      type: "slug",
      description:
        "The web address for your products listing page (for example, '/products'). Do not change this one unless you know what you're doing (you'll break the site).",
      group: GROUP.MAIN_CONTENT,
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
      title: title || "Untitled Product Index",
      subtitle: description || slug || "Product Index",
    }),
  },
});
