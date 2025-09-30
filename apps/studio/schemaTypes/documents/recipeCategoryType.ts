import { TagIcon } from "@sanity/icons"; // Using TagIcon for categories
import { defineField, defineType } from "sanity";

export const recipeCategoryType = defineType({
  name: "recipeCategory",
  title: "Recipe Category",
  type: "document",
  icon: TagIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) =>
        Rule.required().error("A title is required for the category."),
      description:
        "The name of the recipe category (e.g., Appetizer, Main Course, Dessert).",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
      description:
        "URL-friendly version of the category name for filtering recipes",
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare(selection) {
      const { title } = selection;
      return {
        title: title || "Untitled Recipe Category",
      };
    },
  },
});
