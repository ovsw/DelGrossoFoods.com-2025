import {
  BlockContentIcon,
  DocumentTextIcon,
  DropIcon,
  ImageIcon,
  TagIcon,
} from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

import { PathnameFieldComponent } from "../../components/slug-field-component";
import { GROUP } from "../../utils/constant";
import { ogFields } from "../../utils/og-fields";
import { recipeSeoFields } from "../../utils/seo-fields";
import { createSlug } from "../../utils/slug";
import {
  createSlugValidator,
  createUniqueSlugRule,
} from "../../utils/slug-validation";

type PortableTextValidationBlock = {
  _type?: string;
  listItem?: string;
  children?: Array<{
    _type?: string;
    text?: string;
  }>;
};

const pseudoListPatterns = [/^\s*-\s+/u, /^\s*\d+\.\s+/u];

const hasPseudoListText = (value: unknown): boolean => {
  if (!Array.isArray(value)) return false;

  return value.some((item) => {
    const block = item as PortableTextValidationBlock;

    if (block?._type !== "block" || typeof block.listItem === "string") {
      return false;
    }

    if (!Array.isArray(block.children)) {
      return false;
    }

    return block.children.some((child) => {
      if (child?._type !== "span" || typeof child.text !== "string") {
        return false;
      }

      return child.text
        .replace(/\r/gu, "")
        .split("\n")
        .some((line) =>
          pseudoListPatterns.some((pattern) => pattern.test(line)),
        );
    });
  });
};

const validatePortableTextListUsage = (value: unknown) => {
  if (!hasPseudoListText(value)) {
    return true;
  }

  return "Use the Portable Text bullet or numbered list controls instead of typing '-' or '1.' manually.";
};

const hasReferenceArray = (value: unknown): boolean =>
  Array.isArray(value) && value.length > 0;

const isDefinedReference = (value: unknown): boolean =>
  Boolean(value && typeof value === "object");

const studioSiteCode = process.env.SANITY_STUDIO_SITE_CODE;
const isDgfStudio = studioSiteCode === "DGF";

