import { MessageSquare } from "lucide-react";
import { defineField, defineType } from "sanity";

import { siteReferenceField } from "../common";

import { GROUP, GROUPS } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { seoFields } from "../../utils/seo-fields";
import { createSlug } from "../../utils/slug";
import {
  createSiteScopedSlugUniqueness,
  createSlugValidator,
} from "../../utils/slug-validation";

export const contactPage = defineType({
  name: "contactPage",
  title: "Contact Page",
  type: "document",
  icon: MessageSquare,
  description:
    "Manage the contact form page content, additional sections, and SEO settings",
  groups: GROUPS,
  fields: [
    siteReferenceField,
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description:
        "The main heading that appears at the top of the contact page",
      group: GROUP.MAIN_CONTENT,
      validation: (Rule) => Rule.required().error("A page title is required"),
    }),
    defineField({
      name: "description",
      type: "text",
      title: "Description",
      description:
        "A brief introduction that appears below the title and helps set expectations for visitors",
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
        "The web address for the contact page. Keep this set to '/contact'.",
      group: GROUP.MAIN_CONTENT,
      options: {
        source: "title",
        slugify: createSlug,
        isUnique: createSiteScopedSlugUniqueness("contactPage"),
      },
      validation: (Rule) =>
        Rule.required().custom(
          createSlugValidator({
            sanityDocumentType: "contactPage",
          }),
        ),
    }),
    defineField({
      name: "pageBuilder",
      title: "Additional Content Sections",
      type: "pageBuilder",
      description:
        "Add optional content blocks like FAQs, contact information, or other sections that support the contact form",
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
      title: title || "Contact Page",
      subtitle: description,
    }),
  },
});
