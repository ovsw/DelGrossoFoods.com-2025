import { Command } from "lucide-react";
import { defineField, defineType } from "sanity";

export const button = defineType({
  name: "button",
  title: "Button",
  type: "object",
  icon: Command,
  fields: [
    defineField({
      name: "text",
      title: "Button Text",
      type: "string",
      description:
        "The text that appears on the button, like 'Learn More' or 'Get Started'",
    }),
    defineField({
      name: "url",
      title: "Url",
      type: "customUrl",
      description:
        "Where the button links to - can be an internal page or external website",
    }),
  ],
  preview: {
    select: {
      title: "text",
      externalUrl: "url.external",
      urlType: "url.type",
      internalUrl: "url.internal->slug.current",
      openInNewTab: "url.openInNewTab",
    },
    prepare: ({ title, externalUrl, urlType, internalUrl, openInNewTab }) => {
      const url = urlType === "external" ? externalUrl : internalUrl;
      const newTabIndicator = openInNewTab ? " ↗" : "";
      const truncatedUrl =
        url?.length > 30 ? `${url.substring(0, 30)}...` : url;

      return {
        title: title || "Untitled Button",
        subtitle: `${truncatedUrl}${newTabIndicator}`,
      };
    },
  },
});
