import { ImagesIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const homeSlideshow = defineType({
  name: "homeSlideshow",
  title: "Home Slideshow",
  type: "object",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "slides",
      title: "Slides",
      description:
        "Add up to three slides to feature your hero products with headlines, copy, and a call to action",
      type: "array",
      of: [
        defineArrayMember({
          name: "slide",
          title: "Slide",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              description:
                "Short line of text displayed above the main headline, like the product line or collection name",
              type: "string",
            }),
            defineField({
              name: "subtitle",
              title: "Headline",
              description:
                "Primary headline for the slide. Keep it brief and high impact",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              description:
                "Supporting description shown beneath the headline. You can include multiple sentences if needed",
              type: "richText",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "buttons",
              title: "Buttons",
              description:
                "Optional button displayed below the description. Limit one button per slide",
              type: "array",
              of: [defineArrayMember({ type: "button" })],
              validation: (Rule) => Rule.max(1),
            }),
            defineField({
              name: "image",
              title: "Product Image",
              description:
                "Upload the product collage or jar featured on this slide",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alt Text",
                  description:
                    "Describe the image for visitors using screen readers, like 'DelGrosso Marinara, Pepperoni Flavored, and Garlic & Cheese sauces'",
                  type: "string",
                  validation: (Rule) =>
                    Rule.required()
                      .max(120)
                      .warning(
                        "Keep alt text concise so it's easy to understand",
                      ),
                }),
              ],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: "subtitle",
              media: "image",
            },
            prepare: ({ title, media }) => ({
              title: title ?? "Untitled slide",
              subtitle: "Home slideshow slide",
              media,
            }),
          },
        }),
      ],
      validation: (Rule) =>
        Rule.required()
          .min(1)
          .max(3)
          .error("Home slideshow supports one to three slides"),
    }),
  ],
  preview: {
    select: {
      slides: "slides",
    },
    prepare: ({ slides }) => ({
      title: "Home Slideshow",
      subtitle: `${slides?.length ?? 0} slide${slides?.length === 1 ? "" : "s"}`,
    }),
  },
});
