import { EarthGlobeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const site = defineType({
  name: "site",
  title: "Site",
  type: "document",
  icon: EarthGlobeIcon,
  description:
    "Top-level site variant. Documents reference a site to scope their content to DelGrosso Foods or La Famiglia DelGrosso.",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description: "Human-friendly site name shown in the Studio.",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "code",
      title: "Site Code",
      description:
        "Stable code used in queries and environment configuration (e.g., DGF, LFD).",
      type: "string",
      options: {
        list: [
          { title: "DelGrosso Foods", value: "DGF" },
          { title: "La Famiglia DelGrosso", value: "LFD" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      description:
        "Internal notes about the site variant. This field is optional and never surfaces on the frontend.",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "code",
    },
    prepare(selection) {
      const { title, subtitle } = selection;
      return {
        title: title || "Site",
        subtitle: subtitle || undefined,
      };
    },
  },
});
