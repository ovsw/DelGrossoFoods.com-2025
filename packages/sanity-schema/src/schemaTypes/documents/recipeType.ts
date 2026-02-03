import {
  BlockContentIcon,
  DocumentTextIcon,
  DropIcon,
  ImageIcon,
  TagIcon,
} from "@sanity/icons";
import type { SanityDocument } from "sanity";
import { defineArrayMember, defineField, defineType } from "sanity";

import { PathnameFieldComponent } from "../../components/slug-field-component";
import { createSlug } from "../../utils/slug";
import {
  createSlugValidator,
  createUniqueSlugRule,
} from "../../utils/slug-validation";

const isVersionSelected = (
  document: (SanityDocument & { versions?: string[] }) | undefined,
  version: string,
) => {
  const versions = document?.versions;
  return versions?.includes(version) || false;
};

const studioSiteCode = process.env.SANITY_STUDIO_SITE_CODE;
const isDgfStudio = studioSiteCode === "DGF";
const versionOptions = isDgfStudio
  ? [
      { title: "DGF", value: "DGF" },
      { title: "Organic", value: "Organic" },
      { title: "LFD", value: "LFD" },
    ]
  : [
      { title: "DGF", value: "DGF" },
      { title: "LFD", value: "LFD" },
    ];

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
      name: "dgf-content",
      title: "DGF Content",
      icon: BlockContentIcon,
    },
    {
      name: "lfd-content",
      title: "LFD Content",
      icon: BlockContentIcon,
    },
    {
      name: "organic-sauce",
      title: "Organic Sauce",
      icon: DropIcon,
      hidden: () => !isDgfStudio,
    },
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
      name: "versions",
      description: "What versions does this recipe have?",
      title: "Versions",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: versionOptions,
        layout: "grid",
      },
      validation: (rule) =>
        rule.required().error("At least one category must be selected"),
      group: "basic",
      initialValue: ["LFD"],
    }),
    defineField({
      name: "dgfSauces",
      title: "DGF Sauces used",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "sauce" }],
          weak: true,
        }),
      ],
      group: "dgf-content",
      description: "Link to one or more DGF sauces used in this recipe.",
      hidden: ({ document }) => !isVersionSelected(document, "DGF"),
    }),
    defineField({
      name: "lfdSauces",
      title: "LFD Sauces used",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "sauce" }],
          weak: true,
        }),
      ],
      group: "lfd-content",
      description: "Link to one or more DGF sauces used in this recipe.",
      hidden: ({ document }) => !isVersionSelected(document, "LFD"),
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
      name: "dgfIngredients",
      title: "Ingredients",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      group: "dgf-content",
      hidden: ({ document }) => !isVersionSelected(document, "DGF"),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!isVersionSelected(context.document, "DGF")) {
            return true;
          }
          return Array.isArray(value) && value.length > 0
            ? true
            : "Missing Ingredients for DGF version of recipe.";
        }),
    }),
    defineField({
      name: "dgfDirections",
      title: "Directions",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      group: "dgf-content",
      hidden: ({ document }) => !isVersionSelected(document, "DGF"),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!isVersionSelected(context.document, "DGF")) {
            return true;
          }
          return Array.isArray(value) && value.length > 0
            ? true
            : "Missing Directions for DGF version of recipe.";
        }),
    }),
    defineField({
      name: "dgfNotes",
      title: "Notes",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      group: "dgf-content",
      description: "Optional notes, tips, or variations for the recipe.",
      hidden: ({ document }) => !isVersionSelected(document, "DGF"),
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
      hidden: ({ document }) =>
        !(isDgfStudio && isVersionSelected(document, "Organic")),
    }),
    defineField({
      name: "lfdIngredients",
      title: "Ingredients",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      group: "lfd-content",
      hidden: ({ document }) => !isVersionSelected(document, "LFD"),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!isVersionSelected(context.document, "LFD")) {
            return true;
          }
          return Array.isArray(value) && value.length > 0
            ? true
            : "Missing Ingredients for LFD version of recipe.";
        }),
    }),
    defineField({
      name: "lfdDirections",
      title: "Directions",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      group: "lfd-content",
      hidden: ({ document }) => !isVersionSelected(document, "LFD"),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!isVersionSelected(context.document, "LFD")) {
            return true;
          }
          return Array.isArray(value) && value.length > 0
            ? true
            : "Missing Directions for LFD version of recipe.";
        }),
    }),
    defineField({
      name: "lfdNotes",
      title: "Notes",
      type: "array",
      of: [defineArrayMember({ type: "block" })],
      group: "lfd-content",
      description: "Optional notes, tips, or variations for the recipe.",
      hidden: ({ document }) => !isVersionSelected(document, "LFD"),
    }),
    defineField({
      name: "orderRank",
      title: "Order Rank",
      type: "string",
      hidden: true, // Hide this field from the editor
    }),
  ],
  preview: {
    select: {
      title: "name",
      media: "mainImage",
      versions: "versions",
    },
    prepare(selection) {
      const { title, media, versions } = selection;
      let subtitle = "";
      if (Array.isArray(versions) && versions.length > 0) {
        subtitle = versions
          .map((v) => (typeof v === "string" ? v.toUpperCase() : ""))
          .filter(Boolean)
          .join(", ");
      }
      return {
        title: title || "Untitled Recipe",
        subtitle,
        media,
      };
    },
  },
});
