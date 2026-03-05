import { UsersIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { createSlug } from "../../utils/slug";
import { createSlugValidator } from "../../utils/slug-validation";
import { buttonsField } from "../common";

export const leadershipIndex = defineType({
  name: "leadershipIndex",
  type: "document",
  title: "Leadership Index Page",
  icon: UsersIcon,
  description:
    "This is the dedicated page configuration for the leadership route. Manage heading content, optional CTA, and SEO settings.",
  groups: GROUPS,
  fields: [
    defineField({
      name: "eyebrow",
      type: "string",
      title: "Eyebrow",
      description:
        "Optional short label above the main heading (for example, 'Our Team').",
      group: GROUP.HEADER,
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The main heading that appears on the leadership page.",
      group: GROUP.HEADER,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "Supporting intro text shown with the leadership section.",
      rows: 3,
      group: GROUP.HEADER,
    }),
    defineField({
      name: "slug",
      type: "slug",
      description:
        "The web address for this page. Keep this set to '/leadership'.",
      group: GROUP.MAIN_CONTENT,
      readOnly: true,
      initialValue: {
        current: "/leadership",
      },
      options: {
        source: "title",
        slugify: createSlug,
      },
      validation: (Rule) =>
        Rule.required().custom(
          createSlugValidator({
            sanityDocumentType: "leadershipIndex",
          }),
        ),
    }),
    defineField({
      ...buttonsField,
      title: "Button",
      description: "Optional button shown in the leadership intro area.",
      validation: (Rule) => Rule.max(1),
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "leaders",
      title: "Leaders",
      description:
        "Choose which leaders appear on the leadership page and drag to control their display order.",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "leader" }],
          options: {
            disableNew: true,
          },
        }),
      ],
      group: GROUP.MAIN_CONTENT,
    }),
    ...seoFields.filter(
      (field) => !["seoNoIndex", "seoHideFromLists"].includes(field.name),
    ),
    ...ogFields,
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
      slug: "slug.current",
    },
    prepare: ({ title, subtitle, slug }) => ({
      title: title || "Leadership Index Page",
      subtitle: subtitle || slug || "/leadership",
    }),
  },
});
