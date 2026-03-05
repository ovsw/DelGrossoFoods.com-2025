import { UsersIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

import { siteReferenceField } from "../common";

export const leader = defineType({
  name: "leader",
  title: "Leader",
  type: "document",
  icon: UsersIcon,
  fields: [
    siteReferenceField,
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "position",
      title: "Position",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "position",
      media: "image",
    },
    prepare: ({ title, subtitle, media }) => ({
      title: title || "Untitled Leader",
      subtitle: subtitle || "No position",
      media,
    }),
  },
});
