import { ImagesIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const homeSlideshowVertical = defineType({
  name: "homeSlideshowVertical",
  title: "Home Slideshow Vertical",
  type: "object",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "title",
      title: "Eyebrow",
      description:
        "Optional short line of text displayed above the headline to provide context",
      type: "string",
    }),
    defineField({
      name: "headingRichText",
      title: "Heading Rich Text",
      description:
        "Optional rich text version of the headline that enables inline styling (underlines, emphasis, etc.) while retaining the string headline for backwards compatibility.",
      type: "richText",
    }),
    defineField({
      name: "description",
      title: "Description",
      description:
        "Supporting description shown beneath the headline. Use rich text for short paragraphs",
      type: "richText",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "buttons",
      title: "Buttons",
      description:
        "Add up to two call-to-action buttons beneath the description",
      type: "array",
      of: [defineArrayMember({ type: "button" })],
      validation: (Rule) => Rule.max(2),
    }),
    defineField({
      name: "leftColumnImages",
      title: "Left Column Images",
      description:
        "Exactly four images (9:16 ratio recommended) for the left scrolling column",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              description:
                "Describe the image for visitors using screen readers (max 120 characters)",
              type: "string",
              validation: (Rule) =>
                Rule.required()
                  .max(120)
                  .warning("Keep alt text concise so it's easy to understand"),
            }),
          ],
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) =>
        Rule.required()
          .min(4)
          .max(4)
          .error("Provide exactly four images for the left column"),
    }),
    defineField({
      name: "rightColumnImages",
      title: "Right Column Images",
      description:
        "Exactly four images (9:16 ratio recommended) for the right scrolling column",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              description:
                "Describe the image for visitors using screen readers (max 120 characters)",
              type: "string",
              validation: (Rule) =>
                Rule.required()
                  .max(120)
                  .warning("Keep alt text concise so it's easy to understand"),
            }),
          ],
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) =>
        Rule.required()
          .min(4)
          .max(4)
          .error("Provide exactly four images for the right column"),
    }),
  ],
  preview: {
    select: {
      title: "subtitle",
      media: "leftColumnImages.0",
    },
    prepare: ({ title, media }) => ({
      title: title ?? "Home Slideshow Vertical",
      subtitle: "Hero with vertical scrolling images",
      media,
    }),
  },
});
