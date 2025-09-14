import {
  BarChartIcon,
  DocumentTextIcon,
  ImageIcon,
  UserIcon,
} from "@sanity/icons";
import type { StringOptions } from "sanity";
import { defineField, defineType } from "sanity";

import type { AltTextFromFieldOptions } from "../../components/inputs/AltTextFromField";
import { AltTextFromField } from "../../components/inputs/AltTextFromField";
import { PathnameFieldComponent } from "../../components/slug-field-component";
import { createSlug, isUnique } from "../../utils/slug";
import { createSlugValidator } from "../../utils/slug-validation";

export const sauce = defineType({
  name: "sauce",
  title: "Sauce",
  type: "document",
  fieldsets: [
    { name: "categories", title: "Categories", options: { columns: 2 } },
  ],
  groups: [
    {
      name: "basic",
      title: "Basic Info",
      default: true,
      icon: DocumentTextIcon,
    },
    { name: "images", title: "Images", icon: ImageIcon },
    { name: "nutritional", title: "Nutritional Info", icon: BarChartIcon },
    { name: "author", title: "Author", icon: UserIcon },
  ],
  fields: [
    defineField({
      name: "orderRank",
      title: "Order Rank",
      type: "string",
      hidden: true,
    }),
    // Basic
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "basic",
      validation: (rule) => rule.required().error("Name is required"),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "URL",
      description:
        "The web address for this sauce (automatically created from its name)",
      group: "basic",
      components: {
        field: PathnameFieldComponent,
      },
      options: {
        source: "name",
        slugify: createSlug,
        isUnique,
      },
      validation: (Rule) => [
        Rule.required().error("A URL slug is required"),
        Rule.custom(
          createSlugValidator({
            documentType: "Sauce",
            requiredPrefix: "/sauce/",
          }),
        ),
      ],
    }),
    defineField({
      name: "line",
      title: "Product Line",
      type: "string",
      fieldset: "categories",
      options: { list: ["Original", "Organic", "Ultra-Premium"] },
      group: "basic",
      validation: (rule) => rule.required().error("Line is required"),
    }),
    defineField({
      name: "category",
      title: "Sauce Type",
      type: "string",
      fieldset: "categories",
      options: {
        list: ["Pasta Sauce", "Pizza Sauce", "Salsa Sauce", "Sandwich Sauce"],
      },
      group: "basic",
      validation: (rule) => rule.required().error("Type is required"),
    }),
    defineField({
      name: "sauceJarSize",
      title: "Jar Size",
      type: "string",
      options: {
        list: ["26 oz.", "24 oz.", "16.9 oz.", "16 oz.", "14 oz.", "13.5 oz."],
      },
      group: "basic",
      validation: (rule) => rule.required().error("Jar size is required"),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "richText",
      group: "basic",
      validation: (rule) => rule.required().error("Description is required"),
    }),
    // Images
    defineField({
      name: "mainImage",
      type: "image",
      group: "images",
      fields: [
        defineField({
          name: "alt",
          readOnly: false,
          type: "string",
          title: "Alternative text (read-only, 🤖auto-generated)",
          components: { input: AltTextFromField },
          options: {
            sourceField: "name",
            template: "a jar of DelGrosso's ${value} sauce",
          } as StringOptions & AltTextFromFieldOptions,
        }),
      ],
    }),
    defineField({
      name: "labelFlatImage",
      type: "image",
      group: "images",
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
          components: { input: AltTextFromField },
          options: {
            sourceField: "name",
            template: "${value} full label",
          } as StringOptions & AltTextFromFieldOptions,
        }),
      ],
    }),
    // Nutritional
    defineField({
      name: "nutritionalInfo",
      group: "nutritional",
      title: "Nutritional Information",
      type: "object",
      fields: [
        { name: "netWeight", title: "Net Weight", type: "string" },
        {
          name: "servingsPerContainer",
          title: "Servings / Cont.",
          type: "string",
        },
        { name: "servingSize", title: "Serving Size", type: "string" },
        { name: "gramsPerServing", title: "Gr. / Serving", type: "string" },
        { name: "calories", title: "Calories", type: "string" },
        { name: "totalFat", title: "Total Fat", type: "string" },
        { name: "totalFatPerc", title: "Total Fat Perc.", type: "string" },
        { name: "saturatedFat", title: "Saturated Fat", type: "string" },
        {
          name: "saturatedFatPerc",
          title: "Saturated Fat Perc.",
          type: "string",
        },
        { name: "transFat", title: "Trans Fat", type: "string" },
        { name: "cholesterol", title: "Cholesterol", type: "string" },
        { name: "cholesterolPerc", title: "Cholesterol Perc.", type: "string" },
        { name: "sodium", title: "Sodium", type: "string" },
        { name: "sodiumPerc", title: "Sodium Perc.", type: "string" },
        {
          name: "totalCarbohydrate",
          title: "Total Carbohydrate",
          type: "string",
        },
        {
          name: "totalCarbohydratePerc",
          title: "Total Carbohydrate Perc.",
          type: "string",
        },
        { name: "dietaryFiber", title: "Dietary Fiber", type: "string" },
        {
          name: "dietaryFiberPerc",
          title: "Dietary Fiber Perc.",
          type: "string",
        },
        { name: "totalSugars", title: "Total Sugars", type: "string" },
        { name: "addedSugars", title: "Added Sugars", type: "string" },
        {
          name: "addedSugarsPerc",
          title: "Added Sugars Perc.",
          type: "string",
        },
        { name: "protein", title: "Protein", type: "string" },
        { name: "vitaminD", title: "Vitamin D", type: "string" },
        { name: "vitaminDPerc", title: "Vitamin D %", type: "string" },
        { name: "calcium", title: "Calcium", type: "string" },
        { name: "calciumPerc", title: "Calcium Perc.", type: "string" },
        { name: "iron", title: "Iron", type: "string" },
        { name: "ironPerc", title: "Iron Perc.", type: "string" },
        { name: "potassium", title: "Potassium", type: "string" },
        { name: "potassiumPerc", title: "Potassium Perc.", type: "string" },
      ],
    }),
    defineField({
      name: "ingredients",
      type: "text",
      group: "nutritional",
      rows: 7,
    }),
    defineField({
      name: "allergens",
      type: "text",
      group: "nutritional",
      rows: 3,
    }),
    // Author
    defineField({
      name: "authorName",
      title: "Author Name",
      type: "string",
      group: "author",
      hidden: ({ document }) => {
        const typedDocument = document as { line?: string } | undefined;
        return typedDocument?.line !== "Ultra-Premium";
      },
    }),
    defineField({
      name: "authorImage",
      type: "image",
      group: "author",
      hidden: ({ document }) => {
        const typedDocument = document as { line?: string } | undefined;
        return typedDocument?.line !== "Ultra-Premium";
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alternative text",
          components: { input: AltTextFromField },
          options: {
            sourceField: "authorName",
            template: "${value}",
          } as StringOptions & AltTextFromFieldOptions,
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "name",
      line: "line",
      category: "category",
      media: "mainImage",
    },
    prepare(selection) {
      const { title, line, category, media } = selection as {
        title?: string;
        line?: string;
        category?: string;
        media?: unknown;
      };
      return {
        title: title || "Untitled Sauce",
        subtitle:
          (line && category && `${line} ${category} Sauce`) || line || category,
        // In Sanity preview, media can be an image field value; keep as-is.
        media: media as any,
      } as {
        title: string;
        subtitle?: string;
        media?: any;
      };
    },
  },
});
