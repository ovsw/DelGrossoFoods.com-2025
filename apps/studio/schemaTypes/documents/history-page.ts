import { ClockIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { createSlug } from "../../utils/slug";
import { createSlugValidator } from "../../utils/slug-validation";

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
      name: "pageHeader",
      title: "Page Header",
      type: "pageHeader",
      description:
        "Controls the eyebrow, main heading, supporting text, and background image shown at the top of the history page.",
      group: GROUP.HEADER,
      validation: (Rule) =>
        Rule.required().error("The history page requires header content."),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "Slug",
      description:
        "The fixed web address for this page. Leave as '/history' so links and Presentation keep working.",
      group: GROUP.MAIN_CONTENT,
      options: {
        source: "pageHeader.heading",
        slugify: createSlug,
      },
      validation: (Rule) =>
        Rule.required().custom(
          createSlugValidator({
            sanityDocumentType: "historyPage",
          }),
        ),
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
      title: "pageHeader.heading",
      subtitle: "timeline.markers.0.heading",
    },
    prepare: ({ title, subtitle }) => ({
      title: title || "DelGrosso Foods History",
      subtitle,
    }),
  },
});
