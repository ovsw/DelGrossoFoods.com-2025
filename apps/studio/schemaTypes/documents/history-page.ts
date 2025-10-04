import { ClockIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";

export const historyPage = defineType({
  name: "historyPage",
  title: "History Page",
  type: "document",
  icon: ClockIcon,
  description:
    "The main history page showcasing the DelGrosso Foods timeline and additional content sections",
  groups: GROUPS,
  fields: [
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description:
        "The main heading that appears at the top of your page and in browser tabs",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("A page title is required"),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description:
        "A brief summary of what this page is about. This text helps search engines understand your page and may appear in search results.",
      rows: 3,
      group: GROUP.MAIN_CONTENT,
      validation: (rule) => [
        rule
          .min(140)
          .warning(
            "The meta description should be at least 140 characters for optimal SEO visibility in search results",
          ),
        rule
          .max(160)
          .warning(
            "The meta description should not exceed 160 characters as it will be truncated in search results",
          ),
      ],
    }),
    defineField({
      name: "timeline",
      title: "Company Timeline",
      type: "timeline",
      description:
        "The chronological story of DelGrosso Foods from 1914 to present day",
      group: GROUP.MAIN_CONTENT,
    }),
    defineField({
      name: "pageBuilder",
      title: "Additional Content Sections",
      type: "pageBuilder",
      description:
        "Build additional content sections for the history page like CTAs, forms, or promotional content",
      group: GROUP.MAIN_CONTENT,
    }),
    ...seoFields,
    ...ogFields,
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "timeline.markers.0.heading",
    },
    prepare: ({ title, subtitle }) => ({
      title: title || "DelGrosso Foods History",
      subtitle,
    }),
  },
});
