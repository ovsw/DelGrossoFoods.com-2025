import { defineArrayMember, defineField, defineType } from "sanity";
import { StoreIcon } from "lucide-react";

const US_STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
  "District of Columbia",
];

const toSlug = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const US_STATE_TAGS = US_STATES.map((state) => ({
  label: state,
  value: toSlug(state),
}));

type ProductLineStatesEntry = {
  productLine?: string;
};

const PRODUCT_LINE_OPTIONS = [
  { title: "Original", value: "Original" },
  { title: "Organic", value: "Organic" },
  {
    title: "LFD - pizza and pasta sauce",
    value: "LFD - pizza and pasta sauce",
  },
  { title: "LFD - Sloppy Joe Sauce", value: "LFD - Sloppy Joe Sauce" },
];

export const retailer = defineType({
  name: "retailer",
  title: "Retailer",
  description:
    "Stores available product lines by U.S. state for where-to-buy content.",
  type: "document",
  icon: StoreIcon,
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      description: "Retailer name is required and must be unique.",
      validation: (Rule) =>
        Rule.required().custom(async (value, context) => {
          if (!value || typeof value !== "string") return true;
          const { document, getClient } = context;
          const client = getClient({ apiVersion: "2025-02-19" });
          const id = (document?._id ?? "").replace(/^drafts\./, "");
          const existing = await client.fetch(
            `*[_type == "retailer" && name == $name && !(_id in [$draft, $published])][0]{_id}`,
            {
              name: value,
              draft: `drafts.${id}`,
              published: id,
            },
          );
          return existing ? "Another retailer already uses that name." : true;
        }),
    }),
    defineField({
      name: "productLinesByState",
      title: "Product Lines by State",
      description:
        "Map each product line to the states where this retailer carries it.",
      type: "array",
      of: [
        defineArrayMember({
          name: "productLineStatesEntry",
          title: "Product line availability",
          type: "object",
          fields: [
            defineField({
              name: "productLine",
              title: "Product Line",
              type: "string",
              options: {
                list: PRODUCT_LINE_OPTIONS,
              },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "states",
              title: "States",
              description:
                "Add every state where this product line is available for the retailer.",
              type: "tags",
              options: {
                predefinedTags: US_STATE_TAGS,
                allowCreate: false,
              },
              validation: (Rule) =>
                Rule.required()
                  .min(1)
                  .unique()
                  .error("Each state should be listed once per product line."),
            }),
          ],
        }),
      ],
      validation: (Rule) =>
        Rule.custom((value?: ProductLineStatesEntry[]) => {
          if (!value) return true;
          const productLines = value
            .map((entry) => entry?.productLine)
            .filter((entry): entry is string => Boolean(entry));
          if (new Set(productLines).size !== productLines.length) {
            return "Each product line can only be listed once.";
          }
          return true;
        }),
    }),
  ],
  preview: {
    select: {
      title: "name",
    },
    prepare(selection) {
      return {
        title: selection.title || "Untitled retailer",
      };
    },
  },
});
