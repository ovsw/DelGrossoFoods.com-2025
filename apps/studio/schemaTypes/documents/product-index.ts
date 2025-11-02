import { PackageIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { createSlug } from "../../utils/slug";
import { isUniqueWithinSite } from "../../utils/slug-validation";
import { pageBuilderField, siteReferenceField } from "../common";

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
      ...siteReferenceField,
      group: GROUP.HEADER,
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description:
        "The main heading that appears at the top of your product listing page.",
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
        "The web address for your products listing page (for example, '/store'). Do not change this one unless you know what you're doing (you'll break the site).",
      group: GROUP.MAIN_CONTENT,
      readOnly: true,
      options: {
        source: "title",
        slugify: createSlug,
        isUnique: isUniqueWithinSite,
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
