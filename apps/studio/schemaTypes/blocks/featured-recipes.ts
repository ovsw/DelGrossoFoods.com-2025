import { Utensils } from "lucide-react";
import { defineArrayMember, defineField, defineType } from "sanity";

import { sectionSpacingField } from "../common";

export const featuredRecipes = defineType({
  name: "featuredRecipes",
  title: "Featured Recipes",
  icon: Utensils,
  type: "object",
  fields: [
    defineField({
      name: "recipes",
      title: "Recipes",
      description: "Pick exactly three recipes to feature in this section.",
      type: "array",
      validation: (Rule) => Rule.required().min(3).max(3),
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "recipe" }],
          options: { disableNew: true },
        }),
      ],
    }),
    sectionSpacingField,
  ],
  preview: {
    select: {
      recipes: "recipes",
    },
    prepare: ({ recipes }) => ({
      title: "Featured Recipes",
      subtitle: Array.isArray(recipes)
        ? `${recipes.length} recipe${recipes.length === 1 ? "" : "s"} selected`
        : "No recipes selected",
    }),
  },
});
