import { ImageIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { richTextField } from "../common";

export const ctaImage = defineType({
  name: "ctaImage",
  type: "object",
  icon: ImageIcon,
  fields: [
    defineField({
      name: "variant",
      title: "Variant",
      type: "string",
      description: "Choose the overall theme and styling for this CTA section",
      options: {
        list: [
          { title: "Light", value: "light" },
          { title: "Dark", value: "dark" },
        ],
        layout: "radio",
        direction: "horizontal",
      },
      initialValue: "light",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      type: "string",
      description:
        "The smaller text that sits above the title to provide context",
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      description: "The large text that is the primary focus of the block",
    }),
    richTextField,
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "Image to display alongside the CTA content",
      options: {
        hotspot: true,
      },
      validation: (Rule) =>
        Rule.required()
          .error("Image is required for CTA with Image")
          .custom((value) => {
            if (!value?.asset) {
              return "Image asset is required";
            }
            return true;
          }),
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Important for accessibility and SEO",
          validation: (Rule) =>
            Rule.required().error("Alt text is required for accessibility"),
        }),
      ],
    }),
    defineField({
      name: "buttons",
      title: "Buttons",
      type: "array",
      description:
        "Add up to 2 buttons. First button will be styled as primary, second as secondary.",
      of: [{ type: "button" }],
      validation: (Rule) => Rule.max(2).error("Maximum 2 buttons allowed"),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "image",
    },
    prepare: ({ title, media }) => ({
      title,
      subtitle: "CTA with Image Block",
      media,
    }),
  },
});
