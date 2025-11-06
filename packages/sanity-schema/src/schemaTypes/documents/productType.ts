import { ControlsIcon, PackageIcon, TagIcon } from "@sanity/icons"; // Assuming PackageIcon for product // Assuming Product type will be generated
import { defineArrayMember, defineField, defineType } from "sanity";

import { USDPriceInput } from "../../components/inputs/USDPriceInput";
import { PathnameFieldComponent } from "../../components/slug-field-component";
import { createSlug } from "../../utils/slug";
import {
  createSlugValidator,
  createUniqueSlugRule,
} from "../../utils/slug-validation";

export const productType = defineType({
  name: "product",
  title: "Product",
  type: "document",
  icon: PackageIcon, // Or another suitable icon
  groups: [
    { name: "basic", title: "Basic Info", icon: PackageIcon },
    { name: "shipping", title: "Shipping", icon: ControlsIcon },
    { name: "associations", title: "Associations", icon: TagIcon },
  ],
  fieldsets: [
    { name: "storeInfo", title: "Store Info", options: { columns: 2 } },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      group: "basic",
      validation: (Rule) => Rule.required().error("Product name is required."),
    }),
    defineField({
      name: "slug",
      type: "slug",
      title: "URL",
      description:
        "The web address for this product (automatically created from its name)",
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
            documentType: "Product",
            requiredPrefix: "/store/",
          }),
        ),
      ],
    }),
    defineField({
      name: "sku",
      title: "SKU",
      type: "string",
      group: "basic",
      fieldset: "storeInfo",
      validation: (Rule) =>
        Rule.required()
          .error("SKU is required.")
          .custom(async (sku, context) => {
            if (!sku) return true; // Allow empty values

            const { document, getClient } = context;
            const client = getClient({ apiVersion: "2025-02-19" });
            const id = document?._id.replace(/^drafts\./, "");

            // Query for any other documents with the same SKU, including their name
            const query = `*[_type == "product" && sku == $sku && !(_id in [$draft, $published])][0]{_id, name}`;
            const params = {
              draft: `drafts.${id}`,
              published: id,
              sku,
            };

            const result = await client.fetch(query, params);
            return result
              ? `This SKU is already in use by "${result.name}"`
              : true;
          }),
    }),
    defineField({
      name: "category",
      title: "Product Category",
      type: "string",
      group: "shipping",
      options: {
        list: [
          { title: "Case of 12", value: "case_of_12" },
          { title: "Gift Pack", value: "gift_pack" },
          { title: "Merchandise", value: "merchandise" },
        ],
        layout: "radio", // if fewer than 5 options
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "shippingCategory",
      title: "Shipping Category",
      type: "string",
      group: "shipping",
      options: {
        list: [
          {
            title: "Normal Item (ships together with others)",
            value: "normal_item",
          },
          {
            title: "Large Crate (ships separately from other items)",
            value: "large_crate",
          },
          {
            title: "Gift Pack (ships 2 in one large box)",
            value: "gift_pack",
          },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Short Description",
      type: "richText",
      group: "basic",
    }),
    defineField({
      name: "price",
      title: "Price",
      type: "number",
      group: "basic",
      fieldset: "storeInfo",
      validation: (Rule) => Rule.precision(2).min(0),
      components: {
        input: USDPriceInput,
      },
    }),
    defineField({
      name: "weight",
      title: "Weight (lb.)",
      type: "number",
      group: "shipping",
      validation: (Rule) => Rule.required().greaterThan(0),
    }),
    defineField({
      name: "sauces",
      title: "Associated Sauces",
      type: "array",
      group: "associations",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "sauce" }],
        }),
      ],
    }),
    defineField({
      name: "mainImage",
      type: "image",
      group: "basic",
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      sku: "sku",
      category: "category",
      media: "mainImage",
    },
    prepare(selection) {
      const { title, sku, category, media } = selection;
      const subtitles = [sku, category].filter(Boolean).join(" | ");
      return {
        title: title || "Untitled Product",
        subtitle: subtitles,
        media: media, // If you add an image field
      };
    },
  },
});
