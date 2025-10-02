import { TimelineIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const timeline = defineType({
  name: "timeline",
  title: "Timeline",
  type: "object",
  icon: TimelineIcon,
  fields: [
    defineField({
      name: "markers",
      title: "Timeline Markers",
      type: "array",
      description: "The individual entries that make up this timeline",
      of: [
        {
          type: "timelineMarker",
        },
      ],
    }),
  ],
  preview: {
    select: {
      markers: "markers",
    },
    prepare: ({ markers }) => {
      const count = markers?.length || 0;
      return {
        title: `Timeline with ${count} marker${count !== 1 ? "s" : ""}`,
        subtitle:
          count > 0
            ? `${count} timeline marker${count !== 1 ? "s" : ""}`
            : "No markers",
      };
    },
  },
});
