import { Utensils } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import { sectionSpacingField } from "../common";

export const featuredRecipes = defineType({
  name: "featuredRecipes",
  title: "Featured Recipes",
  type: "object",
  icon: Utensils,
  fields: [
    defineField({
      name: "eyebrow",
      title: "Eyebrow",
      description:
        "The smaller text that sits above the title to provide context",
      type: "string",
    }),
    defineField({
      name: "title",
      title: "Title",
      description: "The large text that is the primary focus of the block",
      type: "string",
    }),
    defineField({
      name: "intro",
      title: "Intro Paragraph",
      description:
        "A short paragraph that introduces the featured recipes and sets expectations",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "recipes",
      title: "Featured Recipes",
      description:
        "Select exactly three recipes you want to highlight in this section",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "recipe" }],
          options: {
            disableNew: true,
          },
        }),
      ],
      validation: (Rule) =>
        Rule.required()
          .min(3)
          .max(3)
          .error("Exactly three recipes are required for this block"),
    }),
    sectionSpacingField,
  ],
  preview: {
    select: {
      title: "title",
      eyebrow: "eyebrow",
    },
    prepare: ({ title, eyebrow }) => ({
      title: title || "Featured Recipes",
      subtitle: eyebrow || "Highlighting three recipes",
    }),
  },
});
