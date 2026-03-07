import { MegaphoneIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { buttonsField, richTextField, sectionSpacingField } from "../common";

export const campaignHero = defineType({
  name: "campaignHero",
  title: "Campaign Hero",
  description:
    "Use for campaign landing sections with a headline, supporting copy, a hero image, and one or more call-to-action buttons.",
  type: "object",
  icon: MegaphoneIcon,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      description:
        "Optional smaller text that appears above the main title to provide context.",
      type: "string",
    }),
    defineField({
      name: "title",
      title: "Title",
      description: "The main headline visitors should see first in this block.",
      type: "string",
      validation: (Rule) => Rule.required().min(3),
    }),
    defineField({
      name: "image",
      title: "Hero Image",
      description:
        "The main campaign image displayed prominently above the supporting copy.",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          description:
            "Describe the image for screen readers and search engines.",
          type: "string",
          validation: (Rule) =>
            Rule.required().error("Alt text is required for the hero image."),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      ...richTextField,
      title: "Body Content",
      description:
        "Add the supporting campaign copy shown below the image. You can use paragraphs, headings, and lists.",
    }),
    defineField({
      ...buttonsField,
      title: "Buttons",
      description:
        "Add one or more buttons for actions like entering a contest or learning more.",
      validation: (Rule) => Rule.max(2),
    }),
    sectionSpacingField,
  ],
  preview: {
    select: {
      title: "title",
      eyebrow: "eyebrow",
      media: "image",
    },
    prepare: ({ title, eyebrow, media }) => ({
      title: title ?? "Untitled campaign hero",
      subtitle: eyebrow ? `Campaign Hero • ${eyebrow}` : "Campaign Hero",
      media,
    }),
  },
});
