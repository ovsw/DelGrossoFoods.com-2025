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
    // You could add a slug field here if these categories will have their own pages/routes
    // defineField({
    //   name: 'slug',
    //   title: 'Slug',
    //   type: 'slug',
    //   options: {
    //     source: 'title',
    //     maxLength: 96,
    //   },
    //   validation: (Rule) => Rule.required(),
    // }),
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
