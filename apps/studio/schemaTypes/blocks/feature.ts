import { Star } from "lucide-react";
import { defineField, defineType } from "sanity";

import { buttonsField, richTextField, sectionSpacingField } from "../common";

export const feature = defineType({
  name: "feature",
  title: "Feature",
  icon: Star,
  type: "object",
  fields: [
    defineField({
      name: "badge",
      type: "string",
      title: "Badge",
      description:
        "Optional badge text displayed above the title, useful for highlighting launches or seasonal promotions",
    }),
    defineField({
      name: "title",
      type: "string",
      title: "Title",
      description:
        "The main heading text for the feature section that captures attention",
    }),
    richTextField,
    defineField({
      name: "image",
      type: "image",
      title: "Image",
      description:
        "The primary feature image – should be high quality and visually impactful",
      options: {
        hotspot: true,
      },
    }),
    buttonsField,
    sectionSpacingField,
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title,
      subtitle: "Feature Block",
    }),
  },
});