export const recipeType = defineType({
  name: "recipe",
  title: "Recipe",
  type: "document",
  icon: DocumentTextIcon, // Or a more specific recipe icon if available
  groups: [
    {
      name: "basic",
      title: "Basic Info.",
      icon: DocumentTextIcon,
    },
    { name: "media", title: "Media", icon: ImageIcon },
    { name: "categories", title: "Category & Tags", icon: TagIcon },
    {
      name: "main-content",
      title: "Main Content",
      icon: BlockContentIcon,
    },
    {
      name: "sauces",
      title: "Sauces",
      icon: BlockContentIcon,
    },
    {
      name: "organic-sauce",
      title: "Organic Sauce",
      icon: DropIcon,
      hidden: () => !isDgfStudio,
    },
    { name: GROUP.SEO, title: "SEO" },
    { name: GROUP.OG, title: "Open Graph" },
  ],
  fieldsets: [{ name: "extra-info", options: { columns: 2 } }],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) =>
        Rule.required().error("A name is required for the recipe."),
      group: "basic",
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "URL",
      description:
        "The web address for this recipe (automatically created from its name)",
      group: "basic",
      components: {
        field: PathnameFieldComponent,
      },
      options: {
        source: "name",
        slugify: createSlug,
      },
      validation: (Rule) => [
        Rule.required().error("A URL slug is required"),
        Rule.custom(createUniqueSlugRule()),
        Rule.custom(
          createSlugValidator({
            documentType: "Recipe",
            requiredPrefix: "/recipes/",
          }),
        ),
      ],
    }),
    defineField({
      name: "dgfSauces",
      title: "DGF Sauces used",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "sauce" }],
          options: {
            filter: 'line == "Original"',
          },
        }),
      ],
      group: "sauces",
      description: "Link to one or more DGF sauces used in this recipe.",
    }),
    defineField({
      name: "lfdSauces",
      title: "LFD Sauces used",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "sauce" }],
          options: {
            filter: 'line == "Ultra-Premium"',
          },
        }),
      ],
      group: "sauces",
      description: "Link to one or more LFD sauces used in this recipe.",
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      fieldset: "extra-info",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: [
          { title: "Low-Carb", value: "low-carb" },
          { title: "Quick-to-Make", value: "quick-to-make" },
          { title: "Vegetarian", value: "vegetarian" },
          { title: "Gluten-free", value: "gluten-free" },
        ],
      },
      group: "categories",
    }),
    defineField({
      name: "meat",
      title: "Meat",
      type: "array",
      fieldset: "extra-info",
      of: [defineArrayMember({ type: "string" })],
      options: {
        list: [
          { title: "Beef", value: "beef" },
          { title: "Pork", value: "pork" },
          { title: "Poultry", value: "poultry" },
          { title: "Seafood", value: "seafood" },
          { title: "No meat", value: "none" },
        ],
      },
      group: "categories",
    }),
    defineField({
      name: "serves",
      title: "Serves",
      type: "string",
      group: "basic",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "recipeCategory" }],
        }),
      ],
      group: "categories",
      description: "Categorize this recipe (e.g., Dinner, Dessert).",
    }),

    defineField({
      name: "mainImage",
      title: "Main Image",
      type: "image",
      options: { hotspot: true },
      group: "media",
    }),
    defineField({
      name: "video",
      title: "Recipe Video",
      type: "object",
      options: {
        collapsible: true,
        collapsed: false,
      },
      group: "media",
      fields: [
        defineField({
          name: "asset",
          title: "Mux Video",
          description:
            "Upload the recipe video. Signed playback is enabled, so use the Mux input to manage the asset.",
          type: "mux.video",
          validation: (Rule) =>
            Rule.required().error(
              "A recipe video is required when this section is enabled.",
            ),
        }),
        defineField({
          name: "posterImage",
          title: "Poster Image",
          description:
            "Optional poster image shown before playback. Defaults to the Mux thumbnail if left empty.",
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),

    defineField({
      name: "ingredients",
      title: "Ingredients",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      group: "main-content",
      description: "Unified recipe ingredients used by both sites.",
      validation: (Rule) => [
        Rule.required().error("Ingredients are required."),
        Rule.custom((value) => validatePortableTextListUsage(value)),
      ],
    }),
    defineField({
      name: "directions",
      title: "Directions",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      group: "main-content",
      description: "Unified recipe directions used by both sites.",
      validation: (Rule) => [
        Rule.required().error("Directions are required."),
        Rule.custom((value) => validatePortableTextListUsage(value)),
      ],
    }),
    defineField({
      name: "notes",
      title: "Notes",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      group: "main-content",
      description: "Unified optional recipe notes used by both sites.",
      validation: (Rule) =>
        Rule.custom((value) => validatePortableTextListUsage(value)),
    }),
    defineField({
      name: "organicSauce",
      title: "Organic Sauce",
      type: "reference",
      to: [{ type: "sauce" }],
      group: "organic-sauce",
      description: "Select an organic sauce (DGF only).",
      options: {
        filter: 'line == "Organic"',
      },
      hidden: () => !isDgfStudio,
    }),
    defineField({
      name: "orderRank",
      title: "Order Rank",
      type: "string",
      hidden: true, // Hide this field from the editor
    }),
    ...recipeSeoFields.filter((field) => field.name !== "seoHideFromLists"),
    ...ogFields,
  ],
  preview: {
    select: {
      title: "name",
      media: "mainImage",
      dgfSauces: "dgfSauces",
      lfdSauces: "lfdSauces",
      organicSauce: "organicSauce",
    },
    prepare(selection) {
      const { title, media, dgfSauces, lfdSauces, organicSauce } = selection;
      const availability: string[] = [];

      if (hasReferenceArray(dgfSauces)) {
        availability.push("DGF");
      }
      if (hasReferenceArray(lfdSauces)) {
        availability.push("LFD");
      }
      if (isDefinedReference(organicSauce)) {
        availability.push("Organic");
      }

      return {
        title: title || "Untitled Recipe",
        subtitle: availability.join(", "),
        media,
      };
    },
  },
});
