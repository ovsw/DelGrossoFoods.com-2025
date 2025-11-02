import { EarthGlobeIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const site = defineType({
  name: "site",
  type: "document",
  title: "Site",
  icon: EarthGlobeIcon,
  description:
    "Manage each public website and its domains. Other documents reference a site so editors only see relevant content in their workspace.",
  fields: [
    defineField({
      name: "key",
      type: "string",
      title: "Key",
      description: "Stable identifier used in code and API lookups.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "label",
      type: "string",
      title: "Label",
      description: "Friendly title shown to editors when selecting the site.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "domains",
      type: "array",
      title: "Domains",
      description:
        "List every domain or host that should load this site (e.g. primary domain, preview hosts).",
      of: [{ type: "string" }],
      validation: (rule) => rule.unique(),
    }),
  ],
  preview: {
    select: {
      title: "label",
      subtitle: "key",
    },
  },
});
