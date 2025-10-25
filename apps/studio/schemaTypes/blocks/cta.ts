import { PhoneIcon } from "lucide-react";
import { defineField, defineType } from "sanity";

import { buttonsField, richTextField, sectionSpacingField } from "../common";

export const cta = defineType({
  name: "cta",
  type: "object",
  icon: PhoneIcon,
  fields: [
    defineField({
      name: "surfaceColor",
      title: "Surface Color",
      type: "string",
      description:
        "Choose the CTA surface color. Default uses the Brand Green background. 'No Background' renders text on light with no panel styling.",
      options: {
        list: [
          { title: "Default (Brand Green)", value: "default" },
          { title: "No Background", value: "none" },
          { title: "Deep Red (Original)", value: "red" },
          { title: "Olive Green (Organic)", value: "green" },
          { title: "Charcoal Black (La Famiglia)", value: "black" },
        ],
        layout: "dropdown",
      },
      initialValue: "default",
    }),
    defineField({
      name: "applySurfaceShine",
      title: "Apply Surface Shine",
      type: "boolean",
      description:
        "Adds a glossy highlight overlay on the panel surface (ignored when 'No Background' is selected).",
      initialValue: false,
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
    buttonsField,
    sectionSpacingField,
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare: ({ title }) => ({
      title,
      subtitle: "CTA Block",
    }),
  },
});
