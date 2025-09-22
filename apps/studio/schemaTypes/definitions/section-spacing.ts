import { defineField, defineType } from "sanity";

const sectionSpacingOptions = [
  { title: "Default", value: "default" },
  { title: "None", value: "none" },
  { title: "Small", value: "small" },
  { title: "Large", value: "large" },
];

export const sectionSpacing = defineType({
  name: "sectionSpacing",
  title: "Section Spacing",
  type: "object",
  fields: [
    defineField({
      name: "spacingTop",
      title: "Top spacing",
      type: "string",
      description: "Spacing applied above this section.",
      initialValue: "default",
      options: {
        list: sectionSpacingOptions,
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "spacingBottom",
      title: "Bottom spacing",
      type: "string",
      description: "Spacing applied below this section.",
      initialValue: "default",
      options: {
        list: sectionSpacingOptions,
        layout: "dropdown",
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
});
