import { TextIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const pageHeader = defineType({
  name: "pageHeader",
  title: "Page Header",
  type: "object",
  icon: TextIcon,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description:
        "Short label that appears above the main heading to establish context or highlight a category.",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description:
        "The primary title displayed on the page. This is also used for generating the page slug by default.",
      validation: (Rule) =>
        Rule.required().error("A heading is required for the page header."),
    }),
    defineField({
      name: "text",
      title: "Supporting Text",
      type: "text",
      rows: 3,
      description:
        "Concise introduction that appears below the heading. This is also reused for SEO descriptions.",
      validation: (rule) => [
        rule
          .min(140)
          .warning(
            "Aim for at least 140 characters so search results show a complete description.",
          ),
        rule
          .max(160)
          .warning(
            "Keep this under 160 characters to avoid truncation in search results.",
          ),
      ],
    }),
    defineField({
      name: "backgroundImage",
      title: "Background Image",
      type: "image",
      description:
        "Optional decorative image that appears behind the page heading. Leave empty for a solid background.",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description:
            "Describe the image if it appears outside of the background treatment. Leave empty if purely decorative.",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "text",
    },
    prepare: ({ title, subtitle }) => ({
      title: title || "Untitled Page Header",
      subtitle: subtitle || "No supporting text",
    }),
  },
});
