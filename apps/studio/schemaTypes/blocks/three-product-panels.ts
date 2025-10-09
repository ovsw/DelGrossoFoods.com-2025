import { defineField, defineType } from "sanity";

export const threeProductPanels = defineType({
  name: "threeProductPanels",
  title: "Three Product Panels",
  type: "object",
  icon: () => "🍝",
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
      name: "subtitle",
      title: "Subtitle",
      description: "Additional descriptive text below the main title",
      type: "text",
    }),
    defineField({
      name: "panels",
      title: "Product Panels",
      description: "The three product line panels to display",
      type: "array",
      of: [
        {
          type: "object",
          name: "productPanel",
          title: "Product Panel",
          fields: [
            defineField({
              name: "title",
              title: "Panel Title",
              type: "string",
              description: "The main title for this product line",
            }),
            defineField({
              name: "shortDescription",
              title: "Short Description",
              type: "text",
              description: "Brief description shown initially",
              rows: 2,
            }),
            defineField({
              name: "expandedDescription",
              title: "Expanded Description",
              type: "text",
              description: "Detailed description shown on hover",
              rows: 4,
            }),
            defineField({
              name: "image",
              title: "Panel Image",
              type: "image",
              description: "Image representing this product line",
              fields: [
                defineField({
                  name: "alt",
                  type: "string",
                  description:
                    "Remember to use alt text for people to be able to read what is happening in the image if they are using a screen reader, it's also important for SEO",
                  title: "Alt Text",
                }),
              ],
            }),
            defineField({
              name: "accentColor",
              title: "Accent Color",
              type: "string",
              description:
                "The accent color for this panel (red, green, or black)",
              options: {
                list: [
                  { title: "Deep Red (Original)", value: "red" },
                  { title: "Olive Green (Organic)", value: "green" },
                  { title: "Charcoal Black (La Famiglia)", value: "black" },
                ],
              },
              initialValue: "red",
            }),
            defineField({
              name: "ctaButton",
              title: "CTA Link",
              description:
                "Link that directs shoppers to the appropriate product collection or detail page",
              type: "object",
              fields: [
                defineField({
                  name: "text",
                  title: "Link Text",
                  type: "string",
                  description:
                    "Short, action-oriented text that appears on the link",
                }),
                defineField({
                  name: "url",
                  title: "Destination",
                  type: "customUrl",
                  description:
                    "Choose an internal page or enter an external URL for this link",
                }),
              ],
              preview: {
                select: {
                  title: "text",
                  urlType: "url.type",
                  internalSlug: "url.internal.slug.current",
                  externalUrl: "url.external",
                  openInNewTab: "url.openInNewTab",
                },
                prepare: ({
                  title,
                  urlType,
                  internalSlug,
                  externalUrl,
                  openInNewTab,
                }) => {
                  const destination =
                    urlType === "external"
                      ? externalUrl
                      : internalSlug
                        ? `/${internalSlug}`
                        : "No destination selected";
                  const newTabIndicator = openInNewTab ? " ↗" : "";

                  return {
                    title: title || "CTA Link",
                    subtitle: `${destination}${newTabIndicator}`,
                  };
                },
              },
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "shortDescription",
              media: "image",
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.required().min(3).max(3).error("Exactly 3 panels are required"),
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "eyebrow",
    },
    prepare: ({ title, subtitle }) => ({
      title: title || "Three Product Panels",
      subtitle: subtitle || "Product line showcase",
    }),
  },
});
