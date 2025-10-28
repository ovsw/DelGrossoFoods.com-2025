import { ScrollText } from "lucide-react";
import { defineField, defineType } from "sanity";

import { sectionSpacingField } from "../common";
import { customRichText } from "../definitions/rich-text";

export const longForm = defineType({
  name: "longForm",
  title: "Long Form Content",
  description:
    "Use for legal pages or other long-form articles that need headings, paragraphs, lists, and images.",
  type: "object",
  icon: ScrollText,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      description:
        "Optional small line of text that appears above the heading to provide context.",
      type: "string",
    }),
    defineField({
      name: "title",
      title: "Title",
      description:
        "The main heading for this section. Keep it short and descriptive.",
      type: "string",
      validation: (Rule) => Rule.required().min(3),
    }),
    customRichText(["block"], {
      name: "intro",
      title: "Intro Text",
      description:
        "Optional short lead paragraph that appears between the heading and the main body content.",
    }),
    defineField({
      name: "body",
      title: "Body Content",
      description:
        "The main rich text content. Supports headings, lists, block quotes, and embedded images.",
      type: "richText",
      validation: (Rule) => Rule.required().min(1),
    }),
    sectionSpacingField,
  ],
  preview: {
    select: {
      title: "title",
      eyebrow: "eyebrow",
    },
    prepare: ({ title, eyebrow }) => ({
      title: title ?? "Untitled long form",
      subtitle: eyebrow ? `Eyebrow: ${eyebrow}` : "Long Form Content",
    }),
  },
});
