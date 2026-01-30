import { ClockIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const timelineMarker = defineType({
  name: "timelineMarker",
  title: "Timeline Marker",
  type: "object",
  icon: ClockIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description:
        "The main title for this timeline entry (e.g., '1914 - The Beginning')",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      description: "An optional subtitle that appears below the heading",
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "richText",
      description: "The main content text for this timeline entry",
    }),
    defineField({
      name: "image",
      title: "Image",
      type: "image",
      description: "An image to display with this timeline entry",
      options: {
        hotspot: true,
      },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt Text",
          description:
            "Remember to use alt text for people to be able to read what is happening in the image if they are using a screen reader, it's also important for SEO",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "heading",
      subtitle: "content",
      media: "image",
    },
    prepare: ({ title, subtitle, media }) => {
      return {
        title: title || "Untitled Timeline Marker",
        subtitle: subtitle ? "Has content" : "No content",
        media,
      };
    },
  },
});
